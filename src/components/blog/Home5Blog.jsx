import React, { useState, useEffect, useMemo } from "react";
import SwiperCore, { Autoplay, EffectFade, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

SwiperCore.use([Pagination, Autoplay, EffectFade, Navigation]);

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

export default function Home5Blog() {
  const [filter, setFilter] = useState("all");
  const [articles, setArticles] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch("/api/blogs").then((r) => r.json()).catch(() => []),
      fetch("/api/news").then((r) => r.json()).catch(() => ({ allNews: [] }))
    ])
      .then(([blogData, newsData]) => {
        if (!isMounted) return;

        const blogList = Array.isArray(blogData) ? blogData : [];
        const formattedArticles = blogList.map((b, idx) => ({
          id: b._id || b.id || `art-${idx}`,
          title: b.title,
          category: b.category || "Engineering",
          date: b.date || "Recent",
          image: getDynamicTechImage(b, idx),
          excerpt: b.excerpt || "Technical deep-dive into cloud architectures, LLM systems, and resilient engineering.",
          link: `/blog-details?id=${b._id || b.id}&slug=${b.slug || ""}`,
          isExternal: false,
          badgeText: "ARTICLE",
          badgeColor: "#00DFD8",
          badgeBg: "rgba(0, 223, 216, 0.12)",
          badgeBorder: "rgba(0, 223, 216, 0.35)",
          type: "article"
        }));

        const newsList = Array.isArray(newsData.allNews) ? newsData.allNews : [];
        const formattedNews = newsList.map((n, idx) => ({
          id: n.id || n._id || `news-${idx}`,
          title: n.title,
          slug: n.slug || (n.title ? n.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : ""),
          category: n.category || "Open Source",
          date: n.date || "Recent",
          image: getDynamicTechImage(n, idx + blogList.length),
          excerpt: n.excerpt || "Latest breaking software development, AI breakthroughs, and enterprise IT trends.",
          link: `/blog-details?id=${n.id || n._id}&slug=${n.slug || ""}`,
          isExternal: false,
          badgeText: n.isLiveApi ? "OPEN SOURCE" : "AGENCY NEWS",
          badgeColor: "#00DFD8",
          badgeBg: "rgba(0, 223, 216, 0.12)",
          badgeBorder: "rgba(0, 223, 216, 0.35)",
          source: n.source,
          type: "news"
        }));

        setArticles(formattedArticles);
        setNews(formattedNews);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const displayedItems = useMemo(() => {
    if (filter === "articles") return articles;
    if (filter === "news") return news;

    // Interleave articles and news
    const combined = [];
    const maxLen = Math.max(articles.length, news.length);
    for (let i = 0; i < maxLen; i++) {
      if (articles[i]) combined.push(articles[i]);
      if (news[i]) combined.push(news[i]);
    }
    return combined;
  }, [filter, articles, news]);

  const slider = useMemo(() => {
    return {
      loop: displayedItems.length > 3,
      slidesPerView: "auto",
      spaceBetween: 30,
      speed: 1200,
      navigation: {
        nextEl: ".nextbtn4",
        prevEl: ".prevbtn4",
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      breakpoints: {
        280: { slidesPerView: 1 },
        576: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
    };
  }, [displayedItems.length]);

  return (
    <div className="home5-blog-area mb-130">
      <div className="container">
        {/* Header with Title, Category Switcher & Arrows */}
        <div className="row mb-45 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-12 d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="section-title-5">
              <span>IT News &amp; Trends</span>
              <h2>News &amp; Article</h2>
            </div>

            {/* Filter Toggle Pills */}
            <div className="d-flex align-items-center gap-2 p-1 rounded-pill" style={{ background: "rgba(18, 12, 36, 0.8)", border: "1px solid rgba(121, 40, 202, 0.3)" }}>
              <button
                onClick={() => setFilter("all")}
                className="btn btn-sm px-3 py-1 rounded-pill fw-bold transition-all"
                style={{
                  background: filter === "all" ? "linear-gradient(135deg, #7928CA, #00DFD8)" : "transparent",
                  color: filter === "all" ? "#FFFFFF" : "#94A3B8",
                  border: "none",
                  fontSize: "12px",
                }}
              >
                All Insights
              </button>
              <button
                onClick={() => setFilter("articles")}
                className="btn btn-sm px-3 py-1 rounded-pill fw-bold transition-all"
                style={{
                  background: filter === "articles" ? "linear-gradient(135deg, #7928CA, #00DFD8)" : "transparent",
                  color: filter === "articles" ? "#FFFFFF" : "#94A3B8",
                  border: "none",
                  fontSize: "12px",
                }}
              >
                Tech Articles ({articles.length})
              </button>
              <button
                onClick={() => setFilter("news")}
                className="btn btn-sm px-3 py-1 rounded-pill fw-bold transition-all"
                style={{
                  background: filter === "news" ? "linear-gradient(135deg, #7928CA, #00DFD8)" : "transparent",
                  color: filter === "news" ? "#FFFFFF" : "#94A3B8",
                  border: "none",
                  fontSize: "12px",
                }}
              >
                <i className="bi bi-cpu me-1 text-info animate-pulse" /> Open Source Tech ({news.length})
              </button>
            </div>

            {/* Swiper Controls */}
            <div className="swiper-btn-group">
              <div className="swiper-btn prevbtn4" role="button" tabIndex={0} aria-label="Previous Slide">
                <i className="bi bi-arrow-left" />
              </div>
              <div className="swiper-btn nextbtn4" role="button" tabIndex={0} aria-label="Next Slide">
                <i className="bi bi-arrow-right" />
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slider */}
        <div className="row">
          <div className="col-lg-12">
            <div className="blog-wrapper">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-info" role="status" />
                  <p className="mt-3 text-white-50">Syncing live IT news &amp; articles...</p>
                </div>
              ) : displayedItems.length === 0 ? (
                <div className="text-center py-5 text-white-50">No updates found in this category.</div>
              ) : (
                <Swiper {...slider} className="swiper home5-blog-slider">
                  {displayedItems.map((item, idx) => (
                    <SwiperSlide key={`${item.id}-${idx}`} className="swiper-slide h-auto d-flex">
                      <div
                        className="single-blog-card w-100 d-flex flex-column justify-content-between p-4 rounded-4"
                        style={{
                          background: "radial-gradient(circle at 15% 15%, rgba(121, 40, 202, 0.14) 0%, #0E091B 85%)",
                          border: "1px solid rgba(121, 40, 202, 0.28)",
                          boxShadow: "0 14px 35px rgba(0, 0, 0, 0.45)",
                          height: "100%",
                        }}
                      >
                        <div className="blog-content">
                          {/* Metadata Bar - Exact Height 26px */}
                          <div className="d-flex align-items-center justify-content-between mb-3 gap-2" style={{ height: "26px" }}>
                            <span
                              className="badge px-2 py-1 rounded-pill"
                              style={{
                                background: item.badgeBg,
                                color: item.badgeColor,
                                border: `1px solid ${item.badgeBorder}`,
                                fontSize: "10px",
                                fontWeight: "700",
                                letterSpacing: "0.5px"
                              }}
                            >
                              {item.badgeText}
                            </span>
                            <div className="text-white-50 small d-flex align-items-center gap-2">
                              <span>{item.date}</span>
                              <span>&bull;</span>
                              <span className="text-info fw-bold" style={{ maxWidth: "130px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {item.category}
                              </span>
                            </div>
                          </div>

                          {/* Title - Exact 74px Clamped Height for 100% Equal Card Heights */}
                          <h3
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              lineHeight: "1.38",
                              margin: "6px 0 10px",
                              height: "74px",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <Link legacyBehavior href={item.link}>
                              <a className="text-white text-decoration-none hover-cyan">
                                {item.title}
                              </a>
                            </Link>
                          </h3>

                          {/* Excerpt - Exact 44px Clamped Height for 100% Equal Card Heights */}
                          <p
                            className="text-secondary small"
                            style={{
                              lineHeight: "1.55",
                              height: "44px",
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

                        {/* Bottom Section: Fixed 180px Image & Uniform Footer */}
                        <div className="mt-auto">
                          <div className="blog-img rounded-3 overflow-hidden position-relative" style={{ height: "180px", width: "100%" }}>
                            <Link legacyBehavior href={item.link}>
                              <a className="d-block w-100 h-100">
                                <img
                                  className="img-fluid w-100 h-100"
                                  src={item.image}
                                  alt={item.title}
                                  style={{ objectFit: "cover", objectPosition: "center" }}
                                />
                              </a>
                            </Link>
                          </div>

                          {/* Footer Read Action - Exact 38px Height */}
                          <div className="mt-3 pt-2 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between" style={{ height: "38px" }}>
                            <Link legacyBehavior href={item.link}>
                              <a className="text-info small fw-bold text-decoration-none d-flex align-items-center gap-1 hover-cyan">
                                <span>Read Architecture Article</span> <i className="bi bi-arrow-right" />
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
