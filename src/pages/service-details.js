import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";

const FALLBACK_SERVICES = [
  {
    slug: "cloud-devops-infrastructure",
    title: "Cloud Infrastructure & DevOps",
    category: "Cloud Systems",
    icon: "bi-cloud-check",
    image: "/assets/img/home-3/home3-banner-img3.png",
    description: "Multi-region cloud infrastructure on AWS and Google Cloud Platform with automated Kubernetes container orchestration and CI/CD pipelines.",
    features: [
      "Infrastructure as Code (Terraform / CloudFormation)",
      "Docker Containerization & Kubernetes Clusters",
      "Zero-Downtime Blue/Green Deployments",
      "24/7 Telemetry, APM & Automated Alerts"
    ],
    details: "Our DevOps engineers eliminate deployment friction. We architect secure, auto-scaling cloud environments that cut cloud hosting costs and guarantee 99.99% system availability.",
    content: "<h3>Enterprise Cloud Engineering</h3><p>At TechWithJoshi, we build production-grade cloud environments engineered for high resilience, zero-trust security, and exponential scalability. Whether you are migrating monolithic applications or optimizing existing AWS/GCP workloads, our DevSecOps blueprints automate your continuous delivery.</p><h4>Our Engineering Standards</h4><ul><li><strong>Automated Provisioning:</strong> 100% Infrastructure as Code with Terraform and GitOps workflows.</li><li><strong>Container Orchestration:</strong> Resilient Kubernetes deployments with horizontal pod autoscaling.</li><li><strong>Observability & Telemetry:</strong> End-to-end distributed tracing, Prometheus metrics, and automated alert routing.</li></ul>"
  },
  {
    slug: "enterprise-ai-llm-systems",
    title: "Enterprise AI & LLM Systems",
    category: "Artificial Intelligence",
    icon: "bi-cpu",
    image: "/assets/img/home-3/home3-banner-img2.png",
    description: "Custom autonomous reasoning agents, localized vector embeddings, Retrieval-Augmented Generation (RAG), and fine-tuned domain LLMs.",
    features: [
      "Custom Autonomous Agent Frameworks",
      "Vector Database Architecture (Pinecone, Weaviate)",
      "Enterprise Privacy & Data Sandboxing",
      "Natural Language Data Analytics"
    ],
    details: "Transform proprietary organizational data into actionable intelligence. We integrate state-of-the-art language models directly into your workflow while maintaining strict enterprise security and data privacy.",
    content: "<h3>Accelerate Growth With Autonomous AI</h3><p>We engineer end-to-end AI applications that bridge custom language models with your mission-critical databases and microservices. From agentic decision workflows to enterprise RAG pipelines, our systems protect organizational privacy while unlocking 10x team productivity.</p>"
  },
  {
    slug: "web-saas-engineering",
    title: "Web & SaaS Engineering",
    category: "Web Applications",
    icon: "bi-code-slash",
    image: "/assets/img/home-3/home3-banner-img.png",
    description: "Enterprise-scale Next.js, React, and Node.js architectures optimized for sub-second page loads, modular microservices, and modern Core Web Vitals.",
    features: [
      "Server-Side Rendering (SSR) & Edge Delivery",
      "Headless CMS & Scalable API Integrations",
      "High-Concurrency Performance Tuning",
      "Responsive & Accessible Design (WCAG Compliant)"
    ],
    details: "We build responsive, ultra-fast web applications designed for high user engagement and complex business logic. From multi-tenant SaaS dashboards to consumer-facing portals, our code is tested, documented, and ready for production.",
    content: "<h3>Full-Stack Digital Experiences</h3><p>Modern enterprises demand lightning-fast web applications that deliver frictionless user experiences. TechWithJoshi leverages Next.js SSR, GraphQL, and modern reactive frontends to build secure, SEO-optimized web products that convert visitors into lifetime customers.</p>"
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    category: "Mobile Solutions",
    icon: "bi-phone",
    image: "/assets/img/home-5/home5-case-04.png?v=5",
    description: "Cross-platform mobile applications in React Native and Flutter with real-time offline sync, native device acceleration, and smooth UX.",
    features: [
      "Cross-Platform iOS & Android Codebases",
      "Offline-First SQLite / IndexedDB Sync",
      "Push Notifications & Biometric Auth",
      "App Store & Google Play Launch Management"
    ],
    details: "Deliver fluid native experiences to millions of mobile users. Our mobile apps combine pixel-perfect visual design with robust offline syncing and low battery consumption.",
    content: "<h3>Cross-Platform Mobile Engineering</h3><p>We build beautiful, native-grade mobile applications for iOS and Android using React Native and Flutter. From biometric security to offline-first synchronization, your users receive snappy, reliable mobile experiences.</p>"
  },
  {
    slug: "devsecops-cyber-resilience",
    title: "DevSecOps & Cyber Resilience",
    category: "Cyber Security",
    icon: "bi-shield-check",
    image: "/assets/img/home-5/home5-case-03.png?v=5",
    description: "Zero-trust network architectures, encrypted database storage, automated vulnerability scans, and SOC2 / GDPR compliance audits.",
    features: [
      "Zero-Trust Architecture & Identity Management",
      "Static & Dynamic Code Vulnerability Scanning",
      "SOC2, ISO 27001 & GDPR Compliance Roadmaps",
      "Automated Penetration Testing & Threat Remediation"
    ],
    details: "Security is engineered into every stage of development, not tacked on at the end. We safeguard your customer data, intellectual property, and infrastructure from evolving cyber threats.",
    content: "<h3>Proactive Security & Compliance</h3><p>We harden cloud environments, enforce role-based access control, and automate CI/CD vulnerability scanning so your systems stay resilient against modern attack vectors.</p>"
  }
];

export default function ServiceDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllServices(data);
          const currentSlug = slug || "cloud-devops-infrastructure";
          const found = data.find((s) => s.slug === currentSlug) || data[0];
          setService(found);
        } else {
          setAllServices(FALLBACK_SERVICES);
          const currentSlug = slug || "cloud-devops-infrastructure";
          const found = FALLBACK_SERVICES.find((s) => s.slug === currentSlug) || FALLBACK_SERVICES[0];
          setService(found);
        }
      })
      .catch(() => {
        setAllServices(FALLBACK_SERVICES);
        const currentSlug = slug || "cloud-devops-infrastructure";
        const found = FALLBACK_SERVICES.find((s) => s.slug === currentSlug) || FALLBACK_SERVICES[0];
        setService(found);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const activeService = service || FALLBACK_SERVICES[0];

  return (
    <Layout>
      <Breadcrumb
        pageList="Services Details"
        title={activeService.title}
        pageName="SERVICE DETAILS"
      />

      <div className="service-details sec-mar" style={{ background: "#080411", color: "#FFFFFF" }}>
        <div className="container">
          <div className="row gy-5">
            {/* Left Column: Service Details & Rich Content */}
            <div className="col-lg-8">
              {activeService.image && (
                <div className="service-hero-img mb-40 rounded-4 overflow-hidden" style={{ border: "1px solid rgba(121,40,202,0.3)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
                  <img
                    src={activeService.image}
                    alt={activeService.title}
                    className="img-fluid w-100"
                    style={{ maxHeight: "420px", objectFit: "cover" }}
                  />
                </div>
              )}

              <div className="service-header mb-30">
                <span className="badge px-3 py-2 rounded-pill text-info border border-info border-opacity-50 mb-3" style={{ background: "rgba(0,223,216,0.1)", fontSize: "13px", letterSpacing: "1px" }}>
                  {activeService.category || "ENTERPRISE SERVICE"}
                </span>
                <h1 className="fw-bold mb-3 text-white" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
                  {activeService.title}
                </h1>
                <p className="lead" style={{ color: "#F1F5F9", fontSize: "17.5px", lineHeight: "1.8", fontWeight: "400" }}>
                  {activeService.description}
                </p>
              </div>

              {/* Core Features Grid */}
              {Array.isArray(activeService.features) && activeService.features.length > 0 && (
                <div className="features-card p-4 rounded-4 mb-40" style={{ background: "radial-gradient(circle at 15% 15%, rgba(121, 40, 202, 0.18) 0%, #0E091B 85%)", border: "1px solid rgba(121,40,202,0.35)" }}>
                  <h4 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-check2-all text-info" /> Key Architecture Deliverables
                  </h4>
                  <div className="row g-3">
                    {activeService.features.map((feat, idx) => (
                      <div key={idx} className="col-md-6">
                        <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <i className="bi bi-patch-check-fill text-info" />
                          <span style={{ color: "#F8FAFC", fontSize: "15px", fontWeight: "500" }}>{feat}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rich Text Body */}
              <div
                className="service-rich-body mb-50 p-4 rounded-4"
                style={{
                  background: "radial-gradient(circle at 10% 10%, rgba(121, 40, 202, 0.1) 0%, rgba(14, 9, 27, 0.8) 90%)",
                  border: "1px solid rgba(121, 40, 202, 0.3)",
                  color: "#E2E8F0",
                  fontSize: "16px",
                  lineHeight: "1.85",
                }}
                dangerouslySetInnerHTML={{ __html: activeService.content || activeService.details || `<p>${activeService.description}</p>` }}
              />

              {/* Call to action card */}
              <div className="p-4 rounded-4 d-flex flex-wrap align-items-center justify-content-between gap-3" style={{ background: "linear-gradient(135deg, rgba(121, 40, 202, 0.25) 0%, rgba(0, 223, 216, 0.15) 100%)", border: "1px solid rgba(0, 223, 216, 0.3)" }}>
                <div>
                  <h4 className="text-white fw-bold mb-1">Ready to Architect Your Solution?</h4>
                  <p className="mb-0 text-white-50">Speak directly with Dhanesh Joshi and our senior engineering team.</p>
                </div>
                <Link legacyBehavior href="/contact">
                  <a className="btn btn-info px-4 py-3 fw-bold rounded-pill text-dark" style={{ background: "linear-gradient(135deg, #00DFD8, #8B5CF6)", border: "none" }}>
                    Book Free Consultation
                  </a>
                </Link>
              </div>
            </div>

            {/* Right Sidebar: All Services Navigation & Contact Widget */}
            <div className="col-lg-4">
              <div className="sidebar-sticky" style={{ position: "sticky", top: "100px" }}>
                {/* Services List Menu */}
                <div className="sidebar-widget p-4 rounded-4 mb-4" style={{ background: "radial-gradient(circle at 20% 20%, rgba(121, 40, 202, 0.12) 0%, #0E091B 85%)", border: "1px solid rgba(121,40,202,0.25)" }}>
                  <h5 className="text-white fw-bold mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                    Our Services
                  </h5>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                    {allServices.map((item) => {
                      const isActive = item.slug === activeService.slug;
                      return (
                        <li key={item._id || item.slug}>
                          <Link legacyBehavior href={`/service-details?slug=${item.slug}`}>
                            <a
                              className="d-flex align-items-center justify-content-between p-3 rounded-3 text-decoration-none transition-all"
                              style={{
                                background: isActive ? "linear-gradient(135deg, rgba(121, 40, 202, 0.5), rgba(0, 223, 216, 0.2))" : "rgba(255,255,255,0.02)",
                                color: isActive ? "#00DFD8" : "#94A3B8",
                                border: isActive ? "1px solid rgba(0,223,216,0.4)" : "1px solid transparent",
                                fontWeight: isActive ? "700" : "500",
                              }}
                            >
                              <span>{item.title}</span>
                              <i className="bi bi-chevron-right small" />
                            </a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Need Help Card */}
                <div className="sidebar-widget p-4 rounded-4 text-center" style={{ background: "radial-gradient(circle at 50% 50%, rgba(121, 40, 202, 0.2) 0%, #080411 90%)", border: "1px solid rgba(121,40,202,0.3)" }}>
                  <div className="icon-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(0,223,216,0.15)", border: "1px solid #00DFD8", color: "#00DFD8", fontSize: "24px" }}>
                    <i className="bi bi-telephone-outbound-fill" />
                  </div>
                  <h5 className="text-white fw-bold mb-2">Have a Custom Project?</h5>
                  <p className="text-muted small mb-3">Get in touch for an NDA-protected architecture review &amp; timeline estimate.</p>
                  <a href="https://wa.me/917623890736" target="_blank" rel="noopener noreferrer" className="btn btn-outline-info rounded-pill w-100 py-2">
                    <i className="bi bi-whatsapp me-2" /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
