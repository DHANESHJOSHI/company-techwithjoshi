import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminFromRequest } from "@/lib/auth";

const DEFAULT_FAQS = [
  {
    question: "What core technologies and tech stacks do you specialize in?",
    answer: "We specialize in modern, high-performance web and cloud ecosystems. Our primary stacks include React, Next.js, Node.js, Python, TypeScript, Docker, Kubernetes, AWS, GCP, and MongoDB/PostgreSQL. We also engineer custom artificial intelligence workflows using modern LLMs, vector embeddings, and autonomous agent frameworks.",
    category: "Technology",
    order: 1
  },
  {
    question: "How do you ensure system scalability and high uptime?",
    answer: "All our architectures follow cloud-native best practices: multi-region deployments, automated load balancing, stateless container services, caching layers (Redis/Cloudflare Edge), and rigorous CI/CD test automation. We establish 99.99% SLA guarantees with 24/7 telemetry and APM monitoring.",
    category: "Architecture",
    order: 2
  },
  {
    question: "Can TechWithJoshi build and deploy custom AI agents for our business?",
    answer: "Yes, absolutely. We architect custom AI agents capable of reasoning, utilizing tools, interacting with internal databases via Retrieval-Augmented Generation (RAG), and executing complex multi-step workflows while keeping your company data completely private and sandboxed.",
    category: "AI & ML",
    order: 3
  },
  {
    question: "What is your typical project delivery timeline and process?",
    answer: "For MVP prototypes and initial product launches, we operate in rapid 2-4 week sprints. For enterprise scale systems, we provide dedicated agile squads with weekly sprint demos, continuous delivery, direct Slack/Teams engineering channels, and transparent code reviews.",
    category: "Process",
    order: 4
  },
  {
    question: "How do we get started or schedule an architecture consultation?",
    answer: "You can schedule a direct 30-minute discovery consultation using our Cal.com booking link (https://cal.com/dhanesh-joshi/30min), chat with us on WhatsApp (+91 7623897036), or submit your project details via our contact page. We typically respond within 2-4 business hours.",
    category: "Consulting",
    order: 5
  }
];

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const faqsCol = db.collection("faqs");

    if (req.method === "GET") {
      let faqs = await faqsCol.find({}).sort({ order: 1 }).toArray();
      if (!faqs || faqs.length === 0) {
        const docsToInsert = DEFAULT_FAQS.map((f) => ({ ...f, createdAt: new Date(), updatedAt: new Date() }));
        await faqsCol.insertMany(docsToInsert);
        faqs = await faqsCol.find({}).sort({ order: 1 }).toArray();
      }
      return res.status(200).json(faqs);
    }

    const admin = getAdminFromRequest(req);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin authorization required" });
    }

    if (req.method === "POST") {
      const { question, answer, category, order } = req.body;
      if (!question || !answer) return res.status(400).json({ error: "Question and answer required" });

      const newFaq = {
        question,
        answer,
        category: category || "General",
        order: order ? parseInt(order) : 99,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: admin.username,
      };

      const result = await faqsCol.insertOne(newFaq);
      return res.status(201).json({ success: true, id: result.insertedId, data: newFaq });
    }

    if (req.method === "PUT") {
      const { _id, id, ...updateData } = req.body;
      const targetId = _id || id;
      if (!targetId) return res.status(400).json({ error: "FAQ ID required" });

      await faqsCol.updateOne(
        { _id: new ObjectId(targetId) },
        { $set: { ...updateData, updatedAt: new Date(), updatedBy: admin.username } }
      );
      return res.status(200).json({ success: true, message: "FAQ updated" });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "FAQ ID required" });
      await faqsCol.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true, message: "FAQ deleted" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API /api/faqs error:", error);
    return res.status(500).json({ error: error.message });
  }
}
