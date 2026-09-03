import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const MOBILE_SCREENS = [
  {
    id: "home-search",
    title: "Interactive Home & Predictive Search",
    shortTitle: "Home & Search",
    subtitle: "AI-Powered Discovery & Dynamic Storefront",
    image: "/assets/img/mobile-app/mobile-home-search.png",
    tagline: "Voice search, visual discovery & dynamic hero carousels",
    description: "The mobile home experience delivers sub-45ms predictive search, automated trending suggestions, dynamic promotional carousels, and localized category browsing designed for rapid shopper discovery.",
    features: [
      {
        title: "Voice & Predictive Search",
        desc: "Instant search autocomplete with debounced GraphQL queries, fuzzy matching, and voice recognition.",
        tag: "Search Engine",
        icon: "bi-mic-fill"
      },
      {
        title: "Dynamic Promo Carousels",
        desc: "Automated campaign banners synchronized across multi-channel campaigns with sub-second asset caching.",
        tag: "Marketing Engine",
        icon: "bi-badge-ad-fill"
      },
      {
        title: "Smart Category Feeds",
        desc: "Personalized product grids tailored to user purchase patterns, local warehouse inventory, and seasonal collections.",
        tag: "Personalization",
        icon: "bi-grid-fill"
      }
    ],
    hotspots: [
      { x: 32, y: 14, label: "Voice Search Bar", detail: "Sub-45ms query latency with fuzzy Algolia/GraphQL matching" },
      { x: 50, y: 35, label: "Dynamic Hero Slider", detail: "Hardware-accelerated carousel with GPU page caching" },
      { x: 68, y: 65, label: "Featured Categories", detail: "Real-time stock synchronized across regional warehouses" }
    ],
    metrics: [
      { label: "Search Latency", value: "< 45ms", change: "Sub-second" },
      { label: "Frame Rate", value: "60 FPS", change: "Locked" },
      { label: "Cache Hit Rate", value: "98.4%", change: "+32%" }
    ],
    techStack: ["Flutter / Dart", "Headless E-Commerce GraphQL API", "Algolia Search", "Hive Local DB"]
  },
  {
    id: "dark-mode",
    title: "Native OLED Dark Mode & Push Alerts",
    shortTitle: "Dark Mode & FCM",
    subtitle: "Hardware-Accelerated Dark Theme & Push Engine",
    image: "/assets/img/mobile-app/mobile-dark-mode.png",
    tagline: "High-contrast dark theme & sub-second push notifications",
    description: "Engineered with a pure OLED pitch-black theme that saves up to 35% mobile battery life. Seamlessly linked with Firebase Cloud Messaging (FCM) for targeted flash-sale alerts and instant transactional updates.",
    features: [
      {
        title: "OLED Pitch-Black Palette",
        desc: "Dynamic OS-level theme matching with zero-flicker transitions and true #000000 pixel shutoff on OLED displays.",
        tag: "Theme Engine",
        icon: "bi-moon-stars-fill"
      },
      {
        title: "Firebase Cloud Messaging (FCM)",
        desc: "Targeted push notification campaigns featuring rich media images, custom actions, and instant deep-linking.",
        tag: "FCM Push",
        icon: "bi-bell-fill"
      },
      {
        title: "GPU Hardware Efficiency",
        desc: "Optimized GPU shader pipelines that reduce CPU rendering spikes and extend battery longevity.",
        tag: "Power Saving",
        icon: "bi-battery-charging"
      }
    ],
    hotspots: [
      { x: 78, y: 12, label: "Adaptive Theme Switcher", detail: "Instant zero-flicker dark/light palette toggle" },
      { x: 50, y: 26, label: "Rich Push Notification", detail: "Interactive action buttons with sub-second delivery" },
      { x: 35, y: 62, label: "OLED Contrast Engine", detail: "Hardware-accelerated contrast ratio of 21:1" }
    ],
    metrics: [
      { label: "Battery Saved", value: "35%", change: "On OLED" },
      { label: "Push Delivery", value: "< 1.2s", change: "Global" },
      { label: "Contrast Ratio", value: "21:1", change: "Maximum" }
    ],
    techStack: ["Firebase FCM", "Apple APNs", "GPU Shaders", "Dynamic Theme API"]
  },
  {
    id: "products",
    title: "Smart Product Catalog & Faceted Filters",
    shortTitle: "Catalog & Filters",
    subtitle: "High-Throughput Faceted Filtering Engine",
    image: "/assets/img/mobile-app/mobile-products.png",
    tagline: "Multi-attribute filtering & sub-second catalog navigation",
    description: "Browse extensive product catalogs with zero stutter. Instant faceted filters refine thousands of SKUs by color swatches, size dimensions, pricing sliders, and local warehouse stock.",
    features: [
      {
        title: "Multi-Attribute Faceted Filters",
        desc: "Client-side instantaneous facet filtering coupled with server-side GraphQL index execution.",
        tag: "Faceted Search",
        icon: "bi-funnel-fill"
      },
      {
        title: "Infinite Virtualized Grid",
        desc: "Memory-conscious virtualized list rendering only visible items to sustain silky 60fps scrolling across 100k+ SKUs.",
        tag: "Virtual List",
        icon: "bi-grid-3x3-gap-fill"
      },
      {
        title: "Configurable Color Swatches",
        desc: "Interactive swatches dynamically update high-res product renders and price tags without page reloads.",
        tag: "Dynamic Swatches",
        icon: "bi-palette-fill"
      }
    ],
    hotspots: [
      { x: 26, y: 20, label: "Faceted Filter Tray", detail: "Drawer modal with real-time matching product counts" },
      { x: 58, y: 48, label: "Interactive Swatches", detail: "Instant image & stock updates per selected color" },
      { x: 75, y: 78, label: "1-Tap Quick Add", detail: "Instant bag insertion with haptic vibration" }
    ],
    metrics: [
      { label: "Scroll Speed", value: "60 FPS", change: "Locked" },
      { label: "Filter Delay", value: "< 20ms", change: "Instant" },
      { label: "Catalog Scale", value: "500K+ SKUs", change: "Tested" }
    ],
    techStack: ["Virtualization", "E-Commerce Catalog API", "Faceted Indices", "Haptic Engine"]
  },
  {
    id: "wishlist",
    title: "Cloud Synchronized Wishlist & Favorites",
    shortTitle: "Wishlist Sync",
    subtitle: "Real-Time Omni-Channel Customer Bookmarks",
    image: "/assets/img/mobile-app/mobile-wishlist.png",
    tagline: "Cross-device favorites cloud synchronization",
    description: "Empowers shoppers to curate desired products with offline-first persistence. The wishlist synchronizes bidirectionally with web sessions within 80ms, triggering automated price-drop alerts.",
    features: [
      {
        title: "Sub-80ms Bidirectional Sync",
        desc: "Syncs customer bookmarks across web, tablet, and mobile instances with automatic conflict resolution.",
        tag: "Omni-Channel",
        icon: "bi-arrow-repeat"
      },
      {
        title: "Automated Price-Drop Watcher",
        desc: "Background service checks for merchant discounts and dispatches proactive notification triggers.",
        tag: "Price Telemetry",
        icon: "bi-tag-fill"
      },
      {
        title: "1-Tap Batch Cart Move",
        desc: "Shoppers can transfer single items or all bookmarked products directly into active checkout with one touch.",
        tag: "Conversion",
        icon: "bi-cart-plus-fill"
      }
    ],
    hotspots: [
      { x: 80, y: 24, label: "Animated Heart Action", detail: "Fluid vector micro-interaction on like" },
      { x: 42, y: 54, label: "Price-Drop Badge", detail: "Real-time indicator showing price discount" },
      { x: 52, y: 88, label: "Batch Add to Bag", detail: "1-touch cart transfer with stock check" }
    ],
    metrics: [
      { label: "Cloud Sync", value: "< 80ms", change: "Real-time" },
      { label: "Offline Storage", value: "100%", change: "SQLite" },
      { label: "Conversion Lift", value: "+28%", change: "Measured" }
    ],
    techStack: ["SQLite / Hive", "WebSockets", "Enterprise E-Commerce Engine Core", "Price Watcher"]
  },
  {
    id: "checkout",
    title: "Frictionless One-Step Mobile Checkout",
    shortTitle: "1-Step Checkout",
    subtitle: "Biometric & Multi-Gateway Accelerated Payment",
    image: "/assets/img/mobile-app/mobile-checkout.png",
    tagline: "Biometric authentication & multi-gateway payments",
    description: "Replaced tedious multi-step checkout with an ultra-fast single-view native flow. Integrates Apple Pay, Google Pay, Razorpay, Stripe, and biometric FaceID/TouchID for completion in under 5 seconds.",
    features: [
      {
        title: "Native Apple & Google Pay",
        desc: "Direct express wallet checkout bypassing manual card data entry with native cryptographic authorization.",
        tag: "Express Pay",
        icon: "bi-wallet2"
      },
      {
        title: "GPS Address Geocoding",
        desc: "One-tap address autocompletion leveraging Google Maps Places API and device location sensors.",
        tag: "Geolocation",
        icon: "bi-geo-alt-fill"
      },
      {
        title: "PCI-DSS Level 1 Encryption",
        desc: "Zero raw credit card exposure; end-to-end tokenized payment payloads verified directly by processor APIs.",
        tag: "Zero-Trust",
        icon: "bi-shield-check"
      }
    ],
    hotspots: [
      { x: 50, y: 30, label: "Address Autocomplete", detail: "GPS geolocation + Google Places SDK" },
      { x: 50, y: 60, label: "Express Payment Tray", detail: "Apple Pay & Google Pay 1-touch" },
      { x: 50, y: 90, label: "Biometric Confirmation", detail: "FaceID / Fingerprint tokenized" }
    ],
    metrics: [
      { label: "Checkout Duration", value: "4.2s", change: "Fastest" },
      { label: "Cart Dropoff", value: "-41%", change: "Reduction" },
      { label: "Security Standard", value: "PCI-DSS L1", change: "Certified" }
    ],
    techStack: ["Apple Pay SDK", "Google Pay SDK", "Stripe Mobile SDK", "Razorpay Native"]
  },
  {
    id: "orders",
    title: "Live Order Tracking & Shipment Telemetry",
    shortTitle: "Order Tracking",
    subtitle: "Real-Time Courier Telemetry & Digital Invoicing",
    image: "/assets/img/mobile-app/mobile-orders.png",
    tagline: "Real-time delivery progress & automated support",
    description: "Live shipment tracking with step-by-step dispatch status, real-time courier telemetry, instant tax invoice PDF downloads, and integrated automated returns management.",
    features: [
      {
        title: "Live Shipment Telemetry",
        desc: "Persistent WebSocket connection providing real-time package waypoint updates and estimated delivery time.",
        tag: "Live Telemetry",
        icon: "bi-truck"
      },
      {
        title: "Digital Tax Invoices",
        desc: "Generates VAT/GST compliant vector PDF receipts locally on the device with 1-tap print and share.",
        tag: "PDF Engine",
        icon: "bi-file-earmark-pdf-fill"
      },
      {
        title: "Automated Return Logistics",
        desc: "Self-service return requests with automatic carrier pickup scheduling and printable QR return labels.",
        tag: "Reverse Logistics",
        icon: "bi-box-arrow-left"
      }
    ],
    hotspots: [
      { x: 30, y: 30, label: "Live Progress Stepper", detail: "Dispatched -> In Transit -> Out for Delivery" },
      { x: 74, y: 52, label: "Courier Telemetry", detail: "Live driver location & GPS milestone" },
      { x: 50, y: 86, label: "Download Tax Invoice", detail: "Instant offline PDF receipt generation" }
    ],
    metrics: [
      { label: "Update Interval", value: "Real-time", change: "Push" },
      { label: "Support Tickets", value: "-52%", change: "Drop" },
      { label: "Shopper CSAT", value: "98.7%", change: "Positive" }
    ],
    techStack: ["WebSockets", "PDFKit Mobile", "Logistics API", "Push Notifications"]
  }
];

export default function MobileAppGsapShowcase({ project }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoTour, setIsAutoTour] = useState(false);
  const [viewMode, setViewMode] = useState("3d"); // "3d" | "flat"
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [tourProgress, setTourProgress] = useState(0);

  const containerRef = useRef(null);
  const phoneWrapperRef = useRef(null);
  const screenImgRef = useRef(null);
  const detailsPanelRef = useRef(null);
  const autoTourIntervalRef = useRef(null);
  const progressAnimRef = useRef(null);

  const currentScreen = MOBILE_SCREENS[activeIndex];

  // GSAP Screen Change Transition
  const triggerScreenTransition = useCallback(
    (newIndex) => {
      setActiveIndex(newIndex);
      setActiveHotspot(null);

      if (typeof window === "undefined") return;

      const ctx = gsap.context(() => {
        // Animate the phone screen image
        if (screenImgRef.current) {
          gsap.fromTo(
            screenImgRef.current,
            { opacity: 0, scale: 0.94, filter: "brightness(1.4) blur(4px)" },
            {
              opacity: 1,
              scale: 1,
              filter: "brightness(1) blur(0px)",
              duration: 0.55,
              ease: "power3.out",
            }
          );
        }

        // Animate detail panel elements
        if (detailsPanelRef.current) {
          gsap.fromTo(
            detailsPanelRef.current.querySelectorAll(".mobile-anim-in"),
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: "power2.out" }
          );

          gsap.fromTo(
            detailsPanelRef.current.querySelectorAll(".mobile-metric-card"),
            { opacity: 0, scale: 0.88 },
            { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.5)" }
          );
        }

        // Animate hotspot pins
        gsap.fromTo(
          ".mobile-hotspot-marker",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: "elastic.out(1, 0.6)" }
        );
      }, containerRef);

      return () => ctx.revert();
    },
    []
  );

  // Auto-tour timer & progress bar
  useEffect(() => {
    if (!isAutoTour) {
      if (autoTourIntervalRef.current) clearInterval(autoTourIntervalRef.current);
      if (progressAnimRef.current) cancelAnimationFrame(progressAnimRef.current);
      setTourProgress(0);
      return;
    }

    const duration = 5000;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setTourProgress(pct);

      if (pct < 100 && isAutoTour) {
        progressAnimRef.current = requestAnimationFrame(updateProgress);
      }
    };

    progressAnimRef.current = requestAnimationFrame(updateProgress);

    autoTourIntervalRef.current = setTimeout(() => {
      const nextIdx = (activeIndex + 1) % MOBILE_SCREENS.length;
      triggerScreenTransition(nextIdx);
    }, duration);

    return () => {
      if (autoTourIntervalRef.current) clearTimeout(autoTourIntervalRef.current);
      if (progressAnimRef.current) cancelAnimationFrame(progressAnimRef.current);
    };
  }, [isAutoTour, activeIndex, triggerScreenTransition]);

  // Interactive 3D tilt tracking on mouse movement
  useEffect(() => {
    const el = containerRef.current;
    if (!el || viewMode !== "3d") {
      if (phoneWrapperRef.current) {
        gsap.to(phoneWrapperRef.current, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
      return;
    }

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(phoneWrapperRef.current, {
        rotationY: x * 18,
        rotationX: -y * 14,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
        duration: 0.35,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(phoneWrapperRef.current, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [viewMode]);

  // Gentle levitation breathing effect
  useEffect(() => {
    if (!phoneWrapperRef.current) return;
    const tween = gsap.to(phoneWrapperRef.current, {
      y: -8,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return () => tween.kill();
  }, []);

  const handleNext = () => {
    triggerScreenTransition((activeIndex + 1) % MOBILE_SCREENS.length);
  };

  const handlePrev = () => {
    triggerScreenTransition((activeIndex - 1 + MOBILE_SCREENS.length) % MOBILE_SCREENS.length);
  };

  return (
    <div
      ref={containerRef}
      className="mobile-gsap-showcase rounded-4 overflow-hidden mb-40 position-relative"
      style={{
        background: "radial-gradient(circle at 50% 0%, #170d36 0%, #090414 70%, #05020c 100%)",
        border: "1px solid rgba(0, 223, 216, 0.35)",
        boxShadow: "0 25px 80px rgba(0, 0, 0, 0.85), 0 0 40px rgba(0, 223, 216, 0.12)",
      }}
    >
      {/* Top Header Bar */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between px-3 py-2 border-bottom"
        style={{
          background: "linear-gradient(90deg, #12092a 0%, #1c0e3d 100%)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          minHeight: "52px",
        }}
      >
        {/* Left: Window Dots & App Label */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-1">
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F56", display: "inline-block" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E", display: "inline-block" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#27C93F", display: "inline-block" }} />
          </div>
          <span
            className="badge rounded-pill text-info d-inline-flex align-items-center gap-1"
            style={{
              background: "rgba(0, 223, 216, 0.12)",
              border: "1px solid rgba(0, 223, 216, 0.3)",
              fontSize: "11px",
              padding: "4px 10px",
            }}
          >
            <i className="bi bi-phone-fill text-info" />
            <span>NATIVE MOBILE APP RUNTIME</span>
          </span>
          <span className="text-white-50 small d-none d-md-inline" style={{ fontSize: "12px" }}>
            iOS 17+ • Android 14 • Flutter / React Native
          </span>
        </div>

        {/* Center: Deep-Link Address Bar */}
        <div
          className="d-none d-lg-flex align-items-center justify-content-center px-3 py-1 rounded-pill mx-2"
          style={{
            background: "rgba(0, 0, 0, 0.45)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            fontSize: "12px",
            color: "#94A3B8",
            maxWidth: "360px",
            width: "100%",
          }}
        >
          <i className="bi bi-shield-lock-fill text-success me-2" style={{ fontSize: "11px" }} />
          <span className="text-truncate">techwithjoshi://mobile-app/{currentScreen.id}</span>
        </div>

        {/* Right: Controls (3D tilt, Auto Tour, Lightbox, GitHub) */}
        <div className="d-flex align-items-center gap-2">
          {/* Auto Tour Toggle */}
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-2 py-1 d-flex align-items-center gap-1 ${
              isAutoTour ? "btn-info text-dark fw-bold" : "btn-outline-secondary text-white-50"
            }`}
            style={{ fontSize: "11px", height: "28px" }}
            onClick={() => setIsAutoTour(!isAutoTour)}
            title="Auto Tour"
          >
            <i className={`bi ${isAutoTour ? "bi-pause-fill" : "bi-play-fill"}`} />
            <span className="d-none d-sm-inline">{isAutoTour ? "Pause Tour" : "Auto Tour"}</span>
          </button>

          {/* 3D vs Flat View Toggle */}
          <div
            className="btn-group btn-group-sm rounded-pill p-0"
            style={{ background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <button
              type="button"
              className={`btn btn-sm py-0 px-2 rounded-pill ${
                viewMode === "3d" ? "btn-info text-dark fw-bold" : "text-white-50"
              }`}
              style={{ fontSize: "11px", height: "26px" }}
              onClick={() => setViewMode("3d")}
              title="3D Tilt View"
            >
              3D Tilt
            </button>
            <button
              type="button"
              className={`btn btn-sm py-0 px-2 rounded-pill ${
                viewMode === "flat" ? "btn-info text-dark fw-bold" : "text-white-50"
              }`}
              style={{ fontSize: "11px", height: "26px" }}
              onClick={() => setViewMode("flat")}
              title="Flat View"
            >
              Flat
            </button>
          </div>

          {/* Lightbox / Zoom */}
          <button
            type="button"
            className="btn btn-sm btn-outline-info rounded-pill py-0 px-2 d-flex align-items-center gap-1"
            style={{ fontSize: "11px", height: "28px" }}
            onClick={() => setLightboxOpen(true)}
            title="Inspect High-Res Screen"
          >
            <i className="bi bi-arrows-fullscreen" />
            <span className="d-none d-md-inline">Zoom</span>
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/DHANESHJOSHI/company-techwithjoshi"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-light rounded-pill py-0 px-2 d-flex align-items-center gap-1"
            style={{ fontSize: "11px", height: "28px" }}
            title="View Source on GitHub"
          >
            <i className="bi bi-github" />
            <span className="d-none d-lg-inline">GitHub</span>
          </a>
        </div>
      </div>

      {/* Auto Tour Progress Indicator */}
      {isAutoTour && (
        <div style={{ width: "100%", height: "3px", background: "rgba(255,255,255,0.06)" }}>
          <div
            style={{
              width: `${tourProgress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #00DFD8, #8B5CF6)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="p-4 p-lg-5 position-relative">
        {/* Ambient Glowing Orbs in background */}
        <div
          className="position-absolute"
          style={{
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 223, 216, 0.14) 0%, rgba(0, 0, 0, 0) 70%)",
            top: "10%",
            left: "5%",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          className="position-absolute"
          style={{
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(0, 0, 0, 0) 70%)",
            bottom: "10%",
            right: "10%",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="row g-4 align-items-center position-relative" style={{ zIndex: 1 }}>
          {/* Left Column: 3D Animated Phone Mockup */}
          <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center">
            {/* Phone Container with GSAP 3D Transform */}
            <div
              ref={phoneWrapperRef}
              className="position-relative"
              style={{
                width: "100%",
                maxWidth: "460px",
                transformStyle: "preserve-3d",
                transition: viewMode === "flat" ? "transform 0.4s ease" : "none",
                cursor: "pointer",
              }}
              onClick={() => setLightboxOpen(true)}
              title="Click to zoom in high resolution"
            >
              {/* Outer Phone Hardware Bezel */}
              <div
                className="rounded-5 p-2 position-relative"
                style={{
                  background: "linear-gradient(145deg, #2a2046 0%, #0d061f 50%, #1e1338 100%)",
                  boxShadow:
                    "0 30px 70px rgba(0, 0, 0, 0.9), 0 0 0 2px rgba(255, 255, 255, 0.1), 0 0 35px rgba(0, 223, 216, 0.25)",
                  border: "1px solid rgba(0, 223, 216, 0.4)",
                  overflow: "hidden",
                }}
              >
                {/* Dynamic Island / Top Speaker Notch */}
                <div
                  className="position-absolute top-0 start-50 translate-middle-x mt-2 rounded-pill d-flex align-items-center justify-content-center px-3"
                  style={{
                    width: "110px",
                    height: "18px",
                    background: "#05020c",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    zIndex: 5,
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#161b22",
                      border: "1px solid #30363d",
                    }}
                  />
                  <div
                    className="ms-2"
                    style={{
                      width: "30px",
                      height: "3px",
                      borderRadius: "2px",
                      background: "#21262d",
                    }}
                  />
                </div>

                {/* Inner Screen Display Viewport */}
                <div
                  className="rounded-4 overflow-hidden position-relative"
                  style={{
                    background: "#080411",
                    minHeight: "360px",
                    maxHeight: "520px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Screen Image with GSAP Transition */}
                  <img
                    ref={screenImgRef}
                    src={currentScreen.image}
                    alt={currentScreen.title}
                    className="img-fluid w-100"
                    style={{
                      objectFit: "contain",
                      maxHeight: "520px",
                      display: "block",
                      userSelect: "none",
                    }}
                  />

                  {/* Interactive Hotspot Radar Pins */}
                  {currentScreen.hotspots.map((hs, hIdx) => {
                    const isSelected = activeHotspot === hIdx;
                    return (
                      <div
                        key={hIdx}
                        className="mobile-hotspot-marker position-absolute"
                        style={{
                          top: `${hs.y}%`,
                          left: `${hs.x}%`,
                          transform: "translate(-50%, -50%)",
                          zIndex: 10,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspot(isSelected ? null : hIdx);
                        }}
                      >
                        <div
                          className="position-relative d-flex align-items-center justify-content-center"
                          style={{ cursor: "pointer" }}
                        >
                          {/* Pulsing Radar Ring */}
                          <div
                            className="position-absolute rounded-circle"
                            style={{
                              width: "28px",
                              height: "28px",
                              background: "rgba(0, 223, 216, 0.35)",
                              animation: "hotspotPulse 2s infinite ease-out",
                            }}
                          />
                          {/* Center Pin Button */}
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-dark fw-bold"
                            style={{
                              width: "18px",
                              height: "18px",
                              background: isSelected ? "#FFFFFF" : "#00DFD8",
                              boxShadow: "0 0 12px #00DFD8",
                              fontSize: "10px",
                              zIndex: 2,
                            }}
                          >
                            {hIdx + 1}
                          </div>

                          {/* Hover/Click Tooltip Bubble */}
                          {isSelected && (
                            <div
                              className="position-absolute p-2 rounded-3 text-start"
                              style={{
                                bottom: "130%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: "rgba(14, 9, 27, 0.95)",
                                border: "1px solid #00DFD8",
                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.8)",
                                width: "190px",
                                fontSize: "11px",
                                zIndex: 20,
                                backdropFilter: "blur(8px)",
                              }}
                            >
                              <div className="fw-bold text-info mb-1">{hs.label}</div>
                              <div className="text-white-50 small" style={{ lineHeight: 1.4 }}>
                                {hs.detail}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* High-Res Zoom Hint Overlay on hover */}
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-2 text-center"
                    style={{
                      background: "linear-gradient(to top, rgba(8, 4, 17, 0.9) 0%, rgba(8, 4, 17, 0) 100%)",
                      fontSize: "11px",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <i className="bi bi-arrows-angle-expand me-1 text-info" /> Click screen for full 1570×1222 high-res view
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Angle / Perspective Indicators */}
            <div className="d-flex align-items-center gap-3 mt-3">
              <span className="text-white-50 small" style={{ fontSize: "11px" }}>
                <i className="bi bi-arrows-move me-1 text-info" />
                {viewMode === "3d" ? "Hover / move cursor to tilt in 3D" : "Flat alignment mode active"}
              </span>
            </div>
          </div>

          {/* Right Column: Screen Feature Details & Architecture */}
          <div ref={detailsPanelRef} className="col-lg-6">
            {/* Screen Pagination & Tag */}
            <div className="d-flex align-items-center justify-content-between mb-3 mobile-anim-in">
              <span
                className="badge px-3 py-1 rounded-pill"
                style={{
                  background: "linear-gradient(135deg, rgba(0, 223, 216, 0.2), rgba(139, 92, 246, 0.2))",
                  border: "1px solid rgba(0, 223, 216, 0.35)",
                  color: "#00DFD8",
                  fontSize: "11px",
                  letterSpacing: "0.5px",
                }}
              >
                FEATURE SCREEN 0{activeIndex + 1} OF 06
              </span>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: "32px", height: "32px", borderColor: "rgba(255,255,255,0.15)" }}
                  onClick={handlePrev}
                  title="Previous Screen"
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-info rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "32px", height: "32px" }}
                  onClick={handleNext}
                  title="Next Screen"
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            </div>

            {/* Title & Tagline */}
            <h2
              className="fw-bold text-white mb-2 mobile-anim-in"
              style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: "1.25" }}
            >
              {currentScreen.title}
            </h2>
            <p className="text-info small fw-bold mb-3 mobile-anim-in" style={{ fontSize: "13px" }}>
              ✦ {currentScreen.subtitle}
            </p>
            <p className="mobile-anim-in" style={{ color: "#94A3B8", fontSize: "14px", lineHeight: "1.7" }}>
              {currentScreen.description}
            </p>

            {/* Feature Bullets with Icons */}
            <div className="d-flex flex-column gap-2 mb-4">
              {currentScreen.features.map((feat, fIdx) => (
                <div
                  key={fIdx}
                  className="p-3 rounded-3 mobile-anim-in"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    transition: "all 0.25s ease",
                  }}
                >
                  <div className="d-flex align-items-start gap-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mt-1 flex-shrink-0"
                      style={{
                        width: "28px",
                        height: "28px",
                        background: "rgba(0, 223, 216, 0.15)",
                        border: "1px solid rgba(0, 223, 216, 0.3)",
                        color: "#00DFD8",
                        fontSize: "12px",
                      }}
                    >
                      <i className={`bi ${feat.icon || "bi-check2"}`} />
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <strong className="text-white" style={{ fontSize: "14px" }}>
                          {feat.title}
                        </strong>
                        <span
                          className="badge rounded-pill"
                          style={{
                            background: "rgba(139, 92, 246, 0.15)",
                            color: "#C4B5FD",
                            fontSize: "10px",
                          }}
                        >
                          {feat.tag}
                        </span>
                      </div>
                      <p className="text-white-50 small mb-0" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Performance Telemetry Grid */}
            <div className="row g-2 mb-4">
              {currentScreen.metrics.map((m, mIdx) => (
                <div key={mIdx} className="col-4">
                  <div
                    className="mobile-metric-card p-2 p-md-3 rounded-3 text-center h-100"
                    style={{
                      background: "linear-gradient(180deg, rgba(20, 12, 45, 0.7) 0%, rgba(10, 5, 25, 0.9) 100%)",
                      border: "1px solid rgba(0, 223, 216, 0.2)",
                    }}
                  >
                    <div className="text-white-50" style={{ fontSize: "11px" }}>
                      {m.label}
                    </div>
                    <div className="fw-bold text-info my-1" style={{ fontSize: "16px" }}>
                      {m.value}
                    </div>
                    <span
                      className="badge rounded-pill"
                      style={{ background: "rgba(39, 201, 63, 0.15)", color: "#27C93F", fontSize: "9px" }}
                    >
                      {m.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tech Stack Chips */}
            <div className="d-flex flex-wrap align-items-center gap-1">
              <span className="text-white-50 small me-2" style={{ fontSize: "11px" }}>
                Architecture:
              </span>
              {currentScreen.techStack.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="badge rounded-pill"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#CBD5E1",
                    fontSize: "11px",
                    padding: "4px 8px",
                  }}
                >
                  ✦ {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Thumbnail Strip - Quick Screen Navigation */}
        <div className="mt-4 pt-3 border-top" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-white-50 small" style={{ fontSize: "12px" }}>
              <i className="bi bi-collection-play me-1 text-info" /> Switch Screen Experience (Click to Inspect):
            </span>
            <span className="text-info small fw-bold" style={{ fontSize: "12px" }}>
              {activeIndex + 1} / {MOBILE_SCREENS.length}
            </span>
          </div>

          <div
            className="d-flex gap-2 pb-2 overflow-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(0, 223, 216, 0.3) transparent",
            }}
          >
            {MOBILE_SCREENS.map((screen, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={screen.id}
                  type="button"
                  onClick={() => triggerScreenTransition(idx)}
                  className="btn p-1 rounded-3 text-start d-flex align-items-center gap-2 flex-shrink-0"
                  style={{
                    background: isActive ? "rgba(0, 223, 216, 0.12)" : "rgba(255, 255, 255, 0.03)",
                    border: isActive ? "1px solid #00DFD8" : "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: isActive ? "0 0 15px rgba(0, 223, 216, 0.3)" : "none",
                    minWidth: "160px",
                    maxWidth: "200px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <img
                    src={screen.image}
                    alt={screen.title}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "6px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="text-truncate">
                    <div
                      className="text-truncate fw-bold"
                      style={{
                        fontSize: "12px",
                        color: isActive ? "#00DFD8" : "#E2E8F0",
                      }}
                    >
                      {screen.shortTitle}
                    </div>
                    <div className="text-white-50 text-truncate" style={{ fontSize: "10px" }}>
                      Screen 0{idx + 1}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* High-Res Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="position-fixed inset-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999999,
            background: "rgba(5, 2, 12, 0.96)",
            backdropFilter: "blur(12px)",
          }}
          onClick={() => setLightboxOpen(false)}
        >
          {/* Modal Header */}
          <div
            className="d-flex align-items-center justify-content-between w-100 px-4 py-3"
            style={{ maxWidth: "1200px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h5 className="text-white fw-bold mb-0">{currentScreen.title}</h5>
              <span className="text-info small">{currentScreen.subtitle} • High-Resolution 1570×1222 Capture</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-info rounded-pill px-3"
                onClick={handlePrev}
              >
                &larr; Prev Screen
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-info rounded-pill px-3"
                onClick={handleNext}
              >
                Next Screen &rarr;
              </button>
              <button
                type="button"
                className="btn btn-close btn-close-white ms-2"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close"
              />
            </div>
          </div>

          {/* Lightbox Image Preview */}
          <div
            className="d-flex align-items-center justify-content-center p-2 rounded-4 overflow-hidden"
            style={{
              maxWidth: "1100px",
              maxHeight: "80vh",
              background: "#080411",
              border: "1px solid rgba(0, 223, 216, 0.4)",
              boxShadow: "0 25px 70px rgba(0,0,0,0.9)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentScreen.image}
              alt={currentScreen.title}
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: "12px",
              }}
            />
          </div>

          <p className="text-white-50 small mt-3">
            Press ESC or click anywhere outside the preview to close
          </p>
        </div>
      )}

      {/* CSS Keyframes for Pulsing Radar Hotspots */}
      <style jsx global>{`
        @keyframes hotspotPulse {
          0% {
            transform: scale(0.6);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.6);
            opacity: 0.3;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
