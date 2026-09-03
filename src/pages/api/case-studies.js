import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminFromRequest } from "@/lib/auth";

const DEFAULT_CASE_STUDIES = [
  {
    slug: "enterprise-headless-ecommerce-platform",
    title: "Enterprise Headless E-Commerce & Multi-Channel Platform",
    category: "Headless E-Commerce",
    client: "Global OmniChannel Retail Brands",
    image: "/assets/img/home-5/home5-case-01.png?v=5",
    videoUrl: "",
    tags: ["Headless Commerce", "Next.js", "GraphQL APIs", "Multi-Channel Inventory", "Laravel", "ElasticSearch"],
    metrics: [
      { label: "Checkout Conversion", value: "+44%" },
      { label: "Catalog Scale", value: "2M+ SKUs" },
      { label: "Sub-Second Response", value: "< 280ms" }
    ],
    challenge: "Enterprise retailers with multi-million SKU catalogs faced severe database locking, 68%+ cart abandonment rates, and monolithic bottlenecks that hindered agile global expansion into multi-currency and multi-channel markets.",
    solution: "Architected a high-throughput Headless Commerce platform with GraphQL API microservices, asynchronous checkout pipelines, multi-channel inventory synchronization, and Redis-backed elastic indexing.",
    content: "<h2>Executive Overview</h2><p>Modern global commerce demands ultra-responsive digital storefronts, sub-second product catalog search, and elastic scalability during peak flash sales. TechWithJoshi engineered a full-spectrum Headless E-Commerce architecture that decouples customer-facing touchpoints from complex back-office inventory and order management systems.</p><h3>Core Architectural Breakthroughs</h3><ul><li><strong>Decoupled Headless Storefront:</strong> Next.js edge-rendered frontends consuming high-throughput GraphQL and RESTful APIs, delivering 99+ Google Lighthouse performance scores.</li><li><strong>Multi-Channel & Multi-Warehouse Sync:</strong> Real-time inventory routing across regional distribution centers with automated stock reservation and backorder prevention.</li><li><strong>Complex Product Engine:</strong> Native support for configurable, bundle, virtual, downloadable, and dynamic composite attributes without database schema mutations.</li><li><strong>Streamlined Single-Step Checkout:</strong> Reduced checkout steps from 5 to 1, integrating automated address validation, tokenized PCI-DSS payments, and dynamic tax calculation.</li></ul><blockquote>\"By transitioning to TechWithJoshi's headless e-commerce architecture, our peak holiday transaction capacity scaled by 600% without a single second of downtime, while cart conversions surged by 44%.\"</blockquote><h3>Enterprise Impact & Telemetry</h3><p>The deployed commerce platform handles over 2,000,000 active SKUs and processes tens of thousands of concurrent checkout operations with sub-300ms server response times. Built-in localization powers multi-currency transactions, regional taxation compliance, and multi-lingual catalog feeds across 15+ international territories.</p>",
    order: 1
  },
  {
    slug: "building-scalable-cloud-infrastructure",
    title: "Building a Scalable Cloud Infrastructure",
    category: "Cloud & DevOps",
    client: "Fintech Global Payments",
    image: "/assets/img/home-5/home5-case-02.png?v=5",
    videoUrl: "",
    tags: ["AWS", "Kubernetes", "Terraform", "Microservices"],
    metrics: [
      { label: "Uptime Achieved", value: "99.999%" },
      { label: "Latency Reduction", value: "65%" },
      { label: "Deployment Speed", value: "10x Faster" }
    ],
    challenge: "The legacy monolithic financial platform was suffering from catastrophic failovers during market peak volatility, with deployment cycles spanning weeks.",
    solution: "Architected a multi-region active-active AWS Kubernetes cluster with automated zero-downtime Canary CI/CD deployments and distributed Redis caching.",
    content: "<h2>Executive Summary</h2><p>In high-frequency financial platforms, millisecond latency and zero downtime are non-negotiable requirements. TechWithJoshi re-architected the entire payment gateway infrastructure into high-availability Kubernetes microservices.</p><h3>The Architecture Shift</h3><p>We decomposed monolithic components into decoupled containerized microservices managed via Terraform infrastructure-as-code.</p><blockquote>\"TechWithJoshi delivered an enterprise-grade cloud architecture that eliminated all our production outages and cut infrastructure costs by 40%.\"</blockquote><h3>Key Results</h3><ul><li>Zero production outages during global trading hours</li><li>Sub-50ms API response time worldwide</li><li>Fully automated compliance auditing and DevSecOps pipelines</li></ul>",
    order: 2
  },
  {
    slug: "leveraging-data-analytics-for-business-insights",
    title: "Leveraging Data Analytics for Business Insights",
    category: "Data & AI",
    client: "OmniRetail Enterprise",
    image: "/assets/img/home-5/home5-case-02.png?v=5",
    videoUrl: "",
    tags: ["BigQuery", "Machine Learning", "Python", "Dataform"],
    metrics: [
      { label: "Revenue Growth", value: "+38%" },
      { label: "Forecast Accuracy", value: "94.8%" },
      { label: "Query Acceleration", value: "8.5x" }
    ],
    challenge: "Disparate data silos across ERP, CRM, and storefronts caused delayed reporting, inventory bottlenecks, and inaccurate sales forecasts.",
    solution: "Designed an automated Google Cloud BigQuery data lakehouse with real-time predictive demand forecasting models and interactive executive dashboards.",
    content: "<h2>Empowering Data-Driven Growth</h2><p>By unifying disparate retail databases into a centralized Google Cloud BigQuery lakehouse, OmniRetail achieved real-time visibility across 250+ outlets.</p><h3>Machine Learning Forecasting</h3><p>Using custom gradient-boosted models and time-series pipelines, we automated inventory restocking and customer churn prevention.</p><blockquote>\"Our inventory holding costs dropped by $1.8M in the first two quarters alone.\"</blockquote>",
    order: 2
  },
  {
    slug: "optimizing-it-infrastructure-for-cost-efficiency",
    title: "Optimizing IT Infrastructure for Cost Efficiency",
    category: "DevSecOps",
    client: "HealthCare Systems Corp",
    image: "/assets/img/home-5/home5-case-03.png?v=5",
    videoUrl: "",
    tags: ["HIPAA", "Docker", "Cost Optimization", "GCP"],
    metrics: [
      { label: "Annual Savings", value: "$1.4M" },
      { label: "Audit Compliance", value: "100%" },
      { label: "Security Incidents", value: "0" }
    ],
    challenge: "Escalating cloud costs and stringent HIPAA compliance mandates threatened operational margins across 40 healthcare facilities.",
    solution: "Executed a comprehensive cloud cost audit, right-sized instances, eliminated idle workloads, and implemented zero-trust access policies.",
    content: "<h2>Cloud Cost & Security Transformation</h2><p>Healthcare providers demand rigorous data privacy and ultra-reliable uptime. We streamlined their GCP infrastructure to save $1.4M annually while achieving 100% HIPAA compliance audit pass rate.</p>",
    order: 3
  },
  {
    slug: "enhancing-customer-engagement-through-mobile-apps",
    title: "Enhancing Customer Engagement Through Mobile Apps",
    category: "Mobile Apps",
    client: "NextWave Lifestyle",
    image: "/assets/img/home-5/home5-case-04.png?v=5",
    videoUrl: "",
    tags: ["React Native", "Next.js", "Node.js", "WebSockets"],
    metrics: [
      { label: "Active Users", value: "500K+" },
      { label: "App Store Rating", value: "4.9/5" },
      { label: "Retention Rate", value: "72%" }
    ],
    challenge: "Outdated web interface with high user drop-off and lack of omnichannel push notifications.",
    solution: "Engineered a high-performance cross-platform mobile application with real-time WebSocket chat and personalized AI recommendations.",
    content: "<h2>Omnichannel Engagement Platform</h2><p>We built a lightning-fast React Native application paired with Next.js micro-frontends, increasing daily active sessions by 300%.</p>",
    order: 4
  }
];

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const caseCol = db.collection("case_studies");

    if (req.method === "GET") {
      const { slug, id } = req.query;
      if (slug) {
        const item = await caseCol.findOne({ slug });
        if (item) return res.status(200).json(item);
        const fallback = DEFAULT_CASE_STUDIES.find((c) => c.slug === slug);
        if (fallback) return res.status(200).json(fallback);
        return res.status(404).json({ error: "Case study not found" });
      }
      if (id) {
        let item;
        try {
          item = await caseCol.findOne({ _id: new ObjectId(id) });
        } catch {
          item = await caseCol.findOne({ id });
        }
        if (item) return res.status(200).json(item);
      }

      let items = await caseCol.find({}).sort({ order: 1, createdAt: -1 }).toArray();
      if (!items || items.length === 0) {
        await caseCol.insertMany(DEFAULT_CASE_STUDIES.map(c => ({ ...c, createdAt: new Date() })));
        items = await caseCol.find({}).sort({ order: 1 }).toArray();
      }
      return res.status(200).json(items);
    }

    const admin = getAdminFromRequest(req);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin privileges required" });
    }

    if (req.method === "POST") {
      const { title, slug, category, client, image, videoUrl, tags, metrics, challenge, solution, content, order } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const newItem = {
        title,
        slug: finalSlug,
        category: category || "IT Solutions",
        client: client || "Enterprise Partner",
        image: image || "/assets/img/home-5/home5-case-01.png",
        videoUrl: videoUrl || "",
        tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map(t => t.trim()) : [],
        metrics: Array.isArray(metrics) ? metrics : [],
        challenge: challenge || "",
        solution: solution || "",
        content: content || "",
        order: Number(order) || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await caseCol.insertOne(newItem);
      return res.status(201).json({ success: true, id: result.insertedId, item: newItem });
    }

    if (req.method === "PUT") {
      const { _id, ...updateData } = req.body;
      if (!_id) {
        return res.status(400).json({ error: "Item _id is required for update" });
      }

      if (typeof updateData.tags === "string") {
        updateData.tags = updateData.tags.split(",").map(t => t.trim()).filter(Boolean);
      }

      await caseCol.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Missing id query param" });

      await caseCol.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API /api/case-studies error:", error);
    return res.status(500).json({ error: error.message });
  }
}
