const PROJECT_INTERNAL_MAP = {
  "tourex-travel-booking-platform": "https://tourex.themedox.com/",
  "lusion-creative-tech-webgl": "https://lusion.co/",
  "oryzo-ai-autonomous-platform": "https://oryzo.ai/",
  "tourex": "https://tourex.themedox.com/",
  "lusion": "https://lusion.co/",
  "oryzo": "https://oryzo.ai/",
};

export default async function handler(req, res) {
  try {
    let targetUrl = null;
    const slug = req.query.slug || req.query.project;
    if (slug === "ecommerce-mobile-app" || slug === "bagisto-ecommerce-mobile-app") {
      return res.redirect(302, "/project-details?slug=ecommerce-mobile-app");
    }
    if (slug && PROJECT_INTERNAL_MAP[slug]) {
      targetUrl = PROJECT_INTERNAL_MAP[slug];
    } else if (req.query.url) {
      targetUrl = decodeURIComponent(req.query.url);
    }

    if (!targetUrl) {
      return res.status(400).send("Missing project or url parameter");
    }

    const parsedUrl = new URL(targetUrl);
    const origin = parsedUrl.origin;

    const upstreamResponse = await fetch(targetUrl, {
      method: req.method || "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: origin,
      },
      redirect: "follow",
    });

    const contentType = upstreamResponse.headers.get("content-type") || "";

    // Forward status code
    res.status(upstreamResponse.status);

    // Strict security headers: Sameorigin only, no external sharing
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");

    if (contentType.includes("text/html")) {
      let html = await upstreamResponse.text();

      // Security protection script injected into the embedded document
      const protectionScript = `
        <script>
          (function() {
            // 1. Disable Right-Click context menu to prevent 'Copy Link Address' or 'Inspect'
            document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
              return false;
            }, true);

            // 2. Disable DevTools & Source View shortcuts
            document.addEventListener('keydown', function(e) {
              if (
                e.key === 'F12' ||
                (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
              ) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }, true);

            // 3. Block window.open programmatically
            window.open = function() {
              console.warn('[Protected Sandbox] External window open blocked.');
              return null;
            };

            // 4. Intercept link clicks to prevent navigating away to external sites
            document.addEventListener('click', function(e) {
              var anchor = e.target.closest('a');
              if (!anchor) return;

              // Neutralize target="_blank"
              if (anchor.getAttribute('target') === '_blank') {
                anchor.removeAttribute('target');
              }

              var href = anchor.getAttribute('href');
              if (!href || href === '#' || href.startsWith('javascript:')) return;

              // Check external destination
              try {
                var currentOrigin = "${origin}";
                var target = new URL(href, currentOrigin);
                var isExternal = target.origin !== currentOrigin ||
                  target.hostname.includes('facebook') ||
                  target.hostname.includes('twitter') ||
                  target.hostname.includes('x.com') ||
                  target.hostname.includes('instagram') ||
                  target.hostname.includes('linkedin') ||
                  target.hostname.includes('themeforest') ||
                  target.hostname.includes('envato') ||
                  target.hostname.includes('themedox') ||
                  target.protocol.startsWith('mailto:') ||
                  target.protocol.startsWith('tel:');

                if (isExternal) {
                  e.preventDefault();
                  e.stopPropagation();

                  // Subtle in-frame warning pill
                  var notice = document.getElementById('twj-sandbox-notice');
                  if (!notice) {
                    notice = document.createElement('div');
                    notice.id = 'twj-sandbox-notice';
                    notice.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(12,7,27,0.95);border:1px solid #00DFD8;color:#ffffff;padding:8px 18px;border-radius:30px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:12px;font-weight:600;z-index:9999999;box-shadow:0 10px 30px rgba(0,0,0,0.8);display:flex;align-items:center;gap:8px;pointer-events:none;transition:opacity 0.3s ease;';
                    notice.innerHTML = '<span style="color:#00DFD8;">&#9679; Protected Session:</span> External link navigation is restricted.';
                    document.body.appendChild(notice);
                  }
                  notice.style.opacity = '1';
                  setTimeout(function() { notice.style.opacity = '0'; }, 2500);
                  return false;
                }
              } catch(err) {}
            }, true);
          })();
        </script>
      `;

      // Rebrand any third party company references
      html = html
        .replace(/Webkul Software \(Registered in India\)/gi, "TechWithJoshi Private Limited (Registered in India)")
        .replace(/Webkul Software/gi, "TechWithJoshi Private Limited")
        .replace(/Webkul/gi, "TechWithJoshi");

      // Inject base tag so relative assets load directly from target origin
      const baseTag = `<base href="${origin}/">${protectionScript}`;
      if (html.includes("<head>")) {
        html = html.replace("<head>", `<head>${baseTag}`);
      } else if (html.includes("<head ")) {
        html = html.replace(/<head[^>]*>/i, (match) => `${match}${baseTag}`);
      } else {
        html = `${baseTag}${html}`;
      }

      // Neutralize common frame busting scripts
      html = html.replace(/top\.location\s*!==?\s*self\.location/g, "false");
      html = html.replace(/window\.top\s*!==?\s*window\.self/g, "false");
      html = html.replace(/top\.location\.replace/g, "console.log");

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(html);
    } else {
      res.setHeader("Content-Type", contentType);
      const buffer = await upstreamResponse.arrayBuffer();
      return res.send(Buffer.from(buffer));
    }
  } catch (err) {
    console.error("Proxy embed error:", err);
    return res.status(500).send("Error embedding project preview");
  }
}
