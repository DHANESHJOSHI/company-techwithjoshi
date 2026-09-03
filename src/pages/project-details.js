import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";
import MobileAppGsapShowcase from "@/components/project/MobileAppGsapShowcase";

export default function ProjectDetailsPage({ initialProject = null }) {
  const router = useRouter();
  const { id, slug } = router.query;
  const [project, setProject] = useState(initialProject);
  const [loading, setLoading] = useState(!initialProject);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [deviceMode, setDeviceMode] = useState("desktop"); // desktop, tablet, mobile
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const iframeContainerRef = useRef(null);

  useEffect(() => {
    if (initialProject && (!slug || initialProject.slug === slug)) {
      return;
    }
    if (!router.isReady && !id && !slug) return;

    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          let found = null;
          if (slug) {
            found = data.find((p) => p.slug === slug);
          } else if (id) {
            found = data.find((p) => String(p._id || p.id) === String(id));
          }
          setProject(found || initialProject || data[0]);
        }
      })
      .catch((err) => console.error("Error loading project details:", err))
      .finally(() => setLoading(false));
  }, [id, slug, router.isReady, initialProject]);

  // Anti-Inspect / Shortcut Protection for demo pages
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C", "i", "j", "c"].includes(e.key)) ||
        (e.ctrlKey && ["u", "U", "s", "S"].includes(e.key)) ||
        (e.metaKey && e.altKey && ["i", "I", "j", "J", "c", "C", "u", "U"].includes(e.key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const p = project;
  const isMobileAppProject = Boolean(
    p && (
      p.isMobileApp ||
      p.slug === "ecommerce-mobile-app" ||
      p.slug === "bagisto-ecommerce-mobile-app" ||
      (p.category && p.category.toLowerCase().includes("mobile"))
    )
  );
  const isInteractiveProject =
    !isMobileAppProject &&
    Boolean(p && (p.hasLiveDemo || p.slug === "enterprise-headless-ecommerce" || p.previewUrl));

  const reloadIframe = () => {
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const getContainerWidth = () => {
    if (deviceMode === "mobile") return "390px";
    if (deviceMode === "tablet") return "768px";
    return "100%";
  };

  return (
    <Layout>
      <Breadcrumb
        pageList="Project Details"
        title={p ? p.title : "Portfolio Project Details"}
        pageName="PROJECT DETAILS"
      />

      <div
        className="portfolio-details sec-mar"
        style={{ background: "#080411", color: "#FFFFFF", position: "relative" }}
      >
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status" />
            </div>
          ) : p ? (
            <>
              {isMobileAppProject && (
                <div id="mobile-showcase-section" className="mb-5">
                  <MobileAppGsapShowcase project={p} />
                </div>
              )}
              <div className="row g-lg-5 gy-5">
              {/* Main Content */}
              <div className="col-lg-8">
                {/* Interactive Live Demo Sandbox */}
                {isInteractiveProject ? (
                  <div
                    id="interactive-demo"
                    ref={iframeContainerRef}
                    className={`mb-40 rounded-4 overflow-hidden ${
                      isFullscreen ? "fullscreen-demo-overlay" : ""
                    }`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    style={
                      isFullscreen
                        ? {
                            position: "fixed",
                            inset: 0,
                            zIndex: 999999,
                            background: "#080411",
                            borderRadius: 0,
                            display: "flex",
                            flexDirection: "column",
                          }
                        : {
                            border: "1px solid rgba(0, 223, 216, 0.35)",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
                            background: "#0b0618",
                          }
                    }
                  >
                    {/* Mock Browser Header Bar */}
                    <div
                      className="d-flex flex-wrap align-items-center justify-content-between px-3 py-2 border-bottom"
                      style={{
                        background: "linear-gradient(90deg, #110A24 0%, #1A1035 100%)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        minHeight: "48px",
                      }}
                    >
                      {/* Left: Window Dots & Protected Badge */}
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <span
                            style={{
                              width: "11px",
                              height: "11px",
                              borderRadius: "50%",
                              background: "#FF5F56",
                              display: "inline-block",
                            }}
                          />
                          <span
                            style={{
                              width: "11px",
                              height: "11px",
                              borderRadius: "50%",
                              background: "#FFBD2E",
                              display: "inline-block",
                            }}
                          />
                          <span
                            style={{
                              width: "11px",
                              height: "11px",
                              borderRadius: "50%",
                              background: "#27C93F",
                              display: "inline-block",
                            }}
                          />
                        </div>
                        <span
                          className="badge rounded-pill text-info d-none d-sm-inline-flex align-items-center gap-1"
                          style={{
                            background: "rgba(0, 223, 216, 0.12)",
                            border: "1px solid rgba(0, 223, 216, 0.25)",
                            fontSize: "11px",
                            padding: "4px 10px",
                          }}
                        >
                          <i className="bi bi-shield-lock-fill" /> Protected Live Sandbox
                        </span>
                      </div>

                      {/* Middle: Mock Safe Address Bar */}
                      <div
                        className="d-none d-md-flex align-items-center justify-content-center px-3 py-1 rounded-pill"
                        style={{
                          background: "rgba(0, 0, 0, 0.4)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          fontSize: "12px",
                          color: "#94A3B8",
                          maxWidth: "340px",
                          width: "100%",
                        }}
                      >
                        <i className="bi bi-lock-fill text-success me-2" style={{ fontSize: "11px" }} />
                        <span className="text-truncate">
                          {p.previewUrl
                            ? `https://techwithjoshi.in/preview/${p.slug || "interactive-demo"}`
                            : "https://techwithjoshi.in/preview/headless-commerce"}
                        </span>
                      </div>

                      {/* Right: Device Switcher & Controls */}
                      <div className="d-flex align-items-center gap-2">
                        {/* Device Modes */}
                        <div
                          className="btn-group btn-group-sm p-1 rounded-pill"
                          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          <button
                            type="button"
                            className={`btn btn-sm py-0 px-2 rounded-pill ${
                              deviceMode === "desktop" ? "btn-info text-dark fw-bold" : "text-white-50"
                            }`}
                            onClick={() => setDeviceMode("desktop")}
                            title="Desktop View"
                          >
                            <i className="bi bi-display" />
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm py-0 px-2 rounded-pill ${
                              deviceMode === "tablet" ? "btn-info text-dark fw-bold" : "text-white-50"
                            }`}
                            onClick={() => setDeviceMode("tablet")}
                            title="Tablet View"
                          >
                            <i className="bi bi-tablet" />
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm py-0 px-2 rounded-pill ${
                              deviceMode === "mobile" ? "btn-info text-dark fw-bold" : "text-white-50"
                            }`}
                            onClick={() => setDeviceMode("mobile")}
                            title="Mobile View"
                          >
                            <i className="bi bi-phone" />
                          </button>
                        </div>

                        {/* Reload Button */}
                        <button
                          type="button"
                          className="btn btn-sm text-white-50 hover-text-white p-1"
                          onClick={reloadIframe}
                          title="Reload Demo"
                        >
                          <i className="bi bi-arrow-clockwise fs-6" />
                        </button>

                        {/* Fullscreen Button */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-info rounded-pill py-0 px-2 d-flex align-items-center gap-1"
                          style={{ fontSize: "12px", height: "26px" }}
                          onClick={() => setIsFullscreen(!isFullscreen)}
                        >
                          <i className={`bi ${isFullscreen ? "bi-fullscreen-exit" : "bi-arrows-fullscreen"}`} />
                          <span className="d-none d-sm-inline">
                            {isFullscreen ? "Exit" : "Fullscreen"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Iframe Viewport Container */}
                    <div
                      className="d-flex align-items-center justify-content-center position-relative"
                      style={{
                        background: "#080411",
                        flex: 1,
                        minHeight: isFullscreen ? "calc(100vh - 85px)" : "720px",
                        overflow: "hidden",
                      }}
                    >
                      {/* Loading State Spinner */}
                      {iframeLoading && (
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                          style={{
                            background: "rgba(8, 4, 17, 0.95)",
                            zIndex: 10,
                          }}
                        >
                          <div className="spinner-border text-info mb-3" role="status" />
                          <p className="text-white small fw-bold mb-1">
                            Initializing Protected {p.title || "Interactive Sandbox"}...
                          </p>
                          <p className="text-white-50 small mb-0">
                            Loading production components, responsive sandbox &amp; live runtime
                          </p>
                        </div>
                      )}

                      {/* The Protected Iframe */}
                      <div
                        style={{
                          width: getContainerWidth(),
                          height: isFullscreen ? "calc(100vh - 85px)" : "720px",
                          transition: "width 0.3s ease",
                          boxShadow:
                            deviceMode !== "desktop"
                              ? "0 10px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)"
                              : "none",
                          borderRadius: deviceMode !== "desktop" ? "12px" : "0",
                          overflow: "hidden",
                          background: "#FFFFFF",
                        }}
                      >
                        <iframe
                          key={iframeKey}
                          src={
                            p?.slug && p.slug !== "enterprise-headless-ecommerce"
                              ? `/api/proxy-embed?slug=${p.slug}`
                              : p?.previewUrl?.startsWith("http")
                              ? `/api/proxy-embed?url=${encodeURIComponent(p.previewUrl)}`
                              : p?.previewUrl || "/api/project-preview"
                          }
                          title={p?.title || "Interactive Project Demo"}
                          className="w-100 h-100 border-0"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                          onLoad={() => setIframeLoading(false)}
                          style={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
                    </div>

                    {/* Security Footer Notice Bar */}
                    <div
                      className="px-3 py-2 border-top d-flex align-items-center justify-content-between text-white-50 small"
                      style={{
                        background: "#0c071b",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        fontSize: "12px",
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-lock-fill text-info" />
                        <span>
                          <strong>Sandboxed Interactive Session:</strong> External link extraction, inspect element, and source view are restricted. All features are directly usable in this frame.
                        </span>
                      </div>
                      <span className="badge text-dark fw-bold d-none d-md-inline-block" style={{ background: "#00DFD8" }}>
                        LIVE DEMO
                      </span>
                    </div>
                  </div>
                ) : (
                  !isMobileAppProject && p.image && (
                    <div
                      className="mb-40 rounded-4 overflow-hidden"
                      style={{
                        border: "1px solid rgba(121,40,202,0.35)",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                      }}
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="img-fluid w-100"
                        style={{ maxHeight: "480px", objectFit: "cover" }}
                      />
                    </div>
                  )
                )}

                {/* Project Header Info */}
                <div className="mb-4">
                  <span
                    className="badge px-3 py-2 rounded-pill text-info border border-info border-opacity-50 mb-3"
                    style={{ background: "rgba(0,223,216,0.1)", fontSize: "13px" }}
                  >
                    {p.category || "ENGINEERING PROJECT"}
                  </span>
                  <h1
                    className="fw-bold text-white mb-3"
                    style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
                  >
                    {p.title}
                  </h1>
                  <p
                    className="lead"
                    style={{ color: "#94A3B8", fontSize: "17px", lineHeight: "1.8" }}
                  >
                    {p.description}
                  </p>
                </div>

                {/* Deliverables Card */}
                {p.deliverables && (
                  <div
                    className="p-4 rounded-4 mb-40"
                    style={{
                      background:
                        "radial-gradient(circle at 15% 15%, rgba(121, 40, 202, 0.14) 0%, #0E091B 85%)",
                      border: "1px solid rgba(121,40,202,0.25)",
                    }}
                  >
                    <h4 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                      <i className="bi bi-box-seam-fill text-info" /> Key Deliverables &amp; Technical Scope
                    </h4>
                    {Array.isArray(p.deliverables) ? (
                      <div className="row g-2">
                        {p.deliverables.map((item, idx) => (
                          <div key={idx} className="col-md-6">
                            <div
                              className="p-2 px-3 rounded-3 d-flex align-items-center gap-2"
                              style={{
                                background: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.06)",
                                color: "#CBD5E1",
                                fontSize: "14px",
                              }}
                            >
                              <i className="bi bi-check-circle-fill text-info" />
                              <span>{item}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: "#CBD5E1", fontSize: "15px", lineHeight: "1.8", margin: 0 }}>
                        {p.deliverables}
                      </p>
                    )}
                  </div>
                )}

                {/* Rich Content if available */}
                {p.content && (
                  <div
                    className="project-rich-content mb-50"
                    style={{ color: "#CBD5E1", fontSize: "16px", lineHeight: "1.9" }}
                    dangerouslySetInnerHTML={{ __html: p.content }}
                  />
                )}

                {/* Native Screen Captures Gallery for Mobile App */}
                {isMobileAppProject && (
                  <div
                    className="p-4 rounded-4 mb-40"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(0, 223, 216, 0.2)",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                      <h4 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
                        <i className="bi bi-phone-vibrate text-info" /> Native UI Screen Captures &amp; Workflows
                      </h4>
                      <span className="badge rounded-pill text-info" style={{ background: "rgba(0, 223, 216, 0.12)", border: "1px solid rgba(0, 223, 216, 0.25)" }}>
                        6 High-Resolution Screens
                      </span>
                    </div>
                    <p className="text-white-50 small mb-4">
                      Click any mobile screen below to scroll up and load into the interactive 3D GSAP motion showcase.
                    </p>
                    <div className="row g-3">
                      {[
                        { title: "Interactive Home & Search", img: "/assets/img/mobile-app/mobile-home-search.png", tag: "Storefront" },
                        { title: "Native Dark Mode & FCM", img: "/assets/img/mobile-app/mobile-dark-mode.png", tag: "Push & Theme" },
                        { title: "Product Catalog & Filters", img: "/assets/img/mobile-app/mobile-products.png", tag: "Faceted Search" },
                        { title: "Wishlist & Cloud Sync", img: "/assets/img/mobile-app/mobile-wishlist.png", tag: "Cloud Sync" },
                        { title: "One-Step Mobile Checkout", img: "/assets/img/mobile-app/mobile-checkout.png", tag: "Biometrics & Pay" },
                        { title: "Live Order Tracking Telemetry", img: "/assets/img/mobile-app/mobile-orders.png", tag: "Live Courier" },
                      ].map((item, sIdx) => (
                        <div key={sIdx} className="col-md-4 col-sm-6">
                          <div
                            className="rounded-3 overflow-hidden position-relative h-100 d-flex flex-column"
                            style={{
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              background: "#0c061a",
                              cursor: "pointer",
                              transition: "all 0.25s ease",
                            }}
                            onClick={() => {
                              const el = document.getElementById("mobile-showcase-section");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#00DFD8";
                              e.currentTarget.style.transform = "translateY(-4px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            <div className="position-relative overflow-hidden" style={{ height: "160px", background: "#05020c" }}>
                              <img
                                src={item.img}
                                alt={item.title}
                                className="img-fluid w-100 h-100"
                                style={{ objectFit: "cover" }}
                              />
                              <span
                                className="badge position-absolute top-0 end-0 m-2 rounded-pill"
                                style={{ background: "rgba(0, 0, 0, 0.75)", color: "#00DFD8", fontSize: "10px", border: "1px solid rgba(0, 223, 216, 0.3)" }}
                              >
                                {item.tag}
                              </span>
                            </div>
                            <div className="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                              <span className="text-white small fw-bold d-block mb-1">{item.title}</span>
                              <span className="text-info small" style={{ fontSize: "11px" }}>
                                Inspect Screen &rarr;
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="col-lg-4">
                <div className="sidebar-sticky" style={{ position: "sticky", top: "100px" }}>
                  <div
                    className="p-4 rounded-4 mb-4"
                    style={{
                      background:
                        "radial-gradient(circle at 20% 20%, rgba(121, 40, 202, 0.12) 0%, #0E091B 85%)",
                      border: "1px solid rgba(121,40,202,0.25)",
                    }}
                  >
                    <h5 className="text-white fw-bold mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                      Project Information
                    </h5>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                      <li className="d-flex justify-content-between text-white-50 small">
                        <span>Client:</span>
                        <strong className="text-white">{p.client || "Enterprise Partner"}</strong>
                      </li>
                      <li className="d-flex justify-content-between text-white-50 small">
                        <span>Category:</span>
                        <strong className="text-info">{p.category || "Full-Stack"}</strong>
                      </li>
                      {isMobileAppProject ? (
                        <li className="pt-2 border-top border-secondary border-opacity-25 d-flex flex-column gap-2">
                          <a
                            href={p.githubUrl || "https://github.com/DHANESHJOSHI/company-techwithjoshi"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-info w-100 rounded-pill py-2 fw-bold text-dark d-flex align-items-center justify-content-center gap-2"
                            style={{
                              background: "linear-gradient(135deg, #00DFD8, #8B5CF6)",
                              border: "none",
                              boxShadow: "0 4px 20px rgba(0, 223, 216, 0.3)",
                            }}
                          >
                            <i className="bi bi-github" /> Open GitHub Repository
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById("mobile-showcase-section");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="btn btn-outline-light w-100 rounded-pill py-2 small d-flex align-items-center justify-content-center gap-2"
                            style={{ fontSize: "12px", borderColor: "rgba(255,255,255,0.2)" }}
                          >
                            <i className="bi bi-phone" /> Interactive Screen Tour
                          </button>
                        </li>
                      ) : isInteractiveProject ? (
                        <li className="pt-2 border-top border-secondary border-opacity-25">
                          <button
                            type="button"
                            onClick={() => {
                              setIsFullscreen(true);
                            }}
                            className="btn btn-info w-100 rounded-pill py-2 fw-bold text-dark d-flex align-items-center justify-content-center gap-2"
                            style={{
                              background: "linear-gradient(135deg, #00DFD8, #8B5CF6)",
                              border: "none",
                              boxShadow: "0 4px 20px rgba(0, 223, 216, 0.3)",
                            }}
                          >
                            <i className="bi bi-arrows-fullscreen" /> Launch Fullscreen Demo
                          </button>
                        </li>
                      ) : (
                        p.link && (
                          <li className="pt-2 border-top border-secondary border-opacity-25">
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-info w-100 rounded-pill py-2 fw-bold text-dark"
                              style={{
                                background: "linear-gradient(135deg, #00DFD8, #8B5CF6)",
                                border: "none",
                              }}
                            >
                              <i className="bi bi-box-arrow-up-right me-2" /> View Live Project
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div
                    className="p-4 rounded-4 text-center"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(121, 40, 202, 0.22) 0%, #080411 90%)",
                      border: "1px solid rgba(0,223,216,0.3)",
                    }}
                  >
                    <h5 className="text-white fw-bold mb-2">Build Your Next Digital Platform</h5>
                    <p className="text-white-50 small mb-3">
                      Partner with TechWithJoshi for enterprise e-commerce, cloud architectures, and bespoke software.
                    </p>
                    <Link legacyBehavior href="/contact">
                      <a className="btn btn-outline-info rounded-pill w-100 py-2">
                        Schedule Consultation &rarr;
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            </>
          ) : (
            <div className="text-center py-5">
              <h3 className="text-white">Project not found</h3>
              <Link legacyBehavior href="/project">
                <a className="btn btn-info rounded-pill mt-3">Back to Projects</a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id, slug } = context.query;
  try {
    const { getDatabase } = await import("@/lib/mongodb");
    const { ObjectId } = await import("mongodb");
    const db = await getDatabase();
    let query = {};
    if (slug === "bagisto-ecommerce-mobile-app" || slug === "ecommerce-mobile-app") {
      query = { $or: [{ slug: "ecommerce-mobile-app" }, { slug: "bagisto-ecommerce-mobile-app" }, { isMobileApp: true }] };
    } else if (slug) {
      query = { slug };
    } else if (id && ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else if (id) {
      query = { id };
    }

    let project = await db.collection("projects").findOne(query);
    if (!project) {
      project = await db.collection("projects").findOne({});
    }

    return {
      props: {
        initialProject: project ? JSON.parse(JSON.stringify(project)) : null,
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps on /project-details:", err);
    return {
      props: {
        initialProject: null,
      },
    };
  }
}

