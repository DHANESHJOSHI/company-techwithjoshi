import { Readable } from "stream";

const TARGET_ORIGIN = "https://commerce.bagisto.com";
const PROXY_PATH = "/api/project-preview";

export const config = {
  api: {
    bodyParser: false, // Allow streaming of request body for POST/uploads
    responseLimit: false,
  },
};

// Helper to buffer request body if needed
async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  try {
    const { path } = req.query;
    const pathStr = Array.isArray(path) ? path.join("/") : path || "";
    
    // Extract query string from req.url
    const queryIndex = req.url.indexOf("?");
    const queryString = queryIndex !== -1 ? req.url.substring(queryIndex) : "";

    const targetUrl = `${TARGET_ORIGIN}/${pathStr}${queryString}`;

    // Prepare headers to forward to upstream
    const forwardHeaders = { ...req.headers };
    delete forwardHeaders.host;
    delete forwardHeaders.connection;
    delete forwardHeaders["content-length"];
    delete forwardHeaders["x-forwarded-host"];
    delete forwardHeaders["x-forwarded-proto"];
    delete forwardHeaders["x-forwarded-for"];
    delete forwardHeaders["x-forwarded-server"];
    delete forwardHeaders["x-forwarded-port"];
    delete forwardHeaders["x-original-host"];
    forwardHeaders["host"] = "commerce.bagisto.com";
    forwardHeaders["origin"] = TARGET_ORIGIN;
    forwardHeaders["referer"] = TARGET_ORIGIN;
    forwardHeaders["accept-encoding"] = "identity"; // Plain text to ensure HTML rewriting works reliably

    // Build fetch options
    const fetchOptions = {
      method: req.method,
      headers: forwardHeaders,
      redirect: "manual", // Handle redirects manually to rewrite Location headers
    };

    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method.toUpperCase())) {
      const bodyBuffer = await getRawBody(req);
      if (bodyBuffer.length > 0) {
        fetchOptions.body = bodyBuffer;
      }
    }

    const upstreamResponse = await fetch(targetUrl, fetchOptions);

    // Forward status code
    const status = upstreamResponse.status;

    // Handle redirects (301, 302, 303, 307, 308)
    if ([301, 302, 303, 307, 308].includes(status)) {
      const location = upstreamResponse.headers.get("location");
      if (location) {
        const rewrittenLocation = location
          .replace("https://commerce.bagisto.com", PROXY_PATH)
          .replace("http://commerce.bagisto.com", PROXY_PATH)
          .replace("https://localhost:3000", PROXY_PATH)
          .replace("http://localhost:3000", PROXY_PATH);
        res.setHeader("Location", rewrittenLocation);
      }
      res.status(status).end();
      return;
    }

    // Copy safe headers from upstream
    upstreamResponse.headers.forEach((val, key) => {
      const lower = key.toLowerCase();
      // STRIP X-Frame-Options and CSP so iframe works seamlessly!
      if (
        lower === "x-frame-options" ||
        lower === "content-security-policy" ||
        lower === "content-security-policy-report-only" ||
        lower === "content-encoding" ||
        lower === "content-length" ||
        lower === "transfer-encoding"
      ) {
        return;
      }

      if (lower === "set-cookie") {
        // Rewrite cookie domain & path
        const rewrittenCookie = val
          .replace(/Domain=[^;]+;?/gi, "")
          .replace(/Path=[^;]+;?/gi, `Path=${PROXY_PATH};`)
          .replace(/SameSite=Lax/gi, "SameSite=None; Secure");
        res.setHeader("Set-Cookie", rewrittenCookie);
        return;
      }

      res.setHeader(key, val);
    });

    // Explicitly allow embedding from our own domain and enable CORS
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Cache-Control", "public, max-age=600, s-maxage=3600");

    if (req.method.toUpperCase() === "HEAD") {
      res.status(status).end();
      return;
    }

    const contentType = upstreamResponse.headers.get("content-type") || "";

    // If HTML: rewrite all URLs, inject base tag and anti-extract script
    if (contentType.includes("text/html")) {
      let html = await upstreamResponse.text();

      // Rewrite absolute bagisto and localhost URLs
      html = html
        .replace(/https:\/\/commerce\.bagisto\.com/g, PROXY_PATH)
        .replace(/http:\/\/commerce\.bagisto\.com/g, PROXY_PATH)
        .replace(/https:\/\/localhost:3000/g, PROXY_PATH)
        .replace(/http:\/\/localhost:3000/g, PROXY_PATH)
        .replace(/https:\\\/\\\/commerce\.bagisto\.com/g, "\\/api\\/project-preview")
        .replace(/https:\\\/\\\/localhost:3000/g, "\\/api\\/project-preview")
        .replace(/https:\/\/bagisto\.com\/en\/cloud\//g, "#")
        .replace(/https:\/\/bagisto\.com/g, "#");

      // Brand Replacement: Webkul Software -> TechWithJoshi Private Limited
      html = html
        .replace(/Webkul Software \(Registered in India\)/gi, "TechWithJoshi Private Limited (Registered in India)")
        .replace(/Webkul Software/gi, "TechWithJoshi Private Limited")
        .replace(/Webkul/gi, "TechWithJoshi")
        .replace(/webkul/gi, "techwithjoshi")
        .replace(/Copyright 2010 - 2026/gi, "Copyright 2024 - 2026")
        .replace(/Copyright 2010/gi, "Copyright 2024");

      // Rewrite root-relative asset URLs so they go through PROXY_PATH
      html = html
        .replace(/href="\/themes\//g, `href="${PROXY_PATH}/themes/`)
        .replace(/src="\/themes\//g, `src="${PROXY_PATH}/themes/`)
        .replace(/href="\/storage\//g, `href="${PROXY_PATH}/storage/`)
        .replace(/src="\/storage\//g, `src="${PROXY_PATH}/storage/`)
        .replace(/href="\/cache\//g, `href="${PROXY_PATH}/cache/`)
        .replace(/src="\/cache\//g, `src="${PROXY_PATH}/cache/`)
        .replace(/href="\/vendor\//g, `href="${PROXY_PATH}/vendor/`)
        .replace(/src="\/vendor\//g, `src="${PROXY_PATH}/vendor/`)
        .replace(/href="\/favicon/g, `href="${PROXY_PATH}/favicon`);

      // Anti-Inspect, Anti-Right Click, Anti-Extraction Script & Styles
      const protectionScript = `
        <style>
          .demo-header { display: none !important; }
          body {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          input, textarea, [contenteditable] {
            -webkit-user-select: auto !important;
            -moz-user-select: auto !important;
            -ms-user-select: auto !important;
            user-select: auto !important;
          }
        </style>
        <script>
          (function() {
            // Rebrand footer content dynamically
            function rebrandFooter() {
              var elements = document.querySelectorAll('p, span, div, a, small, footer');
              for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 && el.textContent && el.textContent.includes('Webkul')) {
                  el.textContent = el.textContent
                    .replace(/Webkul Software \\(Registered in India\\)/gi, 'TechWithJoshi Private Limited (Registered in India)')
                    .replace(/Webkul Software/gi, 'TechWithJoshi Private Limited')
                    .replace(/Webkul/gi, 'TechWithJoshi')
                    .replace(/2010 - 2026/gi, '2024 - 2026');
                }
              }
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', rebrandFooter);
            } else {
              rebrandFooter();
            }
            try {
              var observer = new MutationObserver(rebrandFooter);
              observer.observe(document.documentElement, { childList: true, subtree: true });
            } catch(e) {}

            // Prevent frame breakout: keep within iframe
            if (window.top === window.self) {
              window.location.replace('/project-details?slug=enterprise-headless-ecommerce');
            }

            // Disable window.open to prevent opening links in new tabs/windows
            window.open = function() { return null; };

            // Disable Right-Click Context Menu
            document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
              return false;
            }, true);

            // Disable Inspect Keyboard Shortcuts
            document.addEventListener('keydown', function(e) {
              if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
                (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
                (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C' || e.key === 'u' || e.key === 'U'))
              ) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }, true);

            // Prevent opening links in new tabs / window breakout
            document.addEventListener('click', function(e) {
              var target = e.target;
              while (target && target.tagName !== 'A') {
                target = target.parentElement;
              }
              if (target && target.tagName === 'A') {
                var href = target.getAttribute('href');
                if (href && (href.startsWith('http://') || href.startsWith('https://')) && !href.includes('/api/project-preview')) {
                  target.setAttribute('href', '#');
                }
                if (target.getAttribute('target') === '_blank') {
                  target.removeAttribute('target');
                }
              }
            }, true);

            // Block drag to prevent dragging URLs
            document.addEventListener('dragstart', function(e) {
              e.preventDefault();
              return false;
            });
          })();
        </script>
      `;

      // Inject base tag and protection script right after <head>
      const baseTag = `<base href="${PROXY_PATH}/">\n${protectionScript}`;
      if (html.includes("<head>")) {
        html = html.replace("<head>", `<head>\n${baseTag}`);
      } else if (html.includes("<head ")) {
        html = html.replace(/(<head[^>]*>)/i, `$1\n${baseTag}`);
      } else {
        html = baseTag + html;
      }

      res.status(status).send(html);
      return;
    }

    // If JSON or text, replace bagisto domains and Webkul branding if present
    if (contentType.includes("application/json") || contentType.includes("text/plain") || contentType.includes("application/javascript")) {
      let text = await upstreamResponse.text();
      text = text
        .replace(/https:\/\/commerce\.bagisto\.com/g, PROXY_PATH)
        .replace(/http:\/\/commerce\.bagisto\.com/g, PROXY_PATH)
        .replace(/https:\\\/\\\/commerce\.bagisto\.com/g, "\\/api\\/project-preview")
        .replace(/Webkul Software \(Registered in India\)/gi, "TechWithJoshi Private Limited (Registered in India)")
        .replace(/Webkul Software/gi, "TechWithJoshi Private Limited")
        .replace(/Webkul/gi, "TechWithJoshi");
      res.status(status).send(text);
      return;
    }

    // Binary / assets: stream directly
    const arrayBuffer = await upstreamResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.status(status).send(buffer);
  } catch (err) {
    console.error("Project preview proxy error:", err);
    res.status(500).json({ error: "Failed to load project preview" });
  }
}
