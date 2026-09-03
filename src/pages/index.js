import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import useBodyClass from "@/hooks/useBodyClass";
import Sidebar from "@/components/common/Sidebar";
import Bannder5 from "@/components/bannner/Bannder5";
import About5 from "@/components/about/About5";
import Service5 from "@/components/services/Service5";
import WhatWeDo5 from "@/components/choose/WhatWeDo5";
import Partner5 from "@/components/partner/Partner5";
import CaseStudy5 from "@/components/caseStudy/CaseStudy5";
import Testimonial5 from "@/components/testimonial/Testimonial5";
import Award5 from "@/components/award/Award5";
import Home5Team from "@/components/Team/Home5Team";
import Home5Blog from "@/components/blog/Home5Blog";
import Footer5 from "@/components/footer/Footer5";

export default function Home() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useBodyClass("bg-dark-5");
  return (
    <>
      <Head>
        <title>
          TechWithJoshi - Enterprise Software Agency, AI &amp; Cloud Solutions
        </title>
        <meta
          name="description"
          content="TechWithJoshi is an elite digital software engineering agency building enterprise web apps, AI systems, and cloud architectures."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/img/techwithjoshi-icon.svg" />
      </Head>

      <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <div className="main-container">
        <div className="sidebar-wrapper">
          <div className="header-logo">
            <Link legacyBehavior href="/">
              <a>
                <img src="/assets/img/techwithjoshi-icon.svg?v=5" alt="TechWithJoshi" style={{ height: "42px", width: "42px" }} />
              </a>
            </Link>
          </div>
          <div className="sidebar-button mobile-menu-btn" onClick={toggleMenu} style={{ cursor: "pointer" }}>
            <span />
          </div>
          <div className="header-btn">
            <Link legacyBehavior href="/contact">
              <a className="primary-btn6">Book Call</a>
            </Link>
          </div>
        </div>

        <div className="main-content">
          <header className="header5 d-lg-none d-flex align-items-center justify-content-between">
            <div className="header-logo">
              <Link legacyBehavior href="/">
                <a>
                  <img src="/assets/img/techwithjoshi-logo.svg?v=4" alt="TechWithJoshi" style={{ height: "36px", width: "auto" }} />
                </a>
              </Link>
            </div>
            <button
              type="button"
              aria-label="Toggle Navigation Menu"
              className={`sidebar-button mobile-menu-btn2 ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              style={{
                cursor: "pointer",
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "12px",
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0
              }}
            >
              <span style={{ pointerEvents: "none" }} />
            </button>
          </header>

          <Bannder5 />
          <About5 />
          <Service5 />
          <WhatWeDo5 />
          <Partner5 />
          <CaseStudy5 />
          <Testimonial5 />
          <Award5 />
          <Home5Team />
          <Home5Blog />
          <Footer5 />
        </div>
      </div>
    </>
  );
}
