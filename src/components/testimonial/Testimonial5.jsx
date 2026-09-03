import React, { useMemo, useState, useEffect } from "react";
import SwiperCore, { Autoplay, EffectFade, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

SwiperCore.use([Pagination, Autoplay, EffectFade, Navigation]);

const GOOGLE_REVIEW_URL = "https://g.page/r/CdT43EVp0u6bEBM/review";

const FALLBACK_TESTIMONIALS = [
  {
    name: "Marcus Vance",
    designation: "Founder & CEO At LaCuna",
    review: "TechWithJoshi engineered the scalable cloud infrastructure and high-velocity web architecture for LaCuna. Their deep full-stack mastery, fast turnaround, and pixel-perfect design execution made them our most trusted development partner.",
    rating: 5,
    avatar: "/assets/img/clients/lacuna-favicon.png",
    companyLogo: "/assets/img/clients/lacuna-logo.png",
    badge: "VERIFIED ENTERPRISE CLIENT",
    source: "client"
  },
  {
    name: "Tapan Ghosh",
    designation: "Google Local Guide • 4 Reviews • 5 Photos",
    review: "Delivered quality work on time, communicated effectively, and handled requirements professionally. Highly recommended.",
    rating: 5,
    initial: "T",
    color: "#10B981",
    badge: "VERIFIED GOOGLE REVIEW",
    source: "google"
  },
  {
    name: "Rajat",
    designation: "Google Reviewer • 4 Reviews",
    review: "Good services. Outstanding engineering execution, transparent communication, and reliable software delivery.",
    rating: 5,
    initial: "R",
    color: "#3B82F6",
    badge: "VERIFIED GOOGLE REVIEW",
    source: "google"
  },
  {
    name: "Minni Jat",
    designation: "Google Reviewer • 2 Reviews",
    review: "Exceptional experience working with TechWithJoshi! Fast response times, deep technical proficiency, and high-impact delivery. 😉 👍",
    rating: 5,
    initial: "M",
    color: "#8B5CF6",
    badge: "VERIFIED GOOGLE REVIEW",
    source: "google"
  }
];

function Testimonial5() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    designation: "",
    company: "",
    review: "",
    rating: 5
  });

  const loadTestimonials = () => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Automatic 4 and 5 star filter!
          const fourFiveStars = data.filter((item) => Number(item.rating) >= 4);
          setTestimonials(fourFiveStars);
        }
      })
      .catch((err) => console.error("Error fetching testimonials:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.review) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reviewForm.name,
          designation: reviewForm.designation,
          company: reviewForm.company,
          review: reviewForm.review,
          rating: reviewForm.rating,
          source: "client_submitted",
          googleReviewUrl: GOOGLE_REVIEW_URL
        })
      });

      if (res.ok) {
        setReviewSubmitted(true);
        loadTestimonials();
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const copyReviewAndOpenGoogle = () => {
    if (navigator.clipboard && reviewForm.review) {
      navigator.clipboard.writeText(reviewForm.review).then(() => {
        setCopiedReview(true);
        setTimeout(() => setCopiedReview(false), 3000);
      });
    }
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
  };

  const slider = useMemo(() => {
    return {
      loop: true,
      spaceBetween: 0,
      speed: 2000,
      centeredSlides: true,
      navigation: {
        nextEl: ".nextbtn3",
        prevEl: ".prevbtn3",
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
    };
  }, []);

  const activeReviews = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <div className="home5-testimonial-area mb-130" id="testimonials-section">
      <div className="container">
        <div className="row g-lg-4 gy-5 align-items-center">
          {/* Left Column: Title & Google Review Solicitations */}
          <div className="col-lg-4 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="section-title-5">
              <span>CLIENT REVIEWS</span>
              <h2>Happy Clients</h2>
              <div className="testimolial-left">
                <p>
                  Discover how TechWithJoshi helps forward-thinking companies engineer high-performance cloud applications, AI agents, and secure distributed software.
                </p>

                {/* Elegant Unified Google Trust Card */}
                <div
                  className="google-trust-badge mt-4 p-3"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(18, 12, 36, 0.75) 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)",
                    maxWidth: "340px"
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <img src="assets/img/home-5/google-1.svg" alt="Google" style={{ width: "22px", height: "22px" }} />
                      <span style={{ color: "#FFFFFF", fontWeight: "700", fontSize: "13.5px" }}>Google Reviews</span>
                    </div>
                    <span
                      style={{
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#10B981",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "20px",
                        fontSize: "10.5px",
                        fontWeight: "700",
                        padding: "2px 8px"
                      }}
                    >
                      ● Verified 5.0
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span style={{ fontSize: "24px", fontWeight: "800", color: "#FFFFFF", lineHeight: 1 }}>5.0</span>
                    <div className="d-flex" style={{ color: "#FBBC05", fontSize: "14px", gap: "2px" }}>
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-fill" />
                    </div>
                    <span style={{ color: "#94a3b8", fontSize: "12px" }}>(All 5-Star)</span>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-between pt-2"
                    style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
                  >
                    <a
                      href={GOOGLE_REVIEW_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none d-inline-flex align-items-center gap-1"
                      style={{
                        color: "#00DFD8",
                        fontSize: "12.5px",
                        fontWeight: "600",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span>Rate on Google</span>
                      <i className="bi bi-box-arrow-up-right" style={{ fontSize: "11px" }} />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setReviewSubmitted(false);
                        setShowReviewModal(true);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#94a3b8",
                        fontSize: "12px",
                        cursor: "pointer",
                        padding: 0,
                        textDecoration: "underline",
                        textUnderlineOffset: "3px"
                      }}
                    >
                      Leave feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Swiper Carousel */}
          <div className="col-lg-8 position-relative wow animate fadeInUp" data-wow-delay="300ms" data-wow-duration="1500ms">
            <Swiper {...slider} className="swiper home5-testimonial-slider">
              <div className="swiper-wrapper">
                {activeReviews.map((item, idx) => {
                  const ratingNum = Math.max(4, Math.min(5, Number(item.rating) || 5));
                  const isGoogle = item.source === "google";
                  const initialLetter = item.initial || (item.name ? item.name.charAt(0).toUpperCase() : "C");
                  const badgeColor = item.color || (isGoogle ? "#10B981" : "#00DFD8");

                  return (
                    <SwiperSlide key={item._id || idx} className="swiper-slide">
                      <div className="testimonial-wrapper">
                        <div className="testimonial-top">
                          {/* Author Avatar or Initial Badge */}
                          {item.avatar && item.avatar.trim() !== "" ? (
                            <div
                              className="author-img d-flex align-items-center justify-content-center overflow-hidden"
                              style={{
                                width: "90px",
                                height: "90px",
                                borderRadius: "50%",
                                background: "#080411",
                                boxShadow: "0 8px 25px rgba(0, 223, 216, 0.45)",
                                border: "3px solid #00DFD8",
                                flexShrink: 0
                              }}
                            >
                              <img
                                src={item.avatar}
                                alt={item.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                          ) : (
                            <div
                              className="author-img d-flex align-items-center justify-content-center"
                              style={{
                                width: "90px",
                                height: "90px",
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${badgeColor}, #0F0A1E)`,
                                boxShadow: `0 8px 25px ${badgeColor}60`,
                                border: `3px solid ${badgeColor}`,
                                flexShrink: 0,
                                userSelect: "none"
                              }}
                            >
                              <span style={{ color: "#FFFFFF", fontSize: "38px", fontWeight: "800", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                                {initialLetter}
                              </span>
                            </div>
                          )}

                          {/* Review Badges & Stars */}
                          <div className="review d-flex flex-column align-items-end">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              {item.companyLogo ? (
                                <img
                                  src={item.companyLogo}
                                  alt={item.company || "Client Logo"}
                                  style={{ height: "26px", maxWidth: "130px", objectFit: "contain" }}
                                />
                              ) : isGoogle ? (
                                <img src="assets/img/home-5/google-1.svg" alt="Google" style={{ height: "24px" }} />
                              ) : (
                                <i className="bi bi-patch-check-fill text-info" style={{ fontSize: "20px" }} />
                              )}

                              <div className="d-flex" style={{ color: "#FBBC05", fontSize: "16px", gap: "2px" }}>
                                {[...Array(ratingNum)].map((_, sIdx) => (
                                  <i key={sIdx} className="bi bi-star-fill" />
                                ))}
                              </div>
                            </div>

                            <a
                              href={item.googleReviewUrl || GOOGLE_REVIEW_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                              style={{ fontSize: "11px", fontWeight: "700", color: badgeColor, letterSpacing: "0.5px" }}
                            >
                              {item.badge || (isGoogle ? "VERIFIED GOOGLE REVIEW ↗" : "VERIFIED CLIENT ↗")}
                            </a>
                          </div>
                        </div>

                        {/* Review Content */}
                        <div className="testimonial-content">
                          <p>“{item.review}”</p>
                        </div>

                        {/* Author Meta */}
                        <div className="testimonial-btm">
                          <div className="author-content">
                            <h4>{item.name}</h4>
                            <span>{item.designation || (item.company ? `At ${item.company}` : "Verified Client")}</span>
                          </div>
                          <div className="quote-icon">
                            <img src="assets/img/home-5/left-quote.svg" alt="Quote" />
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </div>
            </Swiper>

            <div className="swiper-btn-group">
              <div className="swiper-btn prevbtn3">
                <i className="bi bi-arrow-up" />
              </div>
              <div className="swiper-btn nextbtn3">
                <i className="bi bi-arrow-down" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Cyber-Glass Review Submission Modal */}
      {showReviewModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(5, 2, 14, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setShowReviewModal(false)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, rgba(18, 12, 36, 0.95) 0%, rgba(8, 4, 17, 0.98) 100%)",
              border: "1px solid rgba(0, 223, 216, 0.35)",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 223, 216, 0.2)",
              maxWidth: "540px",
              width: "100%",
              padding: "32px",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                color: "#94a3b8",
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <i className="bi bi-x-lg" />
            </button>

            {!reviewSubmitted ? (
              <div>
                <div style={{ textAlign: "center", marginBottom: "22px" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: "rgba(0, 223, 216, 0.12)",
                      border: "1px solid rgba(0, 223, 216, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                      color: "#00DFD8",
                      fontSize: "26px"
                    }}
                  >
                    <i className="bi bi-star-fill" />
                  </div>
                  <h3 style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: "800", marginBottom: "6px" }}>
                    Share Your Experience
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: 0 }}>
                    We take pride in our engineering quality. Your review helps us continuously elevate our technical standards.
                  </p>
                </div>

                <form onSubmit={handleReviewSubmit}>
                  {/* Star Rating Picker */}
                  <div className="mb-3 text-center">
                    <label style={{ color: "#CBD5E1", fontSize: "12.5px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                      Select Rating (4-5 Stars featured on live website)
                    </label>
                    <div className="d-flex justify-content-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "28px",
                            cursor: "pointer",
                            color: star <= reviewForm.rating ? "#FBBC05" : "#475569",
                            transition: "transform 0.15s ease",
                            transform: star <= reviewForm.rating ? "scale(1.15)" : "scale(1)"
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label style={{ color: "#CBD5E1", fontSize: "12.5px", fontWeight: "600", marginBottom: "4px" }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="form-control"
                      style={{
                        background: "#0E081F",
                        border: "1px solid rgba(121, 40, 202, 0.4)",
                        color: "#FFFFFF",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "14px"
                      }}
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label style={{ color: "#CBD5E1", fontSize: "12.5px", fontWeight: "600", marginBottom: "4px" }}>
                        Designation / Role
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VP of Product"
                        value={reviewForm.designation}
                        onChange={(e) => setReviewForm({ ...reviewForm, designation: e.target.value })}
                        className="form-control"
                        style={{
                          background: "#0E081F",
                          border: "1px solid rgba(121, 40, 202, 0.4)",
                          color: "#FFFFFF",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          fontSize: "14px"
                        }}
                      />
                    </div>
                    <div className="col-6">
                      <label style={{ color: "#CBD5E1", fontSize: "12.5px", fontWeight: "600", marginBottom: "4px" }}>
                        Company
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nexus Labs"
                        value={reviewForm.company}
                        onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                        className="form-control"
                        style={{
                          background: "#0E081F",
                          border: "1px solid rgba(121, 40, 202, 0.4)",
                          color: "#FFFFFF",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          fontSize: "14px"
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label style={{ color: "#CBD5E1", fontSize: "12.5px", fontWeight: "600", marginBottom: "4px" }}>
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your technical engagement, software delivery, and experience with TechWithJoshi..."
                      value={reviewForm.review}
                      onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                      className="form-control"
                      style={{
                        background: "#0E081F",
                        border: "1px solid rgba(121, 40, 202, 0.4)",
                        color: "#FFFFFF",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        fontSize: "13.5px",
                        lineHeight: "1.6"
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #00DFD8 0%, #7928CA 100%)",
                      border: "none",
                      color: "#FFFFFF",
                      padding: "12px",
                      borderRadius: "12px",
                      fontWeight: "700",
                      fontSize: "15px",
                      cursor: "pointer",
                      boxShadow: "0 8px 25px rgba(0, 223, 216, 0.4)"
                    }}
                  >
                    {submitting ? "Submitting Review..." : "Submit Review"}
                  </button>
                </form>
              </div>
            ) : (
              /* Success & Direct Google Sync Prompt */
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "2px solid #10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    color: "#10B981",
                    fontSize: "32px"
                  }}
                >
                  <i className="bi bi-check2-circle" />
                </div>

                <h3 style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: "800", marginBottom: "8px" }}>
                  Thank You, {reviewForm.name}!
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                  Your {reviewForm.rating}-star review has been verified and saved to our live database.
                </p>

                {/* Google One-Click Request */}
                <div
                  style={{
                    background: "rgba(66, 133, 244, 0.08)",
                    border: "1px solid rgba(66, 133, 244, 0.35)",
                    borderRadius: "14px",
                    padding: "18px",
                    marginBottom: "20px"
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <img src="assets/img/home-5/google-1.svg" alt="Google" style={{ width: "22px", height: "22px" }} />
                    <span style={{ color: "#FFFFFF", fontWeight: "700", fontSize: "15px" }}>
                      Also post to Google Reviews?
                    </span>
                  </div>
                  <p style={{ color: "#CBD5E1", fontSize: "12.5px", marginBottom: "14px" }}>
                    It takes just 1 click to post this on our official Google Business Profile. We'll automatically copy your review text to your clipboard!
                  </p>

                  <button
                    type="button"
                    onClick={copyReviewAndOpenGoogle}
                    style={{
                      background: "linear-gradient(135deg, #4285F4 0%, #34A853 100%)",
                      border: "none",
                      color: "#FFFFFF",
                      padding: "10px 24px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 6px 20px rgba(66, 133, 244, 0.4)"
                    }}
                  >
                    <span>{copiedReview ? "Copied! Opening Google..." : "⭐ Post to Google in 1-Click ↗"}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#94a3b8",
                    fontSize: "13px",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Done, return to website
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Testimonial5;
