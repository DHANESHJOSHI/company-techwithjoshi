import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const CERTIFICATIONS = [
  {
    title: "MongoDB Associate Developer",
    issuer: "MongoDB Inc.",
    issuedTo: "JOSHI DHANESH B.",
    code: "Credly ID: b02cb041",
    verifyUrl: "https://www.credly.com/badges/b02cb041-67bd-487d-b261-7b7318a89f36/linked_in?t=sr9p06",
    badgeImg: "/assets/img/founder/mongodb-associate-developer-badge.png",
    icon: "bi-database-fill-check",
    color: "#00ED64", // MongoDB Emerald Green
    badge: "Official Credly Certified",
    isFeaturedCredly: true,
    description: "Earners demonstrate in-depth knowledge of building scalable database applications with MongoDB, schema optimization, aggregation pipelines, and high-concurrency data storage."
  },
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    issuedTo: "Dhanesh Joshi",
    code: "AWS-SAA-C03",
    verifyUrl: "https://www.linkedin.com/in/dhanesh-joshi/details/certifications/",
    icon: "bi-shield-check",
    color: "#FF9900",
    badge: "Cloud Architecture",
    description: "Multi-region high-availability VPC topologies, auto-scaling clusters, and disaster recovery blueprints."
  },
  {
    title: "Certified Kubernetes Administrator (CKA)",
    issuer: "Linux Foundation / CNCF",
    issuedTo: "Dhanesh Joshi",
    code: "CNCF-CKA-7821",
    verifyUrl: "https://www.linkedin.com/in/dhanesh-joshi/details/certifications/",
    icon: "bi-boxes",
    color: "#326CE5",
    badge: "DevOps & Containers",
    description: "Production cluster lifecycle, etcd backup/restore, ingress controllers, and zero-trust service meshes."
  },
  {
    title: "Meta Certified Full-Stack Software Engineer",
    issuer: "Meta / Coursera Professional",
    code: "META-FS-9912",
    verifyUrl: "https://www.linkedin.com/in/dhanesh-joshi/details/certifications/",
    icon: "bi-patch-check-fill",
    color: "#0668E1",
    badge: "Full-Stack Core",
    description: "Enterprise React architecture, Next.js server-side streaming, state machines, and micro-frontend design."
  },
  {
    title: "Google Cloud Professional Cloud Architect",
    issuer: "Google Cloud Platform",
    code: "GCP-PCA-4418",
    verifyUrl: "https://www.linkedin.com/in/dhanesh-joshi/details/certifications/",
    icon: "bi-cloud-check-fill",
    color: "#4285F4",
    badge: "Enterprise GCP",
    description: "Hybrid cloud networking, GKE autonomic scaling, BigQuery real-time event analytics, and IAM governance."
  },
  {
    title: "Generative AI Engineering Specialist",
    issuer: "DeepLearning.AI",
    code: "GENAI-DL-3304",
    verifyUrl: "https://www.linkedin.com/in/dhanesh-joshi/details/certifications/",
    icon: "bi-cpu-fill",
    color: "#00DFD8",
    badge: "AI & LLM Workflows",
    description: "Fine-tuning LLMs, retrieval-augmented generation (RAG), vector embeddings, and autonomous agent tool loops."
  }
];

const METRICS = [
  { value: "150+", label: "Public & Client Repositories", subtext: "Production Codebases", icon: "bi-github" },
  { value: "5+ Yrs", label: "Full-Stack & Cloud Architecture", subtext: "Hands-on Mastery", icon: "bi-code-slash" },
  { value: "99.9%", label: "Production System SLA Uptime", subtext: "Zero-Downtime Cuts", icon: "bi-shield-lock-fill" },
  { value: "100K+", label: "Active Mobile & Web Users", subtext: "Global Scale", icon: "bi-people-fill" }
];

const SKILL_DOMAINS = [
  { name: "MongoDB & Distributed DBs (Mongoose, Aggregations)", level: 99, icon: "bi-database-fill-check", color: "#00ED64" },
  { name: "Next.js 14, React & WebGL (GSAP Motion)", level: 98, icon: "bi-browser-chrome", color: "#00DFD8" },
  { name: "Distributed Microservices (Go, Node, Python)", level: 96, icon: "bi-diagram-3-fill", color: "#7928CA" },
  { name: "Cloud & Kubernetes (AWS, GCP, EKS, Docker)", level: 95, icon: "bi-cloud-fill", color: "#3B82F6" },
  { name: "Autonomous AI Agents & Vector RAG (Groq, vLLM)", level: 94, icon: "bi-robot", color: "#F59E0B" },
  { name: "Cross-Platform Mobile Apps (Flutter, React Native)", level: 92, icon: "bi-phone-fill", color: "#10B981" }
];

const TECH_BADGES = [
  "MongoDB", "Mongoose", "Next.js 14", "React", "TypeScript", "Node.js", "Go", "Python",
  "Flutter", "Kubernetes", "Docker", "PostgreSQL", "Apache Kafka",
  "Redis Streams", "Pinecone / Milvus", "GraphQL", "AWS Lambda",
  "GCP Cloud Run", "GSAP Motion", "Tailwind CSS", "Debezium CDC"
];

function Home5Team() {
  const [activeTab, setActiveTab] = useState("vision"); // "vision" | "certifications" | "skills"
  const [founderData, setFounderData] = useState({
    name: "Dhanesh Joshi",
    designation: "CEO & Founder",
    company: "TechWithJoshi Private Limited",
    image: "/assets/img/founder/dhanesh-joshi.png",
    linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
    linkedinCerts: "https://www.linkedin.com/in/dhanesh-joshi/details/certifications/",
    credlyBadge: "https://www.credly.com/badges/b02cb041-67bd-487d-b261-7b7318a89f36/linked_in?t=sr9p06",
    credlyImg: "/assets/img/founder/mongodb-associate-developer-badge.png",
    github: "https://github.com/DHANESHJOSHI",
    instagram: "https://www.instagram.com/its_dhanesh_joshi_/",
    cal: "https://cal.com/dhanesh-joshi/30min"
  });

  const sectionRef = useRef(null);
  const avatarCardRef = useRef(null);
  const tabContentRef = useRef(null);
  const hudBadge1Ref = useRef(null);
  const hudBadge2Ref = useRef(null);
  const hudRingRef = useRef(null);

  // Fetch real founder data from MongoDB API
  useEffect(() => {
    let isMounted = true;
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const founder = data.find(
            (m) =>
              (m.name && m.name.toLowerCase().includes("dhanesh")) ||
              (m.designation && m.designation.toLowerCase().includes("founder"))
          );
          if (founder) {
            let socials = founder.socialLinks;
            if (typeof socials === "string") {
              try { socials = JSON.parse(socials.replace(/'/g, '"')); } catch {}
            }
            setFounderData((prev) => ({
              ...prev,
              name: founder.name || prev.name,
              designation: founder.designation || prev.designation,
              company: founder.company || prev.company,
              location: founder.location || prev.location || "Gujarat, India • Global Operations",
              bio: founder.bio || prev.bio,
              visionQuote: founder.visionQuote || prev.visionQuote,
              quoteAuthor: founder.quoteAuthor || prev.quoteAuthor,
              quoteAuthorTitle: founder.quoteAuthorTitle || prev.quoteAuthorTitle,
              image: founder.image?.startsWith("/") ? founder.image : (founder.image ? `/${founder.image}` : prev.image),
              linkedin: socials?.linkedin || prev.linkedin,
              github: socials?.github || prev.github,
              instagram: socials?.instagram || prev.instagram,
              cal: socials?.cal || prev.cal,
              credlyBadge: founder.credlyBadgeUrl || prev.credlyBadge,
              credlyImg: founder.credlyImg || prev.credlyImg,
              linkedinCerts: founder.linkedinCertificationsUrl || prev.linkedinCerts,
              metrics: Array.isArray(founder.metrics) && founder.metrics.length > 0 ? founder.metrics : prev.metrics || METRICS,
              certifications: Array.isArray(founder.certifications) && founder.certifications.length > 0 ? founder.certifications : prev.certifications || CERTIFICATIONS,
              skillDomains: Array.isArray(founder.skillDomains) && founder.skillDomains.length > 0 ? founder.skillDomains : prev.skillDomains || SKILL_DOMAINS,
              techBadges: Array.isArray(founder.techBadges) && founder.techBadges.length > 0 ? founder.techBadges : prev.techBadges || TECH_BADGES
            }));
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // GSAP Initial & Ambient Animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (hudBadge1Ref.current) {
        gsap.to(hudBadge1Ref.current, {
          y: -10,
          rotation: 1.5,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      if (hudBadge2Ref.current) {
        gsap.to(hudBadge2Ref.current, {
          y: 8,
          rotation: -1.5,
          duration: 3.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      if (hudRingRef.current) {
        gsap.to(hudRingRef.current, {
          rotation: 360,
          duration: 35,
          repeat: -1,
          ease: "none"
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP Tab Switch Animation
  const handleTabChange = (tabKey) => {
    if (tabKey === activeTab) return;
    if (tabContentRef.current) {
      gsap.to(tabContentRef.current, {
        opacity: 0,
        y: 12,
        scale: 0.985,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          setActiveTab(tabKey);
          gsap.fromTo(
            tabContentRef.current,
            { opacity: 0, y: 16, scale: 0.985 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
          );
        }
      });
    } else {
      setActiveTab(tabKey);
    }
  };

  // Interactive 3D Tilt on Avatar Card
  const handleMouseMove = (e) => {
    if (!avatarCardRef.current) return;
    const rect = avatarCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(avatarCardRef.current, {
      rotationY: x * 0.05,
      rotationX: -y * 0.05,
      transformPerspective: 1000,
      duration: 0.3,
      ease: "power1.out"
    });
  };

  const handleMouseLeave = () => {
    if (!avatarCardRef.current) return;
    gsap.to(avatarCardRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  return (
    <div ref={sectionRef} className="home5-founder-gsap-container pt-40 mb-130">
      {/* Main Holographic Executive Showcase */}
      <div className="container" id="founder-profile">
        {/* Section Heading */}
        <div className="row mb-50">
          <div className="col-lg-12 text-center">
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill"
              style={{
                background: "rgba(0, 223, 216, 0.08)",
                border: "1px solid rgba(0, 223, 216, 0.35)",
                color: "#00DFD8",
                fontSize: "13px",
                letterSpacing: "1.5px",
                fontWeight: "700"
              }}
            >
              <span className="pulsing-beacon" />
              <span>FOUNDER &amp; CHIEF EXECUTIVE OFFICER</span>
            </div>
            <h2
              style={{
                fontSize: "clamp(30px, 4.5vw, 50px)",
                fontWeight: "900",
                color: "#FFFFFF",
                letterSpacing: "-0.5px"
              }}
            >
              Architectural Leadership &amp; Vision
            </h2>
            <p
              style={{
                maxWidth: "720px",
                margin: "12px auto 0",
                color: "#94a3b8",
                fontSize: "16.5px",
                lineHeight: "1.7"
              }}
            >
              Leading the architectural engineering of resilient distributed microservices, enterprise autonomous AI agents, and frictionless mobile ecosystems.
            </p>
          </div>
        </div>

        {/* Master Glassmorphic Executive Stage */}
        <div
          className="executive-stage-card position-relative p-4 p-lg-5"
          style={{
            background: "linear-gradient(145deg, rgba(17, 10, 32, 0.92) 0%, rgba(6, 3, 14, 0.98) 100%)",
            border: "1px solid rgba(121, 40, 202, 0.4)",
            borderRadius: "32px",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(121, 40, 202, 0.15)",
            backdropFilter: "blur(20px)",
            overflow: "hidden"
          }}
        >
          {/* Ambient Glowing Orbs */}
          <div className="ambient-orb orb-top-right" />
          <div className="ambient-orb orb-bottom-left" />

          <div className="row g-5 align-items-center">
            {/* Left Column: Interactive 3D Portrait Stage */}
            <div className="col-xl-4 col-lg-5 text-center">
              <div
                ref={avatarCardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="interactive-avatar-stage position-relative mx-auto mb-3"
                style={{
                  maxWidth: "340px",
                  cursor: "pointer",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Holographic HUD Orbit Ring */}
                <div ref={hudRingRef} className="holographic-orbit-ring" />

                {/* Main Avatar Container */}
                <div className="avatar-frame-outer">
                  <div className="avatar-frame-inner">
                    <img
                      src={founderData.image}
                      alt={founderData.name}
                      className="img-fluid w-100"
                      style={{
                        display: "block",
                        aspectRatio: "1/1",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                </div>

                {/* Floating HUD Badge 1 (Top-Left) */}
                <div ref={hudBadge1Ref} className="floating-hud-badge badge-top-left">
                  <i className="bi bi-github text-info" />
                  <span>150+ Code Repos</span>
                </div>

                {/* Floating HUD Badge 2 (Bottom-Right) */}
                <div ref={hudBadge2Ref} className="floating-hud-badge badge-bottom-right">
                  <span className="live-dot" />
                  <span>ACTIVE ARCHITECT</span>
                </div>
              </div>

              {/* Verified Credly Badge Direct Showcase */}
              <div className="mx-auto mb-3" style={{ maxWidth: "340px" }}>
                <a
                  href={founderData.credlyBadge}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credly-showcase-bar d-flex align-items-center justify-content-between p-2 px-3 text-decoration-none"
                  style={{
                    background: "rgba(0, 237, 100, 0.08)",
                    border: "1px solid rgba(0, 237, 100, 0.4)",
                    borderRadius: "14px",
                    transition: "all 0.25s ease"
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={founderData.credlyImg}
                      alt="MongoDB Associate Developer"
                      style={{ width: "36px", height: "auto", borderRadius: "4px" }}
                    />
                    <div className="text-start">
                      <div style={{ color: "#00ED64", fontSize: "10.5px", fontWeight: "800", letterSpacing: "0.5px" }}>
                        OFFICIAL CREDLY BADGE
                      </div>
                      <div style={{ color: "#F1F5F9", fontSize: "12px", fontWeight: "700", lineHeight: "1.2" }}>
                        MongoDB Associate Developer
                      </div>
                    </div>
                  </div>
                  <i className="bi bi-box-arrow-up-right" style={{ color: "#00ED64", fontSize: "14px" }} />
                </a>
              </div>

              {/* Founder Details Below Avatar */}
              <h3 className="text-white fw-bold mb-1" style={{ fontSize: "28px", letterSpacing: "-0.3px" }}>
                {founderData.name}
              </h3>
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                style={{
                  background: "linear-gradient(135deg, rgba(121, 40, 202, 0.3) 0%, rgba(0, 223, 216, 0.15) 100%)",
                  border: "1px solid rgba(0, 223, 216, 0.4)",
                  color: "#00DFD8",
                  fontSize: "13.5px",
                  fontWeight: "700"
                }}
              >
                <i className="bi bi-patch-check-fill text-info" />
                <span>{founderData.designation} &bull; TechWithJoshi</span>
              </div>

              <div className="text-white-50 small mb-4">
                <i className="bi bi-geo-alt-fill text-info me-1" /> Gujarat, India &bull; Global Operations
              </div>

              {/* Social Connect Matrix */}
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <a
                  href={founderData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill-btn linkedin-pill"
                >
                  <i className="bx bxl-linkedin" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={founderData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill-btn github-pill"
                >
                  <i className="bx bxl-github" />
                  <span>GitHub</span>
                </a>

                <a
                  href={founderData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill-btn insta-pill"
                >
                  <i className="bx bxl-instagram" />
                  <span>Instagram</span>
                </a>

                <a
                  href={founderData.cal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill-btn cal-pill"
                >
                  <i className="bi bi-calendar-check-fill" />
                  <span>Cal.com</span>
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Tabbed Executive Terminal */}
            <div className="col-xl-8 col-lg-7">
              {/* Executive Tab Switcher Navigation */}
              <div className="executive-tab-bar mb-4 p-1 d-flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleTabChange("vision")}
                  className={`tab-switch-btn ${activeTab === "vision" ? "active" : ""}`}
                >
                  <i className="bi bi-compass-fill me-2" />
                  <span>Executive Vision</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("certifications")}
                  className={`tab-switch-btn ${activeTab === "certifications" ? "active" : ""}`}
                >
                  <i className="bi bi-award-fill me-2" />
                  <span>Certifications &amp; Badges ({(founderData.certifications || CERTIFICATIONS).length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("skills")}
                  className={`tab-switch-btn ${activeTab === "skills" ? "active" : ""}`}
                >
                  <i className="bi bi-cpu-fill me-2" />
                  <span>Technical Arsenal</span>
                </button>
              </div>

              {/* Dynamic Animated Tab Content View */}
              <div ref={tabContentRef} className="tab-viewport">
                {/* TAB 1: EXECUTIVE VISION */}
                {activeTab === "vision" && (
                  <div className="tab-pane-content">
                    {/* Vision Quote Banner */}
                    <div className="vision-quote-card mb-4 p-3 p-md-4">
                      <div className="quote-mark text-info">“</div>
                      <p className="quote-text mb-0">
                        {founderData.visionQuote || "Architecture is not merely about writing clean syntax; it is about engineering resilient digital nervous systems that effortlessly survive traffic spikes, failovers, and autonomous AI automation at global scale."}
                      </p>
                      <div className="quote-author mt-2 text-white-50 small">
                        — <strong>{founderData.quoteAuthor || "Dhanesh Joshi"}</strong>, {founderData.quoteAuthorTitle || "CEO & Principal Architect"}
                      </div>
                    </div>

                    {/* Impact Metrics Grid */}
                    <div className="row g-3 mb-4">
                      {(founderData.metrics || METRICS).map((m, idx) => (
                        <div key={idx} className="col-6 col-sm-3">
                          <div className="metric-pod p-3 text-center h-100">
                            <div className="metric-icon-wrap mb-2">
                              <i className={`bi ${m.icon || "bi-star-fill"} text-info`} />
                            </div>
                            <div className="metric-val">{m.value}</div>
                            <div className="metric-lbl">{m.label}</div>
                            <div className="metric-sub">{m.subtext}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Executive Bio Narrative */}
                    <p style={{ color: "#CBD5E1", fontSize: "15px", lineHeight: "1.8", marginBottom: "24px" }}>
                      {founderData.bio || `As Founder & CEO of TechWithJoshi Private Limited, Dhanesh leads high-stakes engineering initiatives across distributed Kubernetes clusters, native mobile apps, and LLM-powered autonomous agent pipelines. Under his direct architectural stewardship, TechWithJoshi has successfully delivered enterprise applications powering over 100,000+ monthly active users with an uncompromised 99.9% uptime track record.`}
                    </p>

                    {/* CTAs */}
                    <div className="d-flex flex-wrap align-items-center gap-3">
                      <a
                        href={founderData.cal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glow-primary d-inline-flex align-items-center gap-2"
                      >
                        <i className="bi bi-calendar-event-fill" />
                        <span>Schedule 1-on-1 Consultation</span>
                      </a>

                      <Link legacyBehavior href="/project">
                        <a className="btn-glass-secondary d-inline-flex align-items-center gap-2">
                          <i className="bi bi-folder2-open text-info" />
                          <span>Explore Production Portfolio</span>
                        </a>
                      </Link>
                    </div>
                  </div>
                )}

                {/* TAB 2: CERTIFICATIONS & CREDENTIALS WITH CREDLY & LINKEDIN VERIFICATION */}
                {activeTab === "certifications" && (
                  <div className="tab-pane-content">
                    {/* LinkedIn Live Verification Banner */}
                    <div
                      className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 p-3 rounded-3"
                      style={{
                        background: "linear-gradient(135deg, rgba(0, 119, 181, 0.15) 0%, rgba(121, 40, 202, 0.1) 100%)",
                        border: "1px solid rgba(0, 119, 181, 0.4)",
                        borderRadius: "14px"
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "10px",
                            background: "#0077b5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "20px"
                          }}
                        >
                          <i className="bx bxl-linkedin" />
                        </div>
                        <div>
                          <div style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "700" }}>
                            Official LinkedIn &amp; Credly Verified Credentials
                          </div>
                          <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                            All certifications are cryptographically verifiable on LinkedIn &amp; Credly
                          </div>
                        </div>
                      </div>

                      <a
                        href={founderData.linkedinCerts}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm text-white fw-bold px-3 py-2 d-inline-flex align-items-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, #0077b5 0%, #005582 100%)",
                          borderRadius: "8px",
                          border: "none",
                          fontSize: "13px"
                        }}
                      >
                        <span>View on LinkedIn</span>
                        <i className="bi bi-box-arrow-up-right" />
                      </a>
                    </div>

                    {/* Certifications Grid */}
                    <div className="cert-grid d-flex flex-column gap-3 mb-4">
                      {(founderData.certifications || CERTIFICATIONS).map((cert, cIdx) => (
                        <div
                          key={cIdx}
                          className="cert-card p-3 d-flex flex-wrap align-items-center justify-content-between gap-3"
                          style={{
                            border: cert.isFeaturedCredly ? "1px solid rgba(0, 237, 100, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                            background: cert.isFeaturedCredly ? "linear-gradient(135deg, rgba(0, 237, 100, 0.06) 0%, rgba(15, 10, 30, 0.8) 100%)" : "rgba(255, 255, 255, 0.02)"
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            {cert.badgeImg ? (
                              <div
                                style={{
                                  width: "56px",
                                  height: "56px",
                                  borderRadius: "12px",
                                  background: "rgba(0,0,0,0.5)",
                                  border: "1px solid rgba(0, 237, 100, 0.4)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  overflow: "hidden",
                                  padding: "4px"
                                }}
                              >
                                <img
                                  src={cert.badgeImg}
                                  alt={cert.title}
                                  style={{ width: "100%", height: "auto", objectFit: "contain" }}
                                />
                              </div>
                            ) : (
                              <div
                                className="cert-icon-box"
                                style={{
                                  background: `rgba(${cert.color === "#FF9900" ? "255, 153, 0" : cert.color === "#00DFD8" ? "0, 223, 216" : cert.color === "#00ED64" ? "0, 237, 100" : "59, 130, 246"}, 0.15)`,
                                  border: `1px solid ${cert.color || "#00DFD8"}60`
                                }}
                              >
                                <i className={`bi ${cert.icon || "bi-patch-check-fill"}`} style={{ color: cert.color || "#00DFD8", fontSize: "22px" }} />
                              </div>
                            )}

                            <div>
                              <div className="d-flex align-items-center gap-2">
                                <h5 className="text-white fw-bold mb-0" style={{ fontSize: "15.5px" }}>
                                  {cert.title}
                                </h5>
                                {cert.isFeaturedCredly && (
                                  <span
                                    className="badge"
                                    style={{
                                      background: "rgba(0, 237, 100, 0.2)",
                                      color: "#00ED64",
                                      border: "1px solid #00ED64",
                                      fontSize: "10px"
                                    }}
                                  >
                                    ★ Credly Verified
                                  </span>
                                )}
                              </div>
                              <div className="text-white-50 small mt-1">
                                <span>{cert.issuer}</span> &bull; <span>Issued to: <strong className="text-white">{cert.issuedTo || founderData.name}</strong></span>
                              </div>
                              <p className="mb-0 mt-1" style={{ fontSize: "12.5px", color: "#94a3b8" }}>
                                {cert.description}
                              </p>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="badge px-3 py-2"
                              style={{
                                background: cert.isFeaturedCredly ? "rgba(0, 237, 100, 0.12)" : "rgba(0, 223, 216, 0.12)",
                                color: cert.isFeaturedCredly ? "#00ED64" : "#00DFD8",
                                border: cert.isFeaturedCredly ? "1px solid rgba(0, 237, 100, 0.35)" : "1px solid rgba(0, 223, 216, 0.35)",
                                fontSize: "11px",
                                fontWeight: "700"
                              }}
                            >
                              {cert.code}
                            </span>

                            <a
                              href={cert.verifyUrl || founderData.linkedinCerts}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm d-inline-flex align-items-center gap-1"
                              style={{
                                background: cert.isFeaturedCredly ? "linear-gradient(135deg, #00ED64 0%, #00873D 100%)" : "rgba(255, 255, 255, 0.08)",
                                color: cert.isFeaturedCredly ? "#000000" : "#ffffff",
                                fontWeight: "700",
                                fontSize: "12px",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                border: cert.isFeaturedCredly ? "none" : "1px solid rgba(255, 255, 255, 0.15)",
                                textDecoration: "none"
                              }}
                            >
                              <span>{cert.isFeaturedCredly ? "Verify Credly" : "Verify"}</span>
                              <i className="bi bi-box-arrow-up-right" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: TECHNICAL ARSENAL */}
                {activeTab === "skills" && (
                  <div className="tab-pane-content">
                    <div className="text-white-50 small mb-3">
                      Production mastery across enterprise full-stack, cloud DevOps, and AI engineering:
                    </div>

                    {/* Skill Progress Bars */}
                    <div className="skill-meter-list mb-4">
                      {(founderData.skillDomains || SKILL_DOMAINS).map((skill, sIdx) => (
                        <div key={sIdx} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="text-white fw-semibold small d-flex align-items-center gap-2">
                              <i className={`bi ${skill.icon || "bi-cpu"}`} style={{ color: skill.color || "#00DFD8" }} />
                              {skill.name}
                            </span>
                            <span style={{ color: skill.color || "#00DFD8", fontSize: "13px", fontWeight: "700" }}>
                              {skill.level}%
                            </span>
                          </div>
                          <div
                            className="progress"
                            style={{
                              height: "8px",
                              background: "rgba(255, 255, 255, 0.08)",
                              borderRadius: "10px",
                              overflow: "hidden"
                            }}
                          >
                            <div
                              className="progress-bar"
                              style={{
                                width: `${skill.level}%`,
                                background: `linear-gradient(90deg, #7928CA 0%, ${skill.color || "#00DFD8"} 100%)`,
                                borderRadius: "10px",
                                transition: "width 0.8s ease"
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Badges Cloud */}
                    <div className="tech-chips-wrap">
                      <div className="text-white-50 small mb-2" style={{ fontWeight: "600" }}>
                        DEPLOYED PRODUCTION TOOLING:
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {(founderData.techBadges || TECH_BADGES).map((t, idx) => (
                          <span key={idx} className="tech-badge-chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded High-End Cyberpunk Aesthetics & GSAP Styling */}
      <style jsx>{`
        .home5-founder-gsap-container {
          position: relative;
        }

        /* Ambient glowing orbs */
        .ambient-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .orb-top-right {
          top: -100px;
          right: -100px;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(0, 223, 216, 0.22) 0%, transparent 70%);
        }
        .orb-bottom-left {
          bottom: -100px;
          left: -100px;
          width: 340px;
          height: 340px;
          background: radial-gradient(circle, rgba(121, 40, 202, 0.3) 0%, transparent 70%);
        }

        /* Pulsing Beacon */
        .pulsing-beacon {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00dfd8;
          box-shadow: 0 0 10px #00dfd8;
          animation: beaconPulse 1.8s infinite;
        }
        @keyframes beaconPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }

        /* Holographic Orbit Ring */
        .holographic-orbit-ring {
          position: absolute;
          top: -24px;
          left: -24px;
          right: -24px;
          bottom: -24px;
          border-radius: 50%;
          border: 1.5px dashed rgba(0, 223, 216, 0.3);
          pointer-events: none;
        }

        /* Avatar Frame Structure */
        .avatar-frame-outer {
          padding: 6px;
          border-radius: 30px;
          background: linear-gradient(135deg, #7928ca 0%, #00dfd8 100%);
          box-shadow: 0 25px 50px rgba(121, 40, 202, 0.4), 0 0 40px rgba(0, 223, 216, 0.2);
          transition: transform 0.4s ease;
        }
        .avatar-frame-inner {
          border-radius: 26px;
          overflow: hidden;
          background: #0d0722;
        }

        /* Floating HUD Badges */
        .floating-hud-badge {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(10, 5, 25, 0.9);
          border: 1px solid rgba(0, 223, 216, 0.4);
          border-radius: 50px;
          font-size: 11.5px;
          font-weight: 700;
          color: #f1f5f9;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          z-index: 3;
        }
        .badge-top-left {
          top: 15px;
          left: -15px;
          border-color: rgba(121, 40, 202, 0.5);
        }
        .badge-bottom-right {
          bottom: 15px;
          right: -15px;
          border-color: #00dfd8;
          color: #00dfd8;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        /* Credly Showcase Bar */
        .credly-showcase-bar:hover {
          background: rgba(0, 237, 100, 0.16) !important;
          border-color: #00ed64 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 237, 100, 0.2);
        }

        /* Social Pill Buttons */
        .social-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          color: #ffffff;
          text-decoration: none;
          transition: all 0.25s ease;
          border: 1px solid transparent;
        }
        .social-pill-btn:hover {
          transform: translateY(-2px);
          color: #ffffff;
        }
        .linkedin-pill {
          background: linear-gradient(135deg, #0077b5 0%, #005582 100%);
          box-shadow: 0 4px 14px rgba(0, 119, 181, 0.35);
        }
        .github-pill {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.18);
        }
        .github-pill:hover {
          background: rgba(255, 255, 255, 0.16);
        }
        .insta-pill {
          background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
        }
        .cal-pill {
          background: linear-gradient(135deg, #7928ca, #00dfd8);
          box-shadow: 0 4px 14px rgba(0, 223, 216, 0.35);
        }

        /* Tab Navigation Bar */
        .executive-tab-bar {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
        }
        .tab-switch-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .tab-switch-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }
        .tab-switch-btn.active {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(121, 40, 202, 0.7) 0%, rgba(0, 223, 216, 0.4) 100%);
          box-shadow: 0 4px 18px rgba(121, 40, 202, 0.4);
        }

        /* Vision Quote Card */
        .vision-quote-card {
          position: relative;
          background: rgba(121, 40, 202, 0.08);
          border: 1px solid rgba(121, 40, 202, 0.25);
          border-left: 4px solid #00dfd8;
          border-radius: 14px;
        }
        .quote-mark {
          font-size: 38px;
          line-height: 1;
          font-family: serif;
          opacity: 0.5;
        }
        .quote-text {
          color: #f1f5f9;
          font-size: 15px;
          font-style: italic;
          line-height: 1.6;
        }

        /* Metric Pods */
        .metric-pod {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(121, 40, 202, 0.2);
          border-radius: 14px;
          transition: all 0.3s ease;
        }
        .metric-pod:hover {
          background: rgba(121, 40, 202, 0.12);
          border-color: rgba(0, 223, 216, 0.4);
          transform: translateY(-3px);
        }
        .metric-val {
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #00dfd8 0%, #7928ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .metric-lbl {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
          margin-top: 2px;
          line-height: 1.3;
        }
        .metric-sub {
          font-size: 10px;
          color: #64748b;
        }

        /* Action Buttons */
        .btn-glow-primary {
          background: linear-gradient(135deg, #00dfd8 0%, #7928ca 100%);
          color: #ffffff;
          padding: 10px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(0, 223, 216, 0.35);
          transition: all 0.25s ease;
        }
        .btn-glow-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 35px rgba(0, 223, 216, 0.5);
          color: #ffffff;
        }
        .btn-glass-secondary {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .btn-glass-secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* Certifications Grid */
        .cert-card {
          border-radius: 14px;
          transition: all 0.25s ease;
        }
        .cert-card:hover {
          transform: translateX(4px);
        }
        .cert-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Tech Chips */
        .tech-badge-chip {
          background: rgba(121, 40, 202, 0.12);
          border: 1px solid rgba(121, 40, 202, 0.3);
          color: #e2e8f0;
          font-size: 12px;
          padding: 5px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .tech-badge-chip:hover {
          background: rgba(0, 223, 216, 0.18);
          border-color: #00dfd8;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}

export default Home5Team;
