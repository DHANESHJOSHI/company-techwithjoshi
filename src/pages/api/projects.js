import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminFromRequest } from "@/lib/auth";

const DEFAULT_PROJECTS = [
  {
    title: "Next-Gen Enterprise Headless E-Commerce Platform",
    slug: "enterprise-headless-ecommerce",
    category: "E-Commerce & Headless Store",
    client: "Global Retail & Commerce Brand",
    image: "/assets/img/home-3/ecommerce-platform.webp",
    link: "/project-details?slug=enterprise-headless-ecommerce",
    description: "High-performance enterprise digital commerce engine with multi-warehouse inventory, headless catalog architecture, localized checkout, and AI-powered product discovery.",
    deliverables: [
      "Headless Laravel & Vue Architecture",
      "Multi-Currency & Multi-Channel Sync",
      "Sub-Second Fast Checkout & Dynamic Filters",
      "Zero-Trust Secure Payment Gateway",
      "Interactive Embedded Live Demo Experience"
    ],
    hasLiveDemo: true,
    previewUrl: "/api/project-preview",
    order: 1
  },
  {
    title: "Enterprise E-Commerce Mobile App (iOS & Android)",
    slug: "ecommerce-mobile-app",
    category: "Mobile App & E-Commerce Engineering",
    client: "Global Omni-Channel Retail & Mobile Brands",
    image: "/assets/img/mobile-app/mobile-home-search.png",
    link: "/project-details?slug=ecommerce-mobile-app",
    description: "Enterprise-grade native iOS and Android e-commerce application powered by Flutter, React Native, and high-throughput Headless E-Commerce REST & GraphQL APIs. Features real-time multi-channel sync, native OLED dark mode, FCM push alerts, offline SQLite cache, biometric auth, and interactive 3D motion showcase.",
    deliverables: [
      "Native Flutter & React Native Cross-Platform Core",
      "Real-Time E-Commerce REST & GraphQL Engine Integration",
      "Native OLED Dark Mode & Adaptive Theme Engine",
      "Sub-Second Firebase Cloud Messaging Push Alerts",
      "Offline SQLite / Hive Cache with Background Sync",
      "Interactive 3D Motion Showcase & Screen Tour"
    ],
    hasLiveDemo: false,
    isMobileApp: true,
    order: 2
  },
  {
    title: "TourEx - Enterprise Travel & Tour Booking Engine",
    slug: "tourex-travel-booking-platform",
    category: "Travel & Booking Platform",
    client: "Global Tourism & Hospitality",
    image: "assets/img/home-3/home3-suc-sto-01.png",
    link: "/project-details?slug=tourex-travel-booking-platform",
    description: "Full-scale enterprise travel reservation engine with dynamic itinerary planning, multi-currency checkout, and real-time inventory synchronization.",
    deliverables: [
      "Dynamic Itinerary & Tour Planning",
      "Multi-Currency Checkout & Payments",
      "Real-Time Booking & Reservation Engine",
      "Interactive Embedded Live Demo Experience"
    ],
    hasLiveDemo: true,
    previewUrl: "/api/proxy-embed?slug=tourex-travel-booking-platform",
    order: 3
  },
  {
    title: "Lusion - Immersive 3D Creative Tech & WebGL Studio",
    slug: "lusion-creative-tech-webgl",
    category: "3D & Creative Engineering",
    client: "Creative Studio & Next-Gen Web",
    image: "assets/img/home-3/home3-suc-sto-02.png",
    link: "/project-details?slug=lusion-creative-tech-webgl",
    description: "Next-generation creative technology experience with real-time WebGL shaders, fluid interactive 3D physics, and high-framerate GPU-accelerated motion.",
    deliverables: [
      "Custom WebGL Shaders & GPU Physics",
      "Real-time 3D Interactive Canvas",
      "Sub-60fps GPU Hardware Acceleration",
      "Interactive Embedded Live Demo Experience"
    ],
    hasLiveDemo: true,
    previewUrl: "/api/proxy-embed?slug=lusion-creative-tech-webgl",
    order: 4
  },
  {
    title: "Oryzo AI - Autonomous AI Workforce & Intelligence Suite",
    slug: "oryzo-ai-autonomous-platform",
    category: "AI SaaS & Intelligence",
    client: "Enterprise AI Automation",
    image: "assets/img/home-3/home3-suc-sto-03.png",
    link: "/project-details?slug=oryzo-ai-autonomous-platform",
    description: "Enterprise AI workforce automation platform executing complex operational workflows with multi-agent reasoning, deep LLM integration, and real-time business telemetry.",
    deliverables: [
      "Multi-Agent Workflow Orchestration",
      "Vector RAG Knowledge Intelligence",
      "Real-Time WebSocket Analytics Telemetry",
      "Interactive Embedded Live Demo Experience"
    ],
    hasLiveDemo: true,
    previewUrl: "/api/proxy-embed?slug=oryzo-ai-autonomous-platform",
    order: 5
  },
  {
    title: "Zero-Trust Cloud & Microservices Migration",
    slug: "zero-trust-cloud-microservices-migration",
    category: "DevSecOps",
    client: "Global SaaS Platform",
    image: "assets/img/home-3/home3-suc-sto-04.png",
    link: "/project-details?slug=zero-trust-cloud-microservices-migration",
    description: "Implemented a zero-trust network topology across hybrid clouds with mTLS authentication, secret rotation, and SOC2 type II audit alignment.",
    deliverables: ["mTLS Mutual Authentication", "HashiCorp Vault Secret Management", "Automated Penetration Testing", "SOC2 Compliance Certification"],
    order: 6
  },
  {
    title: "Predictive Analytics Data Mesh",
    slug: "predictive-analytics-data-mesh",
    category: "Data Engineering",
    client: "E-Commerce Group",
    image: "assets/img/home-3/home3-suc-sto-05.png",
    link: "/project-details?slug=predictive-analytics-data-mesh",
    description: "Developed real-time Kafka event streaming architecture processing 20,000 requests/sec with automated predictive inventory forecasting.",
    deliverables: ["Apache Kafka Distributed Clusters", "ClickHouse Real-time Analytics", "Custom Forecasting ML Models", "Executive KPI Dashboard"],
    order: 7
  }
];

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const projectsCol = db.collection("projects");

    if (req.method === "GET") {
      let projects = await projectsCol.find({}).sort({ order: 1 }).toArray();
      if (!projects || projects.length === 0) {
        const docsToInsert = DEFAULT_PROJECTS.map((p) => ({ ...p, createdAt: new Date(), updatedAt: new Date() }));
        await projectsCol.insertMany(docsToInsert);
        projects = await projectsCol.find({}).sort({ order: 1 }).toArray();
      }
      res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
      return res.status(200).json(projects);
    }

    const admin = getAdminFromRequest(req);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin authorization required" });
    }

    if (req.method === "POST") {
      const { title, category, client, image, link, description, deliverables, order } = req.body;
      if (!title) return res.status(400).json({ error: "Project title required" });

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const newProject = {
        title,
        slug,
        category: category || "Case Study",
        client: client || "Enterprise Partner",
        image: image || "assets/img/home-3/home3-suc-sto-01.png",
        link: link || "/project-details",
        description: description || "",
        deliverables: Array.isArray(deliverables) ? deliverables : (typeof deliverables === "string" ? deliverables.split(",").map(s => s.trim()) : []),
        order: order ? parseInt(order) : 99,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: admin.username,
      };

      const result = await projectsCol.insertOne(newProject);
      return res.status(201).json({ success: true, id: result.insertedId, data: newProject });
    }

    if (req.method === "PUT") {
      const { _id, id, ...updateData } = req.body;
      const targetId = _id || id;
      if (!targetId) return res.status(400).json({ error: "Project ID required" });

      if (typeof updateData.deliverables === "string") {
        updateData.deliverables = updateData.deliverables.split(",").map((s) => s.trim());
      }

      await projectsCol.updateOne(
        { _id: new ObjectId(targetId) },
        { $set: { ...updateData, updatedAt: new Date(), updatedBy: admin.username } }
      );
      return res.status(200).json({ success: true, message: "Project updated" });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Project ID required" });
      await projectsCol.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true, message: "Project deleted" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API /api/projects error:", error);
    return res.status(500).json({ error: error.message });
  }
}
