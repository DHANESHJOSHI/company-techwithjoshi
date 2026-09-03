import BlogBanner from "@/components/blog/BlogBanner";
import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";

const CURATED_TECH_IMAGES = [
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80", // Server Racks & Datacenter
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80", // Matrix / Cyber Code
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80", // Silicon Chipset & Circuit
  "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80", // Cloud Infrastructure Mesh
  "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80", // Kubernetes & Container Nodes
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80", // Developer Coding Screen
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80", // Neural Network AI Vectors
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80", // 3D Data Pipeline Mesh
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80", // Software Architecture Terminal
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80", // Cryptography & Security Vault
  "https://images.unsplash.com/photo-1516116211227-bbc1552a466c?w=800&auto=format&fit=crop&q=80", // Fiber Optics & Network
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80", // Modern Engineering Workstation
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80", // Cyber Hardware
  "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80", // Full-Stack Clean Code
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80", // High-Performance Edge Computing
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80", // Global Cloud Mesh
  "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80", // Zero-Trust Security Nodes
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80", // Advanced Cyber Operations
];

function getDynamicTechImage(item, index) {
  if (item.image && !item.image.includes("home5-blog-img") && !item.image.includes("home3-blog") && item.image.startsWith("http")) {
    return item.image;
  }
  const str = (item.title || "") + (item.id || index);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const imgIdx = Math.abs(hash) % CURATED_TECH_IMAGES.length;
  return CURATED_TECH_IMAGES[imgIdx];
}

function BlogPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [blogs, setBlogs] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch("/api/blogs").then((r) => r.json()).catch(() => []),
      fetch("/api/news").then((r) => r.json()).catch(() => ({ allNews: [] }))
    ])
      .then(([blogData, newsData]) => {
        if (!isMounted) return;
        setBlogs(Array.isArray(blogData) ? blogData : []);
        setNews(Array.isArray(newsData.allNews) ? newsData.allNews : []);
      })
      .catch((err) => console.error("Error fetching insights:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const items = useMemo(() => {
    const formattedBlogs = blogs.map((b, idx) => ({
      id: b._id || b.id,
      title: b.title,
      category: b.category || "Architecture",
      date: b.date || "2025",
      image: getDynamicTechImage(b, idx),
      excerpt: b.excerpt || "Engineering insights and software architecture deep-dive.",
      link: `/blog-details?id=${b._id || b.id}&slug=${b.slug || ""}`,
      isExternal: false,
      badgeText: "ARTICLE",
      type: "article"
    }));

    const formattedNews = news.map((n, idx) => ({
      id: n.id || n._id,
      title: n.title,
      slug: n.slug || (n.title ? n.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : ""),
      category: n.category || "Open Source",
      date: n.date || "Recent",
      image: getDynamicTechImage(n, idx + blogs.length),
      excerpt: n.excerpt || "Live open-source and software engineering trends.",
      link: `/blog-details?id=${n.id || n._id}&slug=${n.slug || ""}`,
      isExternal: false,
      badgeText: n.isLiveApi ? "OPEN SOURCE" : "AGENCY NEWS",
      source: n.source,
      type: "news"
    }));

    if (activeTab === "articles") return formattedBlogs;
    if (activeTab === "news") return formattedNews;

    // Combined
    const combined = [];
    const maxLen = Math.max(formattedBlogs.length, formattedNews.length);
    for (let i = 0; i < maxLen; i++) {
      if (formattedBlogs[i]) combined.push(formattedBlogs[i]);
      if (formattedNews[i]) combined.push(formattedNews[i]);
    }
    return combined;
  }, [activeTab, blogs, news]);

  return (
    <Layout>
      <Breadcrumb
        pageList="Blog Grid"
        title="Open Source & Enterprise Engineering Insights"
        pageName="TECH BLOGS"
      />
      <BlogBanner />

      <div className="home3-blog-area sec-mar">
        <div className="container">
          {/* Filter Pills */}
          <div className="d-flex justify-content-center mb-50">
            <div
              className="d-inline-flex p-1 rounded-pill"
              style={{
                background: "rgba(18, 12, 36, 0.85)",
                border: "1px solid rgba(121, 40, 202, 0.35)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className="btn btn-sm px-4 py-2 rounded-pill fw-bold"
                style={{
                  background: activeTab === "all" ? "linear-gradient(135deg, #7928CA, #00DFD8)" : "transparent",
                  color: activeTab === "all" ? "#fff" : "#94A3B8",
                  border: "none",
                  fontSize: "13px"
                }}
              >
                All Publications ({blogs.length + news.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("articles")}
                className="btn btn-sm px-4 py-2 rounded-pill fw-bold"
                style={{
                  background: activeTab === "articles" ? "linear-gradient(135deg, #7928CA, #00DFD8)" : "transparent",
                  color: activeTab === "articles" ? "#fff" : "#94A3B8",
                  border: "none",
                  fontSize: "13px"
                }}
              >
                Technical Articles ({blogs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("news")}
                className="btn btn-sm px-4 py-2 rounded-pill fw-bold"
                style={{
                  background: activeTab === "news" ? "linear-gradient(135deg, #7928CA, #00DFD8)" : "transparent",
                  color: activeTab === "news" ? "#fff" : "#94A3B8",
                  border: "none",
                  fontSize: "13px"
                }}
              >
                <i className="bi bi-cpu me-1 text-info animate-pulse" /> Open Source Tech ({news.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status" />
              <p className="mt-3 text-white-50">Syncing live IT news &amp; articles...</p>
            </div>
          ) : (
            <div className="row g-lg-4 gy-5">
              {items.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="col-lg-4 col-md-6 wow animate fadeInUp"
                  data-wow-delay={`${200 + (idx % 3) * 100}ms`}
                  data-wow-duration="1500ms"
                >
                  <div
                    className="single-blog magnetic-item h-100 d-flex flex-column justify-content-between p-3 rounded-4"
                    style={{
                      background: "radial-gradient(circle at 15% 15%, rgba(121, 40, 202, 0.12) 0%, #0E091B 85%)",
                      border: "1px solid rgba(121, 40, 202, 0.28)",
                      boxShadow: "0 14px 35px rgba(0, 0, 0, 0.45)"
                    }}
                  >
                    <div>
                      <div className="blog-img rounded-3 overflow-hidden position-relative" style={{ height: "200px" }}>
                        <Link legacyBehavior href={item.link}>
                          <a className="d-block w-100 h-100">
                            <img className="img-fluid w-100 h-100" src={item.image} alt={item.title} style={{ objectFit: "cover" }} />
                          </a>
                        </Link>
                        <div className="blog-tag position-absolute top-0 start-0 m-3">
                          <span
                            className="badge px-3 py-1 rounded-pill"
                            style={{
                              background: item.type === "article" ? "linear-gradient(135deg, #7928CA, #00DFD8)" : "linear-gradient(135deg, #00DFD8, #38BDF8)",
                              color: "#fff",
                              fontSize: "11px",
                              fontWeight: "700"
                            }}
                          >
                            {item.badgeText}
                          </span>
                        </div>
                      </div>

                      <div className="blog-content pt-3">
                        <ul className="blog-meta d-flex justify-content-between align-items-center mb-2" style={{ height: "26px" }}>
                          <li className="text-white-50 small">{item.date}</li>
                          <li className="text-info small fw-bold" style={{ maxWidth: "140px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.category}
                          </li>
                        </ul>

                        <h4
                          style={{
                            fontSize: "17.5px",
                            fontWeight: "700",
                            lineHeight: "1.38",
                            margin: "8px 0 10px",
                            height: "72px",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Link legacyBehavior href={item.link}>
                            <a className="text-white text-decoration-none hover-cyan">{item.title}</a>
                          </Link>
                        </h4>

                        <p
                          className="text-secondary small"
                          style={{
                            lineHeight: "1.55",
                            height: "46px",
                            margin: "0 0 16px",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            textOverflow: "ellipsis",
                            color: "#94A3B8",
                          }}
                        >
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="blog-footer pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between" style={{ height: "38px" }}>
                      <div className="read-btn">
                        <Link legacyBehavior href={item.link}>
                          <a className="text-info small fw-bold text-decoration-none d-flex align-items-center gap-1 hover-cyan">
                            <span>Read Article</span> <i className="bi bi-arrow-right" />
                          </a>
                        </Link>
                      </div>
                      <div className="social-area">
                        <ul>
                          <li>
                            <a href={settings.linkedin || "https://www.linkedin.com/in/dhanesh-joshi/"} target="_blank" rel="noopener noreferrer">
                              <i className="bx bxl-linkedin" />
                            </a>
                          </li>
                          <li>
                            <a href={settings.instagram || "https://www.instagram.com/its_dhanesh_joshi_/"} target="_blank" rel="noopener noreferrer">
                              <i className="bx bxl-instagram" />
                            </a>
                          </li>
                        </ul>
                      </div>
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

export default BlogPage;
