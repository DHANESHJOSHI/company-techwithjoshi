import React, { useState, useEffect } from "react";
import Link from "next/link";

const SCREENS = [
  { img: "/assets/img/mobile-app/mobile-home-search.png", label: "Home & Search" },
  { img: "/assets/img/mobile-app/mobile-dark-mode.png", label: "Dark Mode & FCM" },
  { img: "/assets/img/mobile-app/mobile-products.png", label: "Product Catalog" },
  { img: "/assets/img/mobile-app/mobile-wishlist.png", label: "Cloud Wishlist" },
  { img: "/assets/img/mobile-app/mobile-checkout.png", label: "1-Step Checkout" },
  { img: "/assets/img/mobile-app/mobile-orders.png", label: "Order Tracking" },
];

export default function MobileProjectCardSlider({ projectLink, title }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SCREENS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + SCREENS.length) % SCREENS.length);
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % SCREENS.length);
  };

  return (
    <div
      className="position-relative w-100 h-100 overflow-hidden"
      style={{ minHeight: "260px", background: "#080411" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Left Badge: Mobile App 6 Screens */}
      <span
        className="badge position-absolute top-0 start-0 m-3 rounded-pill text-dark fw-bold"
        style={{
          background: "linear-gradient(135deg, #00DFD8, #38BDF8, #8B5CF6)",
          zIndex: 4,
          fontSize: "10px",
          letterSpacing: "0.5px",
          boxShadow: "0 4px 15px rgba(0, 223, 216, 0.4)",
        }}
      >
        <i className="bi bi-phone-fill me-1" /> 6 APP SCREENS • SLIDER
      </span>

      {/* Top Right: Current Screen Name Pill */}
      <span
        className="badge position-absolute top-0 end-0 m-3 rounded-pill text-white"
        style={{
          background: "rgba(10, 5, 20, 0.85)",
          border: "1px solid rgba(0, 223, 216, 0.3)",
          backdropFilter: "blur(6px)",
          zIndex: 4,
          fontSize: "10px",
          padding: "4px 8px",
        }}
      >
        {currentIdx + 1}/{SCREENS.length}: {SCREENS[currentIdx].label}
      </span>

      {/* Image Display */}
      <Link legacyBehavior href={projectLink}>
        <a style={{ display: "block", width: "100%", height: "100%" }}>
          <img
            className="img-fluid w-100 h-100"
            src={SCREENS[currentIdx].img}
            alt={`${title} - ${SCREENS[currentIdx].label}`}
            style={{
              objectFit: "cover",
              maxHeight: "280px",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          />
        </a>
      </Link>

      {/* Navigation Arrows on Hover */}
      <button
        type="button"
        onClick={handlePrev}
        className="btn btn-sm position-absolute start-0 top-50 translate-middle-y ms-2 rounded-circle d-flex align-items-center justify-content-center text-white p-0"
        style={{
          width: "28px",
          height: "28px",
          background: "rgba(10, 5, 20, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          zIndex: 4,
          fontSize: "12px",
        }}
        title="Previous Screen"
      >
        <i className="bi bi-chevron-left" />
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="btn btn-sm position-absolute end-0 top-50 translate-middle-y me-2 rounded-circle d-flex align-items-center justify-content-center text-white p-0"
        style={{
          width: "28px",
          height: "28px",
          background: "rgba(10, 5, 20, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          zIndex: 4,
          fontSize: "12px",
        }}
        title="Next Screen"
      >
        <i className="bi bi-chevron-right" />
      </button>

      {/* Bottom Screen Dot Indicators */}
      <div
        className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex align-items-center gap-1 p-1 rounded-pill"
        style={{
          background: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(6px)",
          zIndex: 4,
        }}
      >
        {SCREENS.map((_, dotIdx) => (
          <span
            key={dotIdx}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIdx(dotIdx);
            }}
            style={{
              width: currentIdx === dotIdx ? "16px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: currentIdx === dotIdx ? "#00DFD8" : "rgba(255, 255, 255, 0.35)",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: currentIdx === dotIdx ? "0 0 6px #00DFD8" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
