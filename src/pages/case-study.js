import React, { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";

export default function CaseStudyPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/case-studies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCaseStudies(data);
      })
      .catch((err) => console.error("Error loading case studies:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...new Set(caseStudies.map((c) => c.category).filter(Boolean))];
  const filteredItems = filter === "all" ? caseStudies : caseStudies.filter((c) => c.category === filter);

  return (
    <Layout>
      <Breadcrumb
        pageList="CASE STUDY"
        title="Enterprise Case Studies & Success Stories"
        pageName="Case Studies"
      />

      <div className="sec-mar" style={{ background: "#080411", color: "#FFFFFF" }}>
        <div className="container">
          {/* Category Filter Pills */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-50">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="btn btn-sm px-4 py-2 rounded-pill text-uppercase fw-bold transition-all"
                style={{
                  background: filter === cat ? "linear-gradient(135deg, #7928CA, #00DFD8)" : "rgba(255,255,255,0.05)",
                  color: filter === cat ? "#FFFFFF" : "#94A3B8",
                  border: filter === cat ? "none" : "1px solid rgba(255,255,255,0.1)",
                  fontSize: "13px",
                  letterSpacing: "1px"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status" />
              <p className="mt-3 text-white-50">Loading verified case studies...</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredItems.map((item, idx) => (
                <div key={item._id || item.slug || idx} className="col-lg-6">
                  <div
                    className="case-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between transition-all"
                    style={{
                      background: "radial-gradient(circle at 15% 15%, rgba(121, 40, 202, 0.14) 0%, #0E091B 85%)",
                      border: "1px solid rgba(121, 40, 202, 0.25)",
                      boxShadow: "0 14px 40px rgba(0,0,0,0.45)"
                    }}
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="rounded-3 overflow-hidden mb-4 position-relative" style={{ maxHeight: "280px" }}>
                        <img
                          src={item.image || "/assets/img/home-5/home5-case-01.png?v=5"}
                          alt={item.title}
                          className="img-fluid w-100"
                          style={{ height: "260px", objectFit: "cover" }}
                        />
                        <span className="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill bg-dark bg-opacity-75 text-info border border-info border-opacity-50">
                          {item.category}
                        </span>
                      </div>

                      {/* Header Info */}
                      <div className="mb-2 text-white-50 small d-flex align-items-center gap-2">
                        <i className="bi bi-building text-info" />
                        <span>Client: {item.client || "Enterprise"}</span>
                      </div>

                      <h3 className="h4 fw-bold text-white mb-3">
                        <Link legacyBehavior href={`/case-study-details?slug=${item.slug}`}>
                          <a className="text-white text-decoration-none hover-cyan">
                            {item.title}
                          </a>
                        </Link>
                      </h3>

                      <p className="text-secondary small mb-3" style={{ lineHeight: "1.7" }}>
                        {item.challenge ? item.challenge.substring(0, 160) + "..." : item.solution ? item.solution.substring(0, 160) + "..." : "High-impact enterprise digital transformation."}
                      </p>

                      {/* Metrics Badges */}
                      {Array.isArray(item.metrics) && item.metrics.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {item.metrics.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="px-3 py-2 rounded-3"
                              style={{ background: "rgba(0, 223, 216, 0.08)", border: "1px solid rgba(0, 223, 216, 0.25)" }}
                            >
                              <div className="fw-bold text-info small">{m.value}</div>
                              <div className="text-white-50" style={{ fontSize: "11px" }}>{m.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer CTA */}
                    <div className="pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                      <div className="d-flex flex-wrap gap-1">
                        {Array.isArray(item.tags) && item.tags.slice(0, 3).map((t, tIdx) => (
                          <span key={tIdx} className="badge bg-secondary bg-opacity-25 text-white-50 small" style={{ fontSize: "11px" }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                      <Link legacyBehavior href={`/case-study-details?slug=${item.slug}`}>
                        <a className="btn btn-sm btn-outline-info rounded-pill px-3 py-1 fw-bold">
                          Read Case Study &rarr;
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
