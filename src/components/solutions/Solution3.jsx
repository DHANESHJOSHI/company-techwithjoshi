import React, { useMemo } from "react";
import SwiperCore, { Autoplay, EffectFade, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useCMS } from "@/hooks/useCMS";

SwiperCore.use([Pagination, Navigation, Autoplay, EffectFade]);

const DEFAULT_SOLUTIONS = [
  {
    id: "sol-1",
    title: "Web & SaaS Engineering",
    description: "Full-stack web application development leveraging Next.js, React, Node.js, and high-performance serverless architectures.",
    feature1: "Next.js & React SSR",
    feature2: "Microservices & APIs",
    iconClass: "bi-code-slash",
    link: "/service"
  },
  {
    id: "sol-2",
    title: "Cloud & DevOps Solutions",
    description: "Enterprise multi-cloud architecture, automated Docker/Kubernetes containerization, and resilient CI/CD deployment pipelines.",
    feature1: "AWS & GCP Infrastructure",
    feature2: "Zero-Downtime Releases",
    iconClass: "bi-cloud-check",
    link: "/service"
  },
  {
    id: "sol-3",
    title: "AI & Machine Learning Systems",
    description: "Custom generative AI workflows, intelligent automation agents, enterprise LLM fine-tuning, and vectorized semantic search.",
    feature1: "Autonomous Reasoning",
    feature2: "Vector Embeddings & RAG",
    iconClass: "bi-cpu",
    link: "/service"
  },
  {
    id: "sol-4",
    title: "Mobile App Development",
    description: "Cross-platform iOS and Android applications in React Native and Flutter with real-time syncing and intuitive UI/UX.",
    feature1: "Native Performance",
    feature2: "Real-Time WebSocket Sync",
    iconClass: "bi-phone",
    link: "/service"
  },
  {
    id: "sol-5",
    title: "Cyber Security & DevSecOps",
    description: "End-to-end zero-trust architecture, automated vulnerability scanning, encrypted databases, and compliance security audits.",
    feature1: "Zero-Trust Security",
    feature2: "SOC2 & GDPR Compliance",
    iconClass: "bi-shield-check",
    link: "/service"
  }
];

function Solution3() {
  const { data: cmsData } = useCMS("solutions");
  const solutions = (cmsData && cmsData.items && cmsData.items.length > 0) ? cmsData.items : DEFAULT_SOLUTIONS;
  const sectionTitle = cmsData?.title || "Our Solutions";
  const sectionSubtitle = cmsData?.subtitle || "Explore our specialized engineering disciplines, from modern full-stack web platforms and cloud automation to intelligent AI models and data analytics.";

  const slider = useMemo(() => {
    return {
      loop: true,
      slidesPerView: "auto",
      roundLengths: true,
      spaceBetween: 30,
      speed: 1000,
      autoplay: {
        delay: 5000
      },
      navigation: {
        nextEl: ".nextbtn1",
        prevEl: ".prevbtn1",
      },
      breakpoints: {
        280: { slidesPerView: 1 },
        386: { slidesPerView: 1 },
        576: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
        1400: { slidesPerView: 3 },
      }
    };
  }, []);

  return (
    <div className="home3-solution-section sec-mar">
      <div className="container">
        <div className="row mb-55 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-12 d-flex align-items-center justify-content-between gap-4 flex-wrap">
            <div className="section-title-3">
              <h2>{sectionTitle}</h2>
              <p>{sectionSubtitle}</p>
            </div>
            <div className="swiper-btn-group">
              <div className="swiper-btn prevbtn1" style={{ cursor: "pointer" }}>
                <i className="bi bi-arrow-left" />
              </div>
              <div className="swiper-btn nextbtn1" style={{ cursor: "pointer" }}>
                <i className="bi bi-arrow-right" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Swiper loop={true} {...slider} className="swiper home3-solution-slider">
                {solutions.map((sol, idx) => (
                  <SwiperSlide key={sol.id || idx} className="swiper-slide h-auto">
                    <div className="solution-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between" style={{ background: "radial-gradient(circle at 15% 15%, rgba(121, 40, 202, 0.14) 0%, #0E091B 85%)", border: "1px solid rgba(121, 40, 202, 0.28)", boxShadow: "0 14px 35px rgba(0, 0, 0, 0.45)" }}>
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "14px", background: "rgba(121, 40, 202, 0.2)", border: "1px solid rgba(0, 223, 216, 0.35)" }}>
                            <i className={`bi ${sol.icon || sol.iconClass || "bi-code-slash"}`} style={{ fontSize: "26px", color: "#00dfd8" }}></i>
                          </div>
                          <Link legacyBehavior href={sol.link || "/service"}>
                            <a className="badge rounded-pill px-3 py-1 text-decoration-none" style={{ background: "rgba(0, 223, 216, 0.1)", border: "1px solid rgba(0, 223, 216, 0.3)", color: "#00dfd8", fontSize: "11px", fontWeight: "700" }}>
                              EXPLORE <i className="bi bi-box-arrow-up-right ms-1" />
                            </a>
                          </Link>
                        </div>

                        <div className="solution-content">
                          <h4 style={{ margin: "12px 0" }}>
                            <Link legacyBehavior href={sol.link || "/service"}>
                              <a className="text-white text-decoration-none hover-cyan d-inline-flex align-items-center gap-2 fw-bold" style={{ fontSize: "19px", transition: "all 0.25s ease" }}>
                                <span>{sol.title}</span>
                                <i className="bi bi-arrow-up-right text-info small" style={{ fontSize: "14px" }} />
                              </a>
                            </Link>
                          </h4>
                          <p className="text-secondary small" style={{ lineHeight: "1.65", color: "#94A3B8" }}>{sol.description}</p>
                          <ul className="solution-feature mb-4" style={{ marginTop: "16px", paddingLeft: "0", listStyle: "none" }}>
                            <li className="mb-2 text-light small d-flex align-items-center gap-2" style={{ color: "#CBD5E1" }}>
                              <i className="bi bi-check2-circle" style={{ color: "#00dfd8", fontSize: "16px" }}></i>
                              <span>{sol.feature1 || sol.category || "Enterprise Grade"}</span>
                            </li>
                            <li className="mb-2 text-light small d-flex align-items-center gap-2" style={{ color: "#CBD5E1" }}>
                              <i className="bi bi-check2-circle" style={{ color: "#00dfd8", fontSize: "16px" }}></i>
                              <span>{sol.feature2 || "High Scalability"}</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between mt-auto">
                        <Link legacyBehavior href={sol.link || "/service"}>
                          <a
                            className="btn btn-sm rounded-pill px-3 py-2 text-white fw-bold d-inline-flex align-items-center gap-2 transition-all hover-glow"
                            style={{
                              background: "linear-gradient(135deg, rgba(121, 40, 202, 0.4) 0%, rgba(0, 223, 216, 0.25) 100%)",
                              border: "1px solid rgba(0, 223, 216, 0.45)",
                              fontSize: "13px",
                              boxShadow: "0 4px 15px rgba(0, 223, 216, 0.15)",
                            }}
                          >
                            <span>Learn More</span>
                            <i className="bi bi-arrow-right text-info" />
                          </a>
                        </Link>
                        <span className="text-white-50 small" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                          DETAILS <i className="bi bi-chevron-right ms-1 text-info" />
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Solution3;
