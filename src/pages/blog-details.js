import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";

export default function BlogDetailsPage() {
  const router = useRouter();
  const { id, slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);

    const queryParams = id ? `?id=${encodeURIComponent(id)}` : slug ? `?slug=${encodeURIComponent(slug)}` : "";

    Promise.all([
      fetch("/api/blogs").then((r) => r.json()).catch(() => []),
      fetch(`/api/news${queryParams}`).then((r) => r.json()).catch(() => ({ allNews: [] }))
    ])
      .then(([blogData, newsData]) => {
        // 1. Direct resolved article from /api/news (e.g. live Dev.to open source full article or custom news)
        if (newsData && newsData.article) {
          setBlog(newsData.article);
          const allRecent = [
            ...(Array.isArray(blogData) ? blogData : []),
            ...(Array.isArray(newsData.allNews) ? newsData.allNews : [])
          ].filter((b) => String(b.id || b._id) !== String(newsData.article.id || newsData.article._id));
          setRecentBlogs(allRecent.slice(0, 6));
          return;
        }

        const allArticles = [
          ...(Array.isArray(blogData) ? blogData : []),
          ...(Array.isArray(newsData?.allNews) ? newsData.allNews : [])
        ];

        let found = null;
        if (id) {
          found = allArticles.find((b) => String(b._id || b.id) === String(id));
        } else if (slug) {
          found = allArticles.find((b) => b.slug === slug);
        }

        const activePost = found || allArticles[0] || null;
        setBlog(activePost);

        if (activePost) {
          const recents = allArticles.filter(
            (b) => String(b._id || b.id) !== String(activePost._id || activePost.id)
          );
          setRecentBlogs(recents.slice(0, 6));
        }
      })
      .catch((err) => console.error("Error loading blog details:", err))
      .finally(() => setLoading(false));
  }, [router.isReady, id, slug]);

  const post = blog;

  return (
    <Layout>
      <Breadcrumb
        pageList="BLOG DETAILS"
        title={post ? post.title : "Tech Article Details"}
        pageName="Blog Details"
      />

      <div className="bolog-details-area sec-mar" style={{ background: "#080411", color: "#FFFFFF" }}>
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status" />
              <p className="mt-3 text-white-50">Loading article...</p>
            </div>
          ) : post ? (
            <div className="row g-lg-5 gy-5">
              {/* Main Article Content */}
              <div className="col-lg-8">
                {/* Video Embed or Featured Image */}
                {post.videoUrl ? (
                  <div className="ratio ratio-16x9 mb-40 rounded-4 overflow-hidden" style={{ border: "1px solid rgba(121,40,202,0.35)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
                    <iframe
                      src={post.videoUrl.includes("watch?v=") ? post.videoUrl.replace("watch?v=", "embed/") : post.videoUrl}
                      title={post.title}
                      allowFullScreen
                    />
                  </div>
                ) : (post.image || post.img) ? (
                  <div className="post-thumb mb-40 rounded-4 overflow-hidden" style={{ border: "1px solid rgba(121,40,202,0.3)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
                    <img
                      className="img-fluid w-100"
                      src={post.image || post.img}
                      alt={post.title}
                      style={{ maxHeight: "460px", objectFit: "cover" }}
                    />
                  </div>
                ) : null}

                {/* Article Header */}
                <div className="mb-4">
                  <span className="badge px-3 py-2 rounded-pill text-info border border-info border-opacity-50 mb-3" style={{ background: "rgba(0,223,216,0.1)", fontSize: "13px" }}>
                    {post.category || "ENGINEERING"}
                  </span>
                  <h1 className="fw-bold text-white mb-3" style={{ fontSize: "clamp(26px, 3.8vw, 40px)", lineHeight: "1.3" }}>
                    {post.title}
                  </h1>

                  {/* Author & Meta */}
                  <div className="d-flex flex-wrap align-items-center gap-3 py-3 border-top border-bottom border-secondary border-opacity-25 text-white-50 small">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-info text-dark fw-bold d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", fontSize: "14px" }}>
                        <i className="bi bi-person-fill" />
                      </div>
                      <span className="text-white fw-bold">{post.author || "TechWithJoshi Engineering"}</span>
                    </div>
                    <span>&bull;</span>
                    <span><i className="bi bi-calendar3 me-1 text-info" /> {post.date || "Recent"}</span>
                    <span>&bull;</span>
                    <span><i className="bi bi-clock me-1 text-info" /> {post.readTime || "5 min read"}</span>
                    {post.source && (
                      <>
                        <span>&bull;</span>
                        <span className="badge bg-dark border border-secondary text-info"><i className="bi bi-cpu me-1" /> {post.source}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Rich Text Body with Custom Dark Mode Typography */}
                <div
                  className="blog-rich-body mb-50"
                  style={{
                    color: "#CBD5E1",
                    fontSize: "17px",
                    lineHeight: "1.9",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: post.content || post.details || post.excerpt || `<p>${post.title}</p>`
                  }}
                />

                <style jsx global>{`
                  .blog-rich-body {
                    color: #E2E8F0 !important;
                  }
                  .blog-rich-body p {
                    color: #E2E8F0 !important;
                    font-size: 16.5px !important;
                    line-height: 1.85 !important;
                    margin-bottom: 22px !important;
                  }
                  .blog-rich-body h1, .blog-rich-body h2, .blog-rich-body h3, .blog-rich-body h4 {
                    color: #FFFFFF !important;
                    font-weight: 700 !important;
                    letter-spacing: -0.3px !important;
                    margin-top: 36px !important;
                    margin-bottom: 18px !important;
                  }
                  .heading-num {
                    background: linear-gradient(135deg, #7928CA, #00DFD8) !important;
                    -webkit-background-clip: text !important;
                    -webkit-text-fill-color: transparent !important;
                    font-weight: 800 !important;
                    margin-right: 8px !important;
                    font-size: 1.1em !important;
                  }
                  .article-lead-card {
                    background: linear-gradient(135deg, rgba(121, 40, 202, 0.16) 0%, rgba(8, 4, 17, 0.95) 100%) !important;
                    border: 1px solid rgba(121, 40, 202, 0.35) !important;
                    border-left: 4px solid #00DFD8 !important;
                    border-radius: 14px !important;
                    padding: 24px 28px !important;
                    margin: 24px 0 34px 0 !important;
                    display: flex !important;
                    gap: 18px !important;
                    align-items: flex-start !important;
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45) !important;
                  }
                  .article-lead-card .lead-icon {
                    width: 44px !important;
                    height: 44px !important;
                    border-radius: 50% !important;
                    background: linear-gradient(135deg, rgba(121, 40, 202, 0.4), rgba(0, 223, 216, 0.3)) !important;
                    border: 1px solid rgba(0, 223, 216, 0.5) !important;
                    color: #00DFD8 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    font-size: 20px !important;
                    flex-shrink: 0 !important;
                  }
                  .article-lead-card .lead-text {
                    color: #F8FAFC !important;
                    font-size: 17.5px !important;
                    font-weight: 500 !important;
                    line-height: 1.8 !important;
                    margin-bottom: 0 !important;
                  }
                  .blog-rich-body ul, .article-list {
                    padding-left: 0 !important;
                    list-style: none !important;
                    margin: 22px 0 28px 0 !important;
                  }
                  .blog-rich-body ul li, .article-list li {
                    color: #CBD5E1 !important;
                    font-size: 16px !important;
                    line-height: 1.85 !important;
                    margin-bottom: 14px !important;
                    position: relative !important;
                    padding-left: 28px !important;
                  }
                  .blog-rich-body ul li::before, .article-list li::before {
                    content: "✦" !important;
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    color: #00DFD8 !important;
                    font-size: 14px !important;
                    font-weight: 700 !important;
                    text-shadow: 0 0 8px rgba(0, 223, 216, 0.6) !important;
                  }
                  .blog-rich-body li strong, .article-list li strong {
                    color: #FFFFFF !important;
                    font-weight: 700 !important;
                  }
                  .code-window {
                    background: #090514 !important;
                    border: 1px solid rgba(121, 40, 202, 0.38) !important;
                    border-radius: 14px !important;
                    overflow: hidden !important;
                    margin: 28px 0 !important;
                    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6) !important;
                  }
                  .code-header {
                    background: rgba(18, 12, 36, 0.95) !important;
                    border-bottom: 1px solid rgba(121, 40, 202, 0.25) !important;
                    padding: 10px 18px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                  }
                  .code-dots {
                    display: flex !important;
                    align-items: center !important;
                    gap: 7px !important;
                  }
                  .code-dot {
                    width: 11px !important;
                    height: 11px !important;
                    border-radius: 50% !important;
                    display: inline-block !important;
                  }
                  .code-dot.red { background: #EF4444 !important; }
                  .code-dot.yellow { background: #F59E0B !important; }
                  .code-dot.green { background: #10B981 !important; }
                  .code-title {
                    font-family: ui-monospace, Menlo, Monaco, Consolas, monospace !important;
                    font-size: 12px !important;
                    color: #94A3B8 !important;
                  }
                  .code-badge {
                    background: rgba(121, 40, 202, 0.3) !important;
                    border: 1px solid rgba(0, 223, 216, 0.3) !important;
                    color: #00DFD8 !important;
                    font-size: 11px !important;
                    font-weight: 700 !important;
                    padding: 2px 8px !important;
                    border-radius: 6px !important;
                    text-transform: uppercase !important;
                  }
                  .code-window pre {
                    margin: 0 !important;
                    padding: 20px 22px !important;
                    background: transparent !important;
                    border: none !important;
                    border-radius: 0 !important;
                    color: #F1F5F9 !important;
                    font-family: "JetBrains Mono", "Fira Code", ui-monospace, Menlo, Monaco, Consolas, monospace !important;
                    font-size: 14px !important;
                    line-height: 1.75 !important;
                    overflow-x: auto !important;
                  }
                  .token-keyword { color: #C084FC !important; font-weight: 600 !important; }
                  .token-type { color: #38BDF8 !important; }
                  .token-string { color: #34D399 !important; }
                  .token-comment { color: #64748B !important; font-style: italic !important; }
                  .blog-rich-body code:not(pre code) {
                    background: rgba(121, 40, 202, 0.22) !important;
                    border: 1px solid rgba(0, 223, 216, 0.3) !important;
                    color: #00DFD8 !important;
                    padding: 3px 8px !important;
                    border-radius: 6px !important;
                    font-size: 0.88em !important;
                    font-weight: 500 !important;
                    font-family: ui-monospace, Menlo, Consolas, monospace !important;
                  }
                  .article-takeaway, .blog-rich-body blockquote {
                    background: radial-gradient(circle at 10% 10%, rgba(121, 40, 202, 0.2) 0%, rgba(14, 9, 27, 0.9) 100%) !important;
                    border: 1px solid rgba(0, 223, 216, 0.35) !important;
                    border-left: 4px solid #00DFD8 !important;
                    border-radius: 0 12px 12px 0 !important;
                    padding: 22px 26px !important;
                    margin: 30px 0 !important;
                    color: #F8FAFC !important;
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35) !important;
                  }
                  .article-takeaway .takeaway-badge {
                    color: #00DFD8 !important;
                    font-size: 13px !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.5px !important;
                    margin-bottom: 10px !important;
                    display: flex !important;
                    align-items: center !important;
                  }
                  .article-takeaway p, .blog-rich-body blockquote p {
                    color: #E2E8F0 !important;
                    font-size: 16px !important;
                    line-height: 1.8 !important;
                    margin-bottom: 0 !important;
                  }
                  .blog-rich-body a {
                    color: #00DFD8 !important;
                    text-decoration: underline !important;
                  }
                  .blog-rich-body img {
                    max-width: 100% !important;
                    height: auto !important;
                    border-radius: 12px !important;
                    margin: 20px 0 !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                  }
                `}</style>

                {/* Tags Bar */}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="d-flex flex-wrap align-items-center gap-2 p-3 rounded-3 mb-50" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-white fw-bold me-2 small"><i className="bi bi-tags text-info me-1" /> Tags:</span>
                    {post.tags.map((t, idx) => (
                      <span key={idx} className="badge bg-dark text-info border border-secondary px-3 py-2 rounded-pill small">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author Bio Box */}
                <div className="p-4 rounded-4 mb-50 d-flex flex-wrap align-items-center gap-3" style={{ background: "radial-gradient(circle at 15% 15%, rgba(121,40,202,0.15) 0%, #0E091B 85%)", border: "1px solid rgba(121,40,202,0.3)" }}>
                  <div className="author-avatar rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: "65px", height: "65px", background: "linear-gradient(135deg, #7928CA, #00DFD8)", fontSize: "28px" }}>
                    <i className="bi bi-code-square" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h5 className="text-white fw-bold mb-1">Authored by {post.author || "TechWithJoshi Engineering"}</h5>
                    <p className="text-white-50 small mb-0">
                      Engineering blueprints, open-source deep dives, and production architectures published by <strong>TechWithJoshi Private Limited</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-lg-4">
                <div className="sidebar-sticky" style={{ position: "sticky", top: "100px" }}>
                  {/* Recent Posts Widget */}
                  <div className="sidebar-widget p-4 rounded-4 mb-4" style={{ background: "radial-gradient(circle at 20% 20%, rgba(121, 40, 202, 0.12) 0%, #0E091B 85%)", border: "1px solid rgba(121,40,202,0.25)" }}>
                    <h5 className="text-white fw-bold mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                      Recent Tech Articles
                    </h5>
                    <div className="d-flex flex-column gap-3">
                      {recentBlogs.map((b) => (
                        <Link legacyBehavior key={b._id || b.id} href={`/blog-details?id=${b._id || b.id}&slug=${b.slug || ""}`}>
                          <a className="d-flex gap-3 text-decoration-none transition-all group">
                            {(b.image || b.img) && (
                              <img
                                src={b.image || b.img}
                                alt={b.title}
                                style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 }}
                              />
                            )}
                            <div>
                              <span className="text-info" style={{ fontSize: "11px", fontWeight: "700" }}>{b.category || "Tech"}</span>
                              <h6 className="text-white small fw-bold mb-1 line-clamp-2" style={{ lineHeight: "1.4" }}>{b.title}</h6>
                              <span className="text-white-50" style={{ fontSize: "11px" }}>{b.date || "Recent"}</span>
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Consultation Banner */}
                  <div className="sidebar-widget p-4 rounded-4 text-center" style={{ background: "radial-gradient(circle at 50% 50%, rgba(121, 40, 202, 0.22) 0%, #080411 90%)", border: "1px solid rgba(0,223,216,0.3)" }}>
                    <h5 className="text-white fw-bold mb-2">Need Technical Advice?</h5>
                    <p className="text-white-50 small mb-3">Schedule a 30-minute direct discovery call with TechWithJoshi Private Limited principal architects.</p>
                    <Link legacyBehavior href="/contact">
                      <a className="btn btn-info w-100 rounded-pill py-2 fw-bold text-dark" style={{ background: "linear-gradient(135deg, #00DFD8, #8B5CF6)", border: "none" }}>
                        Book Discovery Call
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <h3 className="text-white">Article not found</h3>
              <Link legacyBehavior href="/blog">
                <a className="btn btn-info rounded-pill mt-3">Back to All Articles</a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
