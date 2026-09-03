import Link from "next/link";
import React, { useState, useEffect } from "react";

const CERTIFICATIONS = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    code: "AWS-SAA",
    icon: "bi-shield-check",
    color: "#FF9900"
  },
  {
    title: "Certified Kubernetes Administrator (CKA)",
    issuer: "Linux Foundation / CNCF",
    code: "CNCF-CKA",
    icon: "bi-boxes",
    color: "#326CE5"
  },
  {
    title: "Meta Certified Full-Stack Engineer",
    issuer: "Meta / Coursera Professional",
    code: "META-FS",
    icon: "bi-patch-check-fill",
    color: "#0668E1"
  },
  {
    title: "Google Cloud Professional Architect",
    issuer: "Google Cloud Platform",
    code: "GCP-PCA",
    icon: "bi-cloud-check-fill",
    color: "#4285F4"
  },
  {
    title: "Generative AI Engineering Specialist",
    issuer: "DeepLearning.AI",
    code: "GENAI-DL",
    icon: "bi-cpu-fill",
    color: "#00DFD8"
  }
];

const METRICS = [
  { value: "150+", label: "Public & Enterprise Repositories" },
  { value: "5+ Years", label: "Full-Stack & Cloud Architecture" },
  { value: "99.9%", label: "Production System SLA Uptime" },
  { value: "100K+", label: "Active Mobile & Web Users" }
];

const CORE_STACK = [
  "Next.js 14", "React", "TypeScript", "Node.js", "Go", "Python",
  "Flutter", "Kubernetes", "Docker", "PostgreSQL", "Apache Kafka",
  "LLM Agents & RAG", "AWS / GCP", "GSAP & WebGL"
];

function Home5Team() {
  const [founderData, setFounderData] = useState({
    name: "Dhanesh Joshi",
    designation: "CEO & Founder",
    company: "TechWithJoshi Private Limited",
    image: "/assets/img/founder/dhanesh-joshi.png",
    linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
    github: "https://github.com/DHANESHJOSHI",
    instagram: "https://www.instagram.com/its_dhanesh_joshi_/",
    cal: "https://cal.com/dhanesh-joshi/30min"
  });

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
              image: founder.image?.startsWith("/") ? founder.image : (founder.image ? `/${founder.image}` : prev.image),
              linkedin: socials?.linkedin || prev.linkedin,
              github: socials?.github || prev.github,
              instagram: socials?.instagram || prev.instagram,
              cal: socials?.cal || prev.cal
            }));
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* Collaboration Callout Section */}
      <div className="collaborate-section mb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="collaborate-wrapper">
                <div className="section-title-5">
                  <span>LET’S COLLABORATE</span>
                  <h2>
                    Ready to <br />
                    <span>build next-gen software?</span>
                  </h2>
                  <div className="get-btn">
                    <a
                      href={founderData.cal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-btn3"
                    >
                      Book 30-Min Discovery
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Founder & CEO Executive Showcase */}
      <div className="home5-founder-section mb-130" id="founder-profile">
        <div className="container">
          {/* Section Header */}
          <div className="row mb-50 wow animate fadeInUp" data-wow-delay="200ms">
            <div className="col-lg-12">
              <div className="section-title-5 text-center">
                <span style={{ letterSpacing: "2px", textTransform: "uppercase" }}>
                  ✦ Leadership &amp; Engineering Vision ✦
                </span>
                <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginTop: "10px" }}>
                  Meet Our CEO &amp; Founder
                </h2>
                <p style={{ maxWidth: "680px", margin: "14px auto 0", color: "#94a3b8", fontSize: "16px" }}>
                  Architecting resilient distributed systems, enterprise AI solutions, and high-performance cross-platform platforms.
                </p>
              </div>
            </div>
          </div>

          {/* Main Executive Profile Container */}
          <div
            className="founder-executive-card p-4 p-md-5 wow animate fadeInUp"
            data-wow-delay="300ms"
            style={{
              background: "linear-gradient(145deg, rgba(23, 14, 43, 0.85) 0%, rgba(8, 4, 18, 0.98) 100%)",
              border: "1px solid rgba(121, 40, 202, 0.35)",
              borderRadius: "28px",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(121, 40, 202, 0.15)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Ambient Background Glows */}
            <div
              style={{
                position: "absolute",
                top: "-80px",
                right: "-80px",
                width: "280px",
                height: "280px",
                background: "radial-gradient(circle, rgba(0,223,216,0.18) 0%, transparent 70%)",
                pointerEvents: "none",
                borderRadius: "50%"
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-80px",
                left: "-80px",
                width: "280px",
                height: "280px",
                background: "radial-gradient(circle, rgba(121,40,202,0.25) 0%, transparent 70%)",
                pointerEvents: "none",
                borderRadius: "50%"
              }}
            />

            <div className="row g-4 g-lg-5 align-items-center">
              {/* Left Column: Founder Photo & Quick Socials */}
              <div className="col-lg-4 col-md-5 text-center">
                <div
                  className="founder-avatar-wrapper position-relative mx-auto mb-4"
                  style={{
                    maxWidth: "310px",
                    borderRadius: "28px",
                    padding: "6px",
                    background: "linear-gradient(135deg, #7928CA 0%, #00DFD8 100%)",
                    boxShadow: "0 18px 45px rgba(121, 40, 202, 0.4)"
                  }}
                >
                  <div
                    style={{
                      borderRadius: "24px",
                      overflow: "hidden",
                      background: "#0d0722"
                    }}
                  >
                    <img
                      src={founderData.image}
                      alt={founderData.name}
                      className="img-fluid w-100"
                      style={{
                        display: "block",
                        aspectRatio: "1/1",
                        objectFit: "cover",
                        transition: "transform 0.4s ease"
                      }}
                    />
                  </div>

                  {/* Verified Badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      right: "16px",
                      background: "rgba(10, 6, 25, 0.92)",
                      border: "1px solid #00DFD8",
                      borderRadius: "50px",
                      padding: "5px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#00DFD8",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.5)"
                    }}
                  >
                    <i className="bi bi-patch-check-fill" style={{ fontSize: "14px", color: "#00DFD8" }} />
                    <span>VERIFIED CEO</span>
                  </div>
                </div>

                <h3 className="text-white fw-bold mb-1" style={{ fontSize: "24px" }}>
                  {founderData.name}
                </h3>
                <div
                  className="badge px-3 py-2 rounded-pill mb-3"
                  style={{
                    background: "rgba(121, 40, 202, 0.25)",
                    border: "1px solid rgba(121, 40, 202, 0.5)",
                    color: "#00DFD8",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}
                >
                  {founderData.designation} &bull; TechWithJoshi
                </div>

                <p className="text-white-50 small mb-4" style={{ lineHeight: "1.5" }}>
                  <i className="bi bi-geo-alt-fill text-info me-1" /> Gujarat, India &bull; Global Operations
                </p>

                {/* Social Connect Matrix */}
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <a
                    href={founderData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2 text-white"
                    style={{
                      background: "linear-gradient(135deg, #0077B5 0%, #005582 100%)",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: "600",
                      textDecoration: "none",
                      border: "none"
                    }}
                  >
                    <i className="bx bxl-linkedin" style={{ fontSize: "18px" }} />
                    <span>LinkedIn Profile</span>
                  </a>

                  <a
                    href={founderData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2 text-white"
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: "600",
                      textDecoration: "none"
                    }}
                  >
                    <i className="bx bxl-github" style={{ fontSize: "18px" }} />
                    <span>GitHub</span>
                  </a>

                  <a
                    href={founderData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2 text-white"
                    style={{
                      background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: "600",
                      textDecoration: "none",
                      border: "none"
                    }}
                  >
                    <i className="bx bxl-instagram" style={{ fontSize: "18px" }} />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Bio, Stats, Certifications, Stack */}
              <div className="col-lg-8 col-md-7">
                <div className="founder-details ps-lg-3">
                  <h4 className="text-white fw-bold mb-2" style={{ fontSize: "22px" }}>
                    Executive Profile &amp; Architectural Leadership
                  </h4>
                  <p style={{ color: "#CBD5E1", fontSize: "15.5px", lineHeight: "1.75", marginBottom: "22px" }}>
                    Dhanesh Joshi is the Founder &amp; CEO of <strong>TechWithJoshi Private Limited</strong>. With 150+ open-source and client production deployments, he specializes in high-throughput distributed microservices, AI/ML agentic workflows, native mobile platforms, and zero-downtime cloud modernizations. Under his leadership, TechWithJoshi engineers resilient digital products that scale smoothly to millions of active users.
                  </p>

                  {/* Impact Metrics Row */}
                  <div className="row g-3 mb-4">
                    {METRICS.map((m, idx) => (
                      <div key={idx} className="col-6 col-md-3">
                        <div
                          className="p-3 text-center rounded-3 h-100"
                          style={{
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(121, 40, 202, 0.25)",
                            borderRadius: "14px"
                          }}
                        >
                          <div
                            style={{
                              fontSize: "22px",
                              fontWeight: "800",
                              background: "linear-gradient(135deg, #00DFD8 0%, #7928CA 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent"
                            }}
                          >
                            {m.value}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "4px", lineHeight: "1.3" }}>
                            {m.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Professional Certifications & Credentials */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <i className="bi bi-award-fill text-warning" style={{ fontSize: "18px" }} />
                      <h5 className="text-white fw-bold mb-0" style={{ fontSize: "16px" }}>
                        Professional Certifications &amp; Credentials
                      </h5>
                    </div>

                    <div className="row g-2">
                      {CERTIFICATIONS.map((cert, cIdx) => (
                        <div key={cIdx} className="col-12 col-sm-6">
                          <div
                            className="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
                            style={{
                              background: "rgba(15, 10, 30, 0.6)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              borderRadius: "10px"
                            }}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <i className={`bi ${cert.icon}`} style={{ color: cert.color, fontSize: "16px" }} />
                              <div>
                                <div style={{ color: "#F1F5F9", fontSize: "13px", fontWeight: "600", lineHeight: "1.2" }}>
                                  {cert.title}
                                </div>
                                <div style={{ color: "#64748B", fontSize: "11px" }}>{cert.issuer}</div>
                              </div>
                            </div>
                            <span
                              className="badge"
                              style={{
                                background: "rgba(0, 223, 216, 0.12)",
                                color: "#00DFD8",
                                fontSize: "10px",
                                border: "1px solid rgba(0, 223, 216, 0.3)"
                              }}
                            >
                              {cert.code}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Technical Capabilities Mastery */}
                  <div className="mb-4">
                    <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600", marginBottom: "8px" }}>
                      CORE TECHNICAL DOMAINS &amp; ARCHITECTURE STACK:
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {CORE_STACK.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            background: "rgba(121, 40, 202, 0.15)",
                            border: "1px solid rgba(121, 40, 202, 0.35)",
                            color: "#E2E8F0",
                            fontSize: "12px",
                            padding: "4px 10px",
                            borderRadius: "6px"
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-wrap align-items-center gap-3 pt-2">
                    <a
                      href={founderData.cal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-btn3 d-inline-flex align-items-center gap-2"
                      style={{ padding: "10px 24px", fontSize: "14px" }}
                    >
                      <i className="bi bi-calendar-event-fill" />
                      <span>Schedule 1-on-1 Consultation</span>
                    </a>

                    <Link legacyBehavior href="/project">
                      <a
                        className="btn d-inline-flex align-items-center gap-2 px-3 py-2 text-white"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "8px",
                          fontSize: "14px",
                          textDecoration: "none"
                        }}
                      >
                        <i className="bi bi-folder2-open text-info" />
                        <span>View Portfolio Work</span>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home5Team;
