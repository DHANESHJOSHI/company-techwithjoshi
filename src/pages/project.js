import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import React, { useState } from "react";
import MobileProjectCardSlider from "@/components/project/MobileProjectCardSlider";

function ProjectPage({ initialProjects = [] }) {
  const [projects] = useState(initialProjects);

  return (
    <Layout>
      <Breadcrumb
        pageList="Projects"
        title="Featured Engineering Case Studies"
        pageName="PORTFOLIO"
      />
      <div className="home3-success-stories-area two sec-mar">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {projects.map((project, idx) => {
              const isMobile = Boolean(
                project.isMobileApp ||
                project.slug === "ecommerce-mobile-app" ||
                project.slug === "bagisto-ecommerce-mobile-app"
              );
              const imgSrc = project.image?.startsWith("/") || project.image?.startsWith("http")
                ? project.image
                : `/${project.image || "assets/img/home-3/home3-suc-sto-01.png"}`;
              const projectLink = `/project-details?id=${project._id || project.id}&slug=${project.slug || ""}`;

              return (
                <div
                  key={project._id || project.id || idx}
                  className="col-lg-4 col-md-6 col-sm-12 wow animate fadeInUp"
                  data-wow-delay={`${150 + (idx % 3) * 100}ms`}
                  data-wow-duration="1200ms"
                >
                  <div className="success-storie-card h-100">
                    <div className="success-img">
                      {isMobile ? (
                        <MobileProjectCardSlider
                          projectLink={projectLink}
                          title={project.title}
                        />
                      ) : (
                        <>
                          {project.hasLiveDemo ? (
                            <span
                              className="badge position-absolute top-0 start-0 m-3 rounded-pill text-dark fw-bold"
                              style={{
                                background: "linear-gradient(135deg, #00DFD8, #8B5CF6)",
                                zIndex: 3,
                                fontSize: "11px",
                                letterSpacing: "0.5px",
                                boxShadow: "0 4px 15px rgba(0, 223, 216, 0.4)",
                              }}
                            >
                              <i className="bi bi-play-circle-fill me-1" /> LIVE DEMO
                            </span>
                          ) : null}
                          <Link legacyBehavior href={projectLink}>
                            <a style={{ display: "block", width: "100%", height: "100%" }}>
                              <img
                                className="img-fluid"
                                src={imgSrc}
                                alt={project.title}
                                loading="lazy"
                              />
                            </a>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="success-content">
                      <div>
                        <span className="project-cat-tag">
                          <i className="bi bi-folder-check" style={{ color: "#00DFD8" }} />
                          {project.category} {project.client ? `• ${project.client}` : ""}
                        </span>

                        <h3>
                          <Link legacyBehavior href={projectLink}>
                            <a>{project.title}</a>
                          </Link>
                        </h3>

                        {project.description && (
                          <p className="project-card-desc">
                            {project.description}
                          </p>
                        )}

                        {Array.isArray(project.deliverables) && project.deliverables.length > 0 && (
                          <div className="project-card-pills">
                            {project.deliverables.slice(0, 3).map((del, dIdx) => (
                              <span key={dIdx} className="project-pill">
                                ✦ {del}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="project-card-footer">
                        <Link legacyBehavior href={projectLink}>
                          <a className="project-view-link">
                            Explore Case Study
                            <i className="bi bi-arrow-right" />
                          </a>
                        </Link>
                        <div className="view-btn">
                          <Link legacyBehavior href={projectLink}>
                            <a aria-label={`View ${project.title}`}>
                              <svg
                                width={12}
                                height={12}
                                viewBox="0 0 13 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M0 1H12M12 1V13M12 1L0.5 12" stroke="white" strokeWidth="1.5" />
                              </svg>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
    const projects = await db.collection("projects").find({}).sort({ order: 1 }).toArray();

    return {
      props: {
        initialProjects: JSON.parse(JSON.stringify(projects)),
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps on /project:", err);
    return {
      props: {
        initialProjects: [],
      },
    };
  }
}

export default ProjectPage;
