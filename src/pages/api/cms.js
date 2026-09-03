import { getDatabase } from "@/lib/mongodb";
import { getAdminFromRequest } from "@/lib/auth";

// Default content seed matching our high-quality authentic IT copy and imagery
const DEFAULT_CMS = {
  hero: {
    section: "hero",
    slides: [
      {
        id: "slide-1",
        heading: "We Engineer Mission-Critical AI & High-Scalability Systems.",
        description: "From custom neural agents to multi-tenant cloud ecosystems, TechWithJoshi delivers resilient digital engineering designed to scale with your enterprise.",
        primaryBtnText: "Free Consultancy",
        primaryBtnLink: "/contact",
        secondaryBtnText: "Explore More",
        secondaryBtnLink: "/about",
        image: "assets/img/home-3/home3-banner-img.png",
        videoUrl: "https://www.youtube.com/watch?v=0O2aH4XLbto",
        badge: "Next-Gen Software Engineering"
      },
      {
        id: "slide-2",
        heading: "Transform Your Business With Cloud & Modern Web Apps.",
        description: "Accelerate your digital footprint with custom microservices, seamless API integrations, and intuitive, blazing-fast user interfaces.",
        primaryBtnText: "Free Consultancy",
        primaryBtnLink: "/contact",
        secondaryBtnText: "Explore More",
        secondaryBtnLink: "/about",
        image: "assets/img/home-3/home3-banner-img3.png",
        videoUrl: "https://www.youtube.com/watch?v=0O2aH4XLbto",
        badge: "Cloud & DevOps Architecture"
      },
      {
        id: "slide-3",
        heading: "Empowering Innovation With Machine Learning & DevOps.",
        description: "From automated CI/CD deployment pipelines to generative AI agents, we engineer reliable IT solutions tailored to your mission-critical goals.",
        primaryBtnText: "Free Consultancy",
        primaryBtnLink: "/contact",
        secondaryBtnText: "Explore More",
        secondaryBtnLink: "/about",
        image: "assets/img/home-3/home3-banner-img2.png",
        videoUrl: "https://www.youtube.com/watch?v=0O2aH4XLbto",
        badge: "Autonomous AI Workflows"
      }
    ]
  },
  about: {
    section: "about",
    badge: "Our Approach",
    title: "Architecting High-Impact Digital Ecosystems.",
    subtitle: "We engineer end-to-end digital solutions that bridge technical complexity with high-growth business impact, designed to scale with your architecture.",
    description: "Our engineering teams craft tailored cloud solutions, enterprise-grade AI models, and modern web platforms. We align state-of-the-art tech stacks with your strategic roadmap to ensure resilience, security, and exponential scalability.",
    yearsCount: "5yr",
    yearsLabel: "Excellence",
    feature1Title: "Full-Stack Precision",
    feature1Desc: "Production-ready architectures built for agility, security, and speed.",
    feature2Title: "Enterprise Reliability",
    feature2Desc: "99.99% uptime systems backed by proactive monitoring and DevSecOps.",
    image1: "assets/img/home-3/home3-about-1.png",
    image2: "assets/img/home-3/home3-about-2.png",
    stats: [
      { number: "5+", label: "Years of Excellence", icon: "bi-trophy" },
      { number: "150+", label: "Enterprise Projects", icon: "bi-check2-circle" },
      { number: "99.9%", label: "Uptime SLA", icon: "bi-shield-check" },
      { number: "24/7", label: "Dedicated Support", icon: "bi-headset" }
    ]
  },
  solutions: {
    section: "solutions",
    title: "Our Solutions",
    subtitle: "Explore our specialized engineering disciplines, from modern full-stack web platforms and cloud automation to intelligent AI models and data analytics.",
    items: [
      {
        id: "sol-1",
        title: "Modern Web Applications",
        description: "High-performance React, Next.js, and Node.js ecosystems optimized for sub-second page loads and modern Core Web Vitals.",
        category: "Web Engineering",
        icon: "bi-code-slash",
        link: "/service"
      },
      {
        id: "sol-2",
        title: "Cloud & DevOps Infrastructure",
        description: "Automated multi-region CI/CD deployment pipelines, AWS/GCP orchestration, Docker containers, and Kubernetes governance.",
        category: "Cloud Systems",
        icon: "bi-cloud-check",
        link: "/service"
      },
      {
        id: "sol-3",
        title: "Enterprise AI & LLM Systems",
        description: "Autonomous reasoning agents, localized vector embeddings, RAG architectures, and custom fine-tuned model deployment.",
        category: "Artificial Intelligence",
        icon: "bi-cpu",
        link: "/service"
      },
      {
        id: "sol-4",
        title: "Mobile App Development",
        description: "Cross-platform mobile applications in React Native and Flutter with real-time offline sync and native performance.",
        category: "Mobile Solutions",
        icon: "bi-phone",
        link: "/service"
      },
      {
        id: "sol-5",
        title: "DevSecOps & Cyber Resilience",
        description: "Zero-trust network frameworks, encrypted database persistence, compliance audits, and automated vulnerability scanning.",
        category: "Cyber Security",
        icon: "bi-shield-check",
        link: "/service"
      },
      {
        id: "sol-6",
        title: "Big Data & Real-Time Analytics",
        description: "Event-driven stream processing, distributed Kafka pipelines, and intuitive real-time KPI analytical dashboards.",
        category: "Data Platforms",
        icon: "bi-graph-up-arrow",
        link: "/service"
      }
    ]
  },
  case_studies: {
    section: "case_studies",
    title: "Featured Case Studies",
    subtitle: "Discover how our digital engineering, AI agents, and cloud infrastructure have transformed operations for modern enterprises.",
    items: [
      {
        id: "cs-1",
        title: "Streamlining Enterprise IT Infrastructure",
        category: "Cloud Architecture",
        image: "assets/img/home-3/home3-suc-sto-01.png",
        link: "/project-details",
        client: "FinTech Enterprise Global"
      },
      {
        id: "cs-2",
        title: "Transforming SaaS Customer Experience",
        category: "Next.js Web App",
        image: "assets/img/home-3/home3-suc-sto-02.png",
        link: "/project-details",
        client: "HealthTech Scaleup"
      },
      {
        id: "cs-3",
        title: "Autonomous Workflow Engine & LLMs",
        category: "AI & Automation",
        image: "assets/img/home-3/home3-suc-sto-03.png",
        link: "/project-details",
        client: "Logistics Automation Corp"
      },
      {
        id: "cs-4",
        title: "Zero-Trust Cloud & Microservices Migration",
        category: "DevSecOps",
        image: "assets/img/home-3/home3-suc-sto-04.png",
        link: "/project-details",
        client: "Global SaaS Platform"
      },
      {
        id: "cs-5",
        title: "Predictive Analytics Data Mesh",
        category: "Data Engineering",
        image: "assets/img/home-3/home3-suc-sto-05.png",
        link: "/project-details",
        client: "E-Commerce Group"
      }
    ]
  },
  testimonials: {
    section: "testimonials",
    title: "Client Testimonials",
    subtitle: "What industry leaders say about collaborating with the TechWithJoshi engineering team.",
    items: [
      {
        id: "testi-1",
        name: "David Sterling",
        designation: "VP of Engineering",
        company: "AuraTech Global",
        review: "TechWithJoshi re-architected our legacy stack into high-concurrency microservices with zero downtime. Their technical speed and AI expertise are unmatched.",
        rating: 5,
        avatar: "assets/img/home-3/h3-testi-01.png"
      },
      {
        id: "testi-2",
        name: "Elena Rostova",
        designation: "Chief Product Officer",
        company: "Nexus AI Labs",
        review: "From conceptual wireframing to production deployment, Dhanesh and his engineering team delivered our Next.js platform two weeks ahead of schedule.",
        rating: 5,
        avatar: "assets/img/home-3/h3-testi-02.png"
      },
      {
        id: "testi-3",
        name: "Rajesh Nair",
        designation: "Founder & CEO",
        company: "CloudVenture Inc.",
        review: "The level of engineering rigor TechWithJoshi brings to cloud infrastructure and automated CI/CD pipelines saved us over 40% in AWS infrastructure costs.",
        rating: 5,
        avatar: "assets/img/home-3/h3-testi-03.png"
      }
    ]
  },
  pricing: {
    section: "pricing",
    title: "Flexible Engineering Engagements",
    subtitle: "Transparent pricing models tailored for high-growth startups and mature enterprise technology platforms.",
    items: [
      {
        id: "tier-1",
        title: "MVP Sprint",
        price: "1,499",
        period: "per sprint",
        description: "Ideal for early-stage startups needing a rapid, production-grade MVP prototype in 2-4 weeks.",
        features: [
          "Complete UI/UX Prototype",
          "Next.js Modern Frontend",
          "MongoDB / PostgreSQL Backend",
          "REST & GraphQL APIs",
          "Standard Cloud Deployment",
          "14 Days Post-Launch Support"
        ],
        isPopular: false,
        link: "/contact"
      },
      {
        id: "tier-2",
        title: "Dedicated Squad",
        price: "3,899",
        period: "per month",
        description: "A fully dedicated full-stack engineering team with senior architecture and DevSecOps leadership.",
        features: [
          "Senior Full-Stack Engineers",
          "AI / LLM Model Integration",
          "Custom Cloud CI/CD Pipelines",
          "High-Concurrency Performance",
          "Real-Time Monitoring & Telemetry",
          "24/7 Priority Engineering SLA"
        ],
        isPopular: true,
        link: "/contact"
      },
      {
        id: "tier-3",
        title: "Enterprise Studio",
        price: "7,500",
        period: "custom scope",
        description: "End-to-end digital transformation, security compliance, distributed microservices, and custom AI.",
        features: [
          "Principal Solutions Architect",
          "Zero-Trust Cloud Governance",
          "Custom Distributed Microservices",
          "Dedicated AI Research & R&D",
          "Enterprise SOC2 & GDPR Compliance",
          "Dedicated 24/7 Engineering Support"
        ],
        isPopular: false,
        link: "/contact"
      }
    ]
  },
  page_settings: {
    section: "page_settings",
    heroEnabled: true,
    solutionsEnabled: true,
    aboutEnabled: true,
    caseStudiesEnabled: true,
    testimonialsEnabled: true,
    pricingEnabled: true,
    contactBannerEnabled: true,
    teamEnabled: true,
    blogEnabled: true,
    siteTitle: "TechWithJoshi - Enterprise Software Agency, AI & Cloud Solutions",
    metaDescription: "TechWithJoshi Private Limited is an elite software engineering company and AI solutions partner building scalable web apps, cloud infrastructure, and enterprise systems."
  }
};

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const cmsCollection = db.collection("cms_content");

    if (req.method === "GET") {
      const section = req.query.section;

      if (section) {
        let content = await cmsCollection.findOne({ section });
        if (!content && DEFAULT_CMS[section]) {
          await cmsCollection.insertOne({ ...DEFAULT_CMS[section], updatedAt: new Date() });
          content = DEFAULT_CMS[section];
        }
        return res.status(200).json(content || {});
      }

      // Fetch all CMS sections
      const allDocs = await cmsCollection.find({}).toArray();
      const contentMap = {};

      // Seed any missing defaults
      for (const key of Object.keys(DEFAULT_CMS)) {
        const found = allDocs.find((d) => d.section === key);
        if (found) {
          contentMap[key] = found;
        } else {
          await cmsCollection.insertOne({ ...DEFAULT_CMS[key], updatedAt: new Date() });
          contentMap[key] = DEFAULT_CMS[key];
        }
      }

      return res.status(200).json(contentMap);
    }

    if (req.method === "PUT" || req.method === "POST") {
      // Require JWT admin authorization
      const admin = getAdminFromRequest(req);
      if (!admin) {
        return res.status(401).json({ error: "Unauthorized: Admin session required to update CMS content" });
      }

      const { section, data } = req.body || {};

      if (!section || !data) {
        return res.status(400).json({ error: "Section and data are required for CMS update" });
      }

      const updatePayload = {
        ...data,
        section,
        updatedAt: new Date(),
        updatedBy: admin.username,
      };

      delete updatePayload._id; // prevent immutable _id modification

      await cmsCollection.updateOne(
        { section },
        { $set: updatePayload },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: `CMS Section '${section}' updated successfully`,
        data: updatePayload,
      });
    }

    res.setHeader("Allow", ["GET", "PUT", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("CMS API error:", error);
    return res.status(500).json({ error: "Internal Server Error in CMS handler" });
  }
}
