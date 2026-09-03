import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminFromRequest } from "@/lib/auth";

const DEFAULT_SERVICES = [
  {
    title: "Web & SaaS Engineering",
    slug: "web-saas-engineering",
    category: "Web Applications",
    icon: "bi-code-slash",
    description: "Enterprise-scale Next.js, React, and Node.js architectures optimized for sub-second page loads, modular microservices, and modern Core Web Vitals.",
    features: [
      "Server-Side Rendering (SSR) & Edge Delivery",
      "Headless CMS & Scalable API Integrations",
      "High-Concurrency Performance Tuning",
      "Responsive & Accessible Design (WCAG Compliant)"
    ],
    details: "We build responsive, ultra-fast web applications designed for high user engagement and complex business logic. From multi-tenant SaaS dashboards to consumer-facing portals, our code is tested, documented, and ready for production.",
    order: 1
  },
  {
    title: "Cloud Infrastructure & DevOps",
    slug: "cloud-devops-infrastructure",
    category: "Cloud Systems",
    icon: "bi-cloud-check",
    description: "Multi-region cloud infrastructure on AWS and Google Cloud Platform with automated Kubernetes container orchestration and CI/CD pipelines.",
    features: [
      "Infrastructure as Code (Terraform / CloudFormation)",
      "Docker Containerization & Kubernetes Clusters",
      "Zero-Downtime Blue/Green Deployments",
      "24/7 Telemetry, APM & Automated Alerts"
    ],
    details: "Our DevOps engineers eliminate deployment friction. We architect secure, auto-scaling cloud environments that cut cloud hosting costs and guarantee 99.99% system availability.",
    order: 2
  },
  {
    title: "Enterprise AI & LLM Systems",
    slug: "enterprise-ai-llm-systems",
    category: "Artificial Intelligence",
    icon: "bi-cpu",
    description: "Custom autonomous reasoning agents, localized vector embeddings, Retrieval-Augmented Generation (RAG), and fine-tuned domain LLMs.",
    features: [
      "Custom Autonomous Agent Frameworks",
      "Vector Database Architecture (Pinecone, Weaviate)",
      "Enterprise Privacy & Data Sandboxing",
      "Natural Language Data Analytics"
    ],
    details: "Transform proprietary organizational data into actionable intelligence. We integrate state-of-the-art language models directly into your workflow while maintaining strict enterprise security and data privacy.",
    order: 3
  },
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    category: "Mobile Solutions",
    icon: "bi-phone",
    description: "Cross-platform mobile applications in React Native and Flutter with real-time offline sync, native device acceleration, and smooth UX.",
    features: [
      "Cross-Platform iOS & Android Codebases",
      "Offline-First SQLite / IndexedDB Sync",
      "Push Notifications & Biometric Auth",
      "App Store & Google Play Launch Management"
    ],
    details: "Deliver fluid native experiences to millions of mobile users. Our mobile apps combine pixel-perfect visual design with robust offline syncing and low battery consumption.",
    order: 4
  },
  {
    title: "DevSecOps & Cyber Resilience",
    slug: "devsecops-cyber-resilience",
    category: "Cyber Security",
    icon: "bi-shield-check",
    description: "Zero-trust network architectures, encrypted database storage, automated vulnerability scans, and SOC2 / GDPR compliance audits.",
    features: [
      "Zero-Trust Architecture & Identity Management",
      "Static & Dynamic Code Vulnerability Scanning",
      "SOC2, ISO 27001 & GDPR Compliance Roadmaps",
      "Automated Penetration Testing & Threat Remediation"
    ],
    details: "Security is engineered into every stage of development, not tacked on at the end. We safeguard your customer data, intellectual property, and infrastructure from evolving cyber threats.",
    order: 5
  },
  {
    title: "Big Data & Real-Time Analytics",
    slug: "big-data-real-time-analytics",
    category: "Data Platforms",
    icon: "bi-graph-up-arrow",
    description: "Distributed Apache Kafka message pipelines, real-time event streaming, data lakehouses, and intuitive executive KPI dashboards.",
    features: [
      "Distributed Stream Processing with Kafka & Spark",
      "Cloud Data Lakehouses (Snowflake, BigQuery)",
      "Interactive Real-Time Executive Dashboards",
      "Data Cleansing, Transformation & ETL Pipelines"
    ],
    details: "Turn high-volume data streams into decisive operational insights. We engineer scalable data pipelines capable of processing millions of events per minute with sub-second latency.",
    order: 6
  }
];

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const servicesCol = db.collection("services");

    if (req.method === "GET") {
      const { slug } = req.query;
      if (slug) {
        const item = await servicesCol.findOne({ slug });
        if (item) return res.status(200).json(item);
        const fallback = DEFAULT_SERVICES.find((s) => s.slug === slug);
        if (fallback) return res.status(200).json(fallback);
        return res.status(404).json({ error: "Service not found" });
      }

      let services = await servicesCol.find({}).sort({ order: 1 }).toArray();
      if (!services || services.length === 0) {
        // Seed default authentic IT services
        const docsToInsert = DEFAULT_SERVICES.map((s) => ({ ...s, createdAt: new Date(), updatedAt: new Date() }));
        await servicesCol.insertMany(docsToInsert);
        services = await servicesCol.find({}).sort({ order: 1 }).toArray();
      }
      return res.status(200).json(services);
    }

    // Require admin JWT for mutations
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin authorization required" });
    }

    if (req.method === "POST") {
      const { title, description, category, icon, features, details, content, image, order } = req.body;
      if (!title) return res.status(400).json({ error: "Service title is required" });

      const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const newService = {
        title,
        slug,
        category: category || "IT Solutions",
        icon: icon || "bi-code-slash",
        description: description || "",
        features: Array.isArray(features) ? features : (typeof features === "string" ? features.split(",").map(s => s.trim()) : []),
        details: details || description || "",
        content: content || details || description || "",
        image: image || "/assets/img/home-3/home3-banner-img.png",
        order: order ? parseInt(order) : 99,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: admin.username,
      };

      const result = await servicesCol.insertOne(newService);
      return res.status(201).json({ success: true, id: result.insertedId, data: newService });
    }

    if (req.method === "PUT") {
      const { _id, id, ...updateData } = req.body;
      const targetId = _id || id;
      if (!targetId) return res.status(400).json({ error: "Service ID required" });

      if (typeof updateData.features === "string") {
        updateData.features = updateData.features.split(",").map((s) => s.trim());
      }

      await servicesCol.updateOne(
        { _id: new ObjectId(targetId) },
        { $set: { ...updateData, updatedAt: new Date(), updatedBy: admin.username } }
      );
      return res.status(200).json({ success: true, message: "Service updated successfully" });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Service ID required" });
      await servicesCol.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true, message: "Service deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API /api/services error:", error);
    return res.status(500).json({ error: error.message });
  }
}
