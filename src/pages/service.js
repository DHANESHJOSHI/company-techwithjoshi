import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import React, { useState, useEffect } from "react";

function ServicePage({ initialServices = [] }) {
  const [services, setServices] = useState(initialServices);

  useEffect(() => {
    if (initialServices && initialServices.length > 0) return;
    let isMounted = true;
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch((err) => console.error("Error fetching services:", err));

    return () => {
      isMounted = false;
    };
  }, [initialServices]);

  return (
    <Layout>
      <Breadcrumb
        pageList="Services"
        title="Enterprise Engineering Services"
        pageName="SERVICES"
      />
      <div className="home3-solution-section sec-mar">
        <div className="container">
          <div className="row justify-content-center g-4">
            {services.map((service, idx) => (
              <div
                key={service._id || service.id || idx}
                className="col-lg-4 col-md-6 col-sm-10 wow animate fadeInUp"
                data-wow-delay={`${200 + (idx % 3) * 100}ms`}
                data-wow-duration="1500ms"
              >
                  <div className="solution-card magnetic-item p-4 rounded-4" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "radial-gradient(circle at 15% 15%, rgba(121, 40, 202, 0.14) 0%, #0E091B 85%)", border: "1px solid rgba(121, 40, 202, 0.28)", boxShadow: "0 14px 35px rgba(0, 0, 0, 0.45)", transition: "all 0.3s ease" }}>
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "14px", background: "rgba(121, 40, 202, 0.2)", border: "1px solid rgba(0, 223, 216, 0.35)" }}>
                          <i className={`bi ${service.icon || "bi-code-slash"}`} style={{ fontSize: "26px", color: "#00dfd8" }}></i>
                        </div>
                        <Link legacyBehavior href={`/service-details?slug=${service.slug || "web-saas-engineering"}`}>
                          <a className="badge rounded-pill px-3 py-1 text-decoration-none" style={{ background: "rgba(0, 223, 216, 0.1)", border: "1px solid rgba(0, 223, 216, 0.3)", color: "#00dfd8", fontSize: "11px", fontWeight: "700" }}>
                            CLICK TO VIEW <i className="bi bi-box-arrow-up-right ms-1" />
                          </a>
                        </Link>
                      </div>

                      <div className="solution-content">
                        <h4 style={{ margin: "12px 0" }}>
                          <Link legacyBehavior href={`/service-details?slug=${service.slug || "web-saas-engineering"}`}>
                            <a className="text-white text-decoration-none hover-cyan d-inline-flex align-items-center gap-2 fw-bold" style={{ fontSize: "20px", transition: "all 0.25s ease" }}>
                              <span>{service.title}</span>
                              <i className="bi bi-arrow-up-right text-info small" style={{ fontSize: "15px" }} />
                            </a>
                          </Link>
                        </h4>
                        <p className="text-secondary small" style={{ lineHeight: "1.65", color: "#94A3B8" }}>{service.description}</p>
                        <ul className="solution-feature mb-4" style={{ marginTop: "16px", paddingLeft: "0", listStyle: "none" }}>
                          {Array.isArray(service.features) && service.features.map((feat, fIdx) => (
                            <li key={fIdx} className="mb-2 text-light small d-flex align-items-center gap-2" style={{ color: "#CBD5E1" }}>
                              <i className="bi bi-check2-circle" style={{ color: "#00dfd8", fontSize: "16px" }}></i>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Prominent Learn More CTA Button */}
                    <div className="pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between mt-auto">
                      <Link legacyBehavior href={`/service-details?slug=${service.slug || "web-saas-engineering"}`}>
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
                        FULL SPECS <i className="bi bi-chevron-right ms-1 text-info" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const { getDatabase } = await import("@/lib/mongodb");
    const db = await getDatabase();
    const services = await db.collection("services").find({}).sort({ order: 1 }).toArray();

    return {
      props: {
        initialServices: JSON.parse(JSON.stringify(services)),
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps on /service:", err);
    return {
      props: {
        initialServices: [],
      },
    };
  }
}

export default ServicePage;
