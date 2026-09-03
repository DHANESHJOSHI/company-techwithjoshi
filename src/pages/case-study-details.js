import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";

export default function CaseStudyDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetSlug = slug || "building-scalable-cloud-infrastructure";
    fetch(`/api/case-studies?slug=${targetSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setCaseStudy(data))
      .catch(() => {
        // Fallback fetch first available case study
        fetch("/api/case-studies")
          .then((res) => res.json())
          .then((list) => {
            if (Array.isArray(list) && list.length > 0) setCaseStudy(list[0]);
          });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const item = caseStudy;

  return (
    <Layout>
      <Breadcrumb
        pageList="Case Study Details"
        title={item ? item.title : "Success Story Details"}
        pageName="CASE STUDY DETAILS"
      />

      <div className="sec-mar" style={{ background: "#080411", color: "#FFFFFF" }}>
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status" />
            </div>
          ) : item ? (
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {/* Header Metadata */}
                <div className="text-center mb-40">
                  <span className="badge px-3 py-2 rounded-pill text-info border border-info border-opacity-50 mb-3" style={{ background: "rgba(0,223,216,0.1)", fontSize: "13px" }}>
                    {item.category || "CASE STUDY"}
                  </span>
                  <h1 className="fw-bold text-white mb-3" style={{ fontSize: "clamp(28px, 4.5vw, 46px)", lineHeight: "1.25" }}>
                    {item.title}
                  </h1>
                  <div className="d-flex flex-wrap justify-content-center gap-4 text-white-50 small mt-3">
                    <span><i className="bi bi-building text-info me-1" /> <strong>Client:</strong> {item.client}</span>
                    <span><i className="bi bi-calendar-check text-info me-1" /> <strong>Completed:</strong> Production Scale</span>
                  </div>
                </div>

                {/* Hero Graphic / Video */}
                {item.videoUrl ? (
                  <div className="ratio ratio-16x9 mb-50 rounded-4 overflow-hidden" style={{ border: "1px solid rgba(121,40,202,0.35)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
                    <iframe
                      src={item.videoUrl.includes("watch?v=") ? item.videoUrl.replace("watch?v=", "embed/") : item.videoUrl}
                      title={item.title}
                      allowFullScreen
                    />
                  </div>
                ) : item.image ? (
                  <div className="mb-50 rounded-4 overflow-hidden" style={{ border: "1px solid rgba(121,40,202,0.35)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid w-100"
                      style={{ maxHeight: "520px", objectFit: "cover" }}
                    />
                  </div>
                ) : null}

                {/* Metrics Highlight Banner */}
                {Array.isArray(item.metrics) && item.metrics.length > 0 && (
                  <div className="row g-3 mb-50">
                    {item.metrics.map((m, idx) => (
                      <div key={idx} className="col-md-4">
                        <div
                          className="p-4 rounded-4 text-center h-100"
                          style={{
                            background: "radial-gradient(circle at 50% 50%, rgba(121,40,202,0.18) 0%, #0E091B 85%)",
                            border: "1px solid rgba(0,223,216,0.3)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
                          }}
                        >
                          <div className="display-6 fw-bold mb-1" style={{ background: "linear-gradient(135deg, #00DFD8, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {m.value}
                          </div>
                          <div className="text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>
                            {m.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Challenge & Solution Grid */}
                {(item.challenge || item.solution) && (
                  <div className="row g-4 mb-50">
                    {item.challenge && (
                      <div className="col-md-6">
                        <div className="p-4 rounded-4 h-100" style={{ background: "rgba(220, 53, 69, 0.05)", border: "1px solid rgba(220, 53, 69, 0.25)" }}>
                          <h4 className="text-danger fw-bold mb-3 d-flex align-items-center gap-2">
                            <i className="bi bi-shield-x" /> The Challenge
                          </h4>
                          <p style={{ color: "#CBD5E1", lineHeight: "1.8", fontSize: "15px" }}>{item.challenge}</p>
                        </div>
                      </div>
                    )}
                    {item.solution && (
                      <div className="col-md-6">
                        <div className="p-4 rounded-4 h-100" style={{ background: "rgba(0, 223, 216, 0.05)", border: "1px solid rgba(0, 223, 216, 0.25)" }}>
                          <h4 className="text-info fw-bold mb-3 d-flex align-items-center gap-2">
                            <i className="bi bi-lightbulb-fill" /> Our Solution
                          </h4>
                          <p style={{ color: "#CBD5E1", lineHeight: "1.8", fontSize: "15px" }}>{item.solution}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Rich Text Body Content */}
                {item.content && (
                  <div
                    className="case-study-rich-content p-4 p-md-5 rounded-4 mb-50"
                    style={{
                      background: "radial-gradient(circle at 15% 15%, rgba(121,40,202,0.12) 0%, #0E091B 85%)",
                      border: "1px solid rgba(121,40,202,0.25)",
                      lineHeight: "1.9",
                      fontSize: "16px",
                      color: "#CBD5E1"
                    }}
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                )}

                {/* Tech Stack Tags */}
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-50 p-3 rounded-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-white fw-bold me-2 small">Technology Stack:</span>
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="badge px-3 py-2 rounded-pill bg-dark text-info border border-secondary" style={{ fontSize: "13px" }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA Card */}
                <div className="p-5 rounded-4 text-center" style={{ background: "radial-gradient(circle at 50% 50%, rgba(121,40,202,0.25) 0%, #080411 90%)", border: "1px solid rgba(0,223,216,0.35)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
                  <h2 className="text-white fw-bold mb-2">Want to Achieve Similar Results?</h2>
                  <p className="text-white-50 mb-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
                    Let&apos;s evaluate your current architecture and craft an actionable roadmap tailored for your scale.
                  </p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Link legacyBehavior href="/contact">
                      <a className="btn btn-info px-4 py-3 fw-bold rounded-pill text-dark" style={{ background: "linear-gradient(135deg, #00DFD8, #8B5CF6)", border: "none" }}>
                        Schedule Architecture Review
                      </a>
                    </Link>
                    <Link legacyBehavior href="/case-study">
                      <a className="btn btn-outline-light px-4 py-3 fw-bold rounded-pill">
                        &larr; Back to Case Studies
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <h3 className="text-white">Case study not found</h3>
              <Link legacyBehavior href="/case-study">
                <a className="btn btn-info rounded-pill mt-3">View All Case Studies</a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
