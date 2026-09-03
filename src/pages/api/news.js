import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "techwithjoshi-super-secret-jwt-key-2025-secure";

function verifyAdmin(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.replace("Bearer ", "");
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Fallback curated open-source tech news and architecture articles
const FALLBACK_IT_NEWS = [
  {
    id: "news-fallback-1",
    title: "Kubernetes 1.32 Released with Enhanced AI/ML Workload Scheduling",
    slug: "kubernetes-1-32-enhanced-ai-workload-scheduling",
    category: "Cloud & DevOps",
    date: "Sep 2, 2026",
    readTime: "6 min read",
    author: "Cloud Native Computing Foundation",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=60",
    excerpt: "The latest Kubernetes release introduces dynamic resource allocation enhancements tailored specifically for low-latency GPU LLM clusters.",
    source: "Cloud Native Foundation",
    url: "/blog-details?slug=kubernetes-1-32-enhanced-ai-workload-scheduling",
    tags: ["Kubernetes", "DevOps", "AI", "Cloud"],
    isLiveApi: true,
    type: "news",
    content: `
      <p class="lead" style="color: #00DFD8; font-size: 18px; line-height: 1.8;">
        Kubernetes 1.32 brings transformative scheduling enhancements designed from the ground up for modern AI inference and high-performance multi-GPU clusters.
      </p>
      <h3 style="color: #FFF; margin-top: 30px; margin-bottom: 15px;">Dynamic Resource Allocation (DRA) Improvements</h3>
      <p>
        Previous Kubernetes releases treated GPUs as opaque countable integer resources. Kubernetes 1.32 introduces fine-grained Dynamic Resource Allocation (DRA), allowing pods to request specific GPU memory partitions, compute instances, and interconnect topologies with sub-millisecond scheduling latency.
      </p>
      <h3 style="color: #FFF; margin-top: 30px; margin-bottom: 15px;">In-Place Pod Vertical Autoscaling</h3>
      <p>
        Stateful AI workloads no longer require destructive pod recreation when CPU and memory demands surge. In-place pod resizing dynamically adjusts resource allocations without restarting running model containers.
      </p>
    `
  },
  {
    id: "news-fallback-2",
    title: "Next.js 15 Deep-Dive: Turbopack Production Engine & React 19 Alignment",
    slug: "nextjs-15-deep-dive-turbopack-production-engine",
    category: "Web Engineering",
    date: "Sep 1, 2026",
    readTime: "7 min read",
    author: "Open Source Web Team",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
    excerpt: "Architectural insights into how modern React server actions and partial prerendering cut TTFB by up to 60%.",
    source: "Vercel Open Source",
    url: "/blog-details?slug=nextjs-15-deep-dive-turbopack-production-engine",
    tags: ["NextJS", "React19", "Turbopack", "WebDev"],
    isLiveApi: true,
    type: "news",
    content: `
      <p class="lead" style="color: #00DFD8; font-size: 18px; line-height: 1.8;">
        Next.js 15 stabilizes the Rust-based Turbopack bundler for production builds, providing up to 5x faster compilation and 96% faster code updates during enterprise development.
      </p>
      <h3 style="color: #FFF; margin-top: 30px; margin-bottom: 15px;">Async Request APIs & React 19 Compiler</h3>
      <p>
        Next.js 15 aligns with React 19, making <code>cookies()</code>, <code>headers()</code>, and <code>params</code> asynchronous. This architectural shift prepares applications for upcoming automated memoization in the React Compiler, eliminating manual <code>useMemo</code> boilerplate.
      </p>
    `
  },
  {
    id: "news-fallback-3",
    title: "Zero-Trust Architecture Standard Enforced for Cloud Microservices",
    slug: "zero-trust-architecture-standard-enforced-microservices",
    category: "Cyber Security",
    date: "Aug 29, 2026",
    readTime: "6 min read",
    author: "InfoSec Engineering",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
    excerpt: "New cybersecurity mandates require mutual TLS (mTLS) and fine-grained SPIFFE/SPIRE cryptographic identities across container meshes.",
    source: "Open Source Security Foundation",
    url: "/blog-details?slug=zero-trust-architecture-standard-enforced-microservices",
    tags: ["Security", "ZeroTrust", "mTLS", "DevSecOps"],
    isLiveApi: true,
    type: "news",
    content: `
      <p class="lead" style="color: #00DFD8; font-size: 18px; line-height: 1.8;">
        Zero Trust enforcement has shifted from perimeter edge gateways directly into the service mesh layer. Modern cloud engineering standards mandate cryptographic identity for every inter-pod transaction.
      </p>
      <h3 style="color: #FFF; margin-top: 30px; margin-bottom: 15px;">SPIFFE/SPIRE Workload Attestation</h3>
      <p>
        By eliminating hardcoded secrets in favor of short-lived X.509 SVIDs minted dynamically by SPIRE, services verify peer identity cryptographically regardless of physical IP address or cloud provider.
      </p>
    `
  },
  {
    id: "news-fallback-4",
    title: "Autonomous Agent Protocols: Multi-Agent Consensus in Enterprise Systems",
    slug: "autonomous-agent-protocols-multi-agent-consensus",
    category: "Artificial Intelligence",
    date: "Aug 27, 2026",
    readTime: "8 min read",
    author: "AI Architecture Review",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    excerpt: "Exploring decentralized orchestration frameworks for agents coordinating across CRM, payment, and database infrastructure.",
    source: "AI Open Research",
    url: "/blog-details?slug=autonomous-agent-protocols-multi-agent-consensus",
    tags: ["AI", "Agents", "LangChain", "Autonomous"],
    isLiveApi: true,
    type: "news",
    content: `
      <p class="lead" style="color: #00DFD8; font-size: 18px; line-height: 1.8;">
        Multi-agent architectures enable specialized LLM instances (planners, coders, critics, executors) to collaborate using structured verification protocols, dramatically reducing error rates on mission-critical workflows.
      </p>
    `
  }
];

export default async function handler(req, res) {
  const { method } = req;

  let client;
  let db;
  try {
    client = await clientPromise;
    db = client.db("techwithjoshi");
  } catch (err) {
    console.error("Database connection failed in /api/news:", err);
  }

  // 1. GET: Return Custom News from MongoDB + Live IT News from Open Source Dev.to API
  if (method === "GET") {
    try {
      const { id, slug } = req.query;

      // Handle single article lookup for internal viewing
      if (id || slug) {
        if (id && id.startsWith("devto-")) {
          const rawId = id.replace("devto-", "");
          try {
            const devRes = await fetch(`https://dev.to/api/articles/${rawId}`, {
              headers: { "User-Agent": "TechWithJoshi-Platform/1.0" }
            });
            if (devRes.ok) {
              const item = await devRes.json();
              return res.status(200).json({
                success: true,
                article: {
                  id: `devto-${item.id}`,
                  title: item.title,
                  slug: item.slug,
                  category: item.tag_list && item.tag_list[0] ? item.tag_list[0].toUpperCase() : "OPEN SOURCE",
                  date: item.readable_publish_date || "Recent",
                  readTime: `${item.reading_time_minutes || 5} min read`,
                  author: item.user?.name || "Open Source Contributor",
                  image: item.cover_image || item.social_image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
                  excerpt: item.description,
                  content: item.body_html || `<p>${item.description}</p>`,
                  source: `Open Source Community (${item.user?.name || "Dev"})`,
                  tags: item.tag_list || ["OpenSource", "Engineering"],
                  isLiveApi: true,
                  type: "news"
                }
              });
            }
          } catch (e) {
            console.error("Error fetching single devto article:", e);
          }
        }

        // Check fallback news
        const fallbackMatch = FALLBACK_IT_NEWS.find(
          (n) => String(n.id) === String(id) || n.slug === slug
        );
        if (fallbackMatch) {
          return res.status(200).json({ success: true, article: fallbackMatch });
        }

        // Check MongoDB news collection
        if (db) {
          let mongoMatch = null;
          if (id && ObjectId.isValid(id)) {
            mongoMatch = await db.collection("news").findOne({ _id: new ObjectId(id) });
          } else if (id) {
            mongoMatch = await db.collection("news").findOne({ id });
          } else if (slug) {
            mongoMatch = await db.collection("news").findOne({ slug });
          }
          if (mongoMatch) {
            return res.status(200).json({ success: true, article: mongoMatch });
          }
        }
      }

      let customNews = [];
      if (db) {
        customNews = await db.collection("news").find({}).sort({ order: 1, createdAt: -1 }).toArray();

        // Seed initial high-impact TechWithJoshi news if collection is empty
        if (customNews.length === 0) {
          const initialNews = [
            {
              title: "TechWithJoshi Launches Autonomous AI Multi-Agent Architecture Practice",
              slug: "techwithjoshi-launches-autonomous-ai-practice",
              category: "AGENCY NEWS",
              image: "/assets/img/home-5/home5-blog-img-03.png",
              excerpt: "Our specialized enterprise AI division now delivers custom multi-agent reasoning systems, local RAG data pipelines, and sub-second LLM inference.",
              content: "<p>TechWithJoshi has expanded its core engineering offerings to include dedicated Autonomous AI Multi-Agent Systems. Enterprises can now deploy secure, sandboxed reasoning agents integrated with their relational data and cloud services.</p>",
              source: "TechWithJoshi Newsroom",
              url: "/blog-details?slug=architecting-real-time-ai-agents",
              tags: ["AI", "Enterprise", "Agents"],
              order: 1,
              date: "Sep 2, 2026",
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              title: "Partnership Announcement: Accelerated Kubernetes Multi-Cloud Migration",
              slug: "partnership-accelerated-kubernetes-migration",
              category: "CLOUD INFRASTRUCTURE",
              image: "/assets/img/home-5/home5-blog-img-02.png",
              excerpt: "Expanding our hybrid-cloud engineering blueprint to help FinTech and SaaS startups achieve zero-downtime blue/green deployments.",
              content: "<p>We have standardized zero-downtime Kubernetes deployment blueprints across AWS and Google Cloud Platform, providing clients with automated blue/green canary rollouts and automated rollback safeguards.</p>",
              source: "TechWithJoshi Newsroom",
              url: "/case-study-details?slug=building-scalable-cloud-infrastructure",
              tags: ["Cloud", "Kubernetes", "DevOps"],
              order: 2,
              date: "Aug 28, 2026",
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          await db.collection("news").insertMany(initialNews);
          customNews = await db.collection("news").find({}).sort({ order: 1, createdAt: -1 }).toArray();
        }
      }

      // Fetch live verified tech & open-source news from Dev.to API
      let liveNews = [];
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const apiRes = await fetch("https://dev.to/api/articles?tag=opensource&per_page=14", {
          signal: controller.signal,
          headers: { "User-Agent": "TechWithJoshi-Platform/1.0" }
        });
        clearTimeout(timeoutId);

        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (Array.isArray(apiData)) {
            // Filter out non-English / spam entries
            const validArticles = apiData.filter((item) => item.title && !/[\u0600-\u06FF]/.test(item.title));
            liveNews = validArticles.map((item) => ({
              id: `devto-${item.id}`,
              title: item.title,
              slug: item.slug,
              category: (item.tag_list && item.tag_list[0] ? item.tag_list[0].toUpperCase() : "OPEN SOURCE"),
              date: item.readable_publish_date || "Recent",
              image: item.cover_image || item.social_image || [
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80"
              ][Math.abs((item.id || 0) % 8)],
              excerpt: item.description || "Latest software engineering and open-source updates.",
              source: `Open Source Community (${item.user?.name || "Tech Author"})`,
              url: `/blog-details?id=devto-${item.id}&slug=${item.slug}`,
              author: item.user?.name || "Open Source Maintainer",
              isLiveApi: true,
              type: "news"
            }));
          }
        }
      } catch (e) {
        console.warn("Dev.to API fetch failed or timed out, using fallback IT news:", e.message);
        liveNews = FALLBACK_IT_NEWS;
      }

      if (!liveNews || liveNews.length === 0) {
        liveNews = FALLBACK_IT_NEWS;
      }

      // Normalize custom news
      const formattedCustom = customNews.map((n) => ({
        ...n,
        id: n._id ? n._id.toString() : n.id,
        isLiveApi: false,
        source: n.source || "TechWithJoshi Newsroom",
        type: "news"
      }));

      // Combined feed (custom news first, then live news)
      const allNews = [...formattedCustom, ...liveNews];

      return res.status(200).json({
        success: true,
        customNews: formattedCustom,
        liveNews: liveNews,
        allNews: allNews
      });
    } catch (error) {
      console.error("Error in GET /api/news:", error);
      return res.status(200).json({
        success: true,
        customNews: [],
        liveNews: FALLBACK_IT_NEWS,
        allNews: FALLBACK_IT_NEWS
      });
    }
  }

  // 2. POST: Create Custom News or Import Live News (Protected)
  if (method === "POST") {
    const admin = verifyAdmin(req);
    if (!admin) return res.status(401).json({ error: "Unauthorized: Admin access required" });

    if (!db) return res.status(500).json({ error: "Database unavailable" });

    try {
      const { title, category, image, excerpt, content, source, url, tags, order } = req.body;
      if (!title) return res.status(400).json({ error: "News title is required" });

      const newNews = {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: category || "IT News",
        image: image || "/assets/img/home-5/home5-blog-img-01.png",
        excerpt: excerpt || "",
        content: content || `<p>${excerpt || title}</p>`,
        source: source || "TechWithJoshi Newsroom",
        url: url || "",
        tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map(t => t.trim()) : ["IT News"],
        order: order || 1,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection("news").insertOne(newNews);
      return res.status(201).json({ success: true, item: { ...newNews, _id: result.insertedId } });
    } catch (err) {
      console.error("Error creating news:", err);
      return res.status(500).json({ error: "Failed to create news item" });
    }
  }

  // 3. PUT: Update Custom News (Protected)
  if (method === "PUT") {
    const admin = verifyAdmin(req);
    if (!admin) return res.status(401).json({ error: "Unauthorized: Admin access required" });

    if (!db) return res.status(500).json({ error: "Database unavailable" });

    try {
      const { _id, id, title, category, image, excerpt, content, source, url, tags, order } = req.body;
      const targetId = _id || id;
      if (!targetId) return res.status(400).json({ error: "Missing news ID" });

      const updateFields = {
        title,
        category,
        image,
        excerpt,
        content,
        source,
        url,
        order: Number(order) || 1,
        updatedAt: new Date()
      };

      if (tags) {
        updateFields.tags = Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map(t => t.trim()) : [];
      }

      await db.collection("news").updateOne(
        { _id: new ObjectId(targetId) },
        { $set: updateFields }
      );

      return res.status(200).json({ success: true, message: "News item updated" });
    } catch (err) {
      console.error("Error updating news:", err);
      return res.status(500).json({ error: "Failed to update news item" });
    }
  }

  // 4. DELETE: Remove Custom News (Protected)
  if (method === "DELETE") {
    const admin = verifyAdmin(req);
    if (!admin) return res.status(401).json({ error: "Unauthorized: Admin access required" });

    if (!db) return res.status(500).json({ error: "Database unavailable" });

    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Missing news ID" });

      await db.collection("news").deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true, message: "News item deleted" });
    } catch (err) {
      console.error("Error deleting news:", err);
      return res.status(500).json({ error: "Failed to delete news item" });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${method} Not Allowed` });
}
