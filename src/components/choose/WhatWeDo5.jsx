import React from 'react'
import Marquee from "react-fast-marquee";
function WhatWeDo5() {
  return (
    <div className="home5-process-area mb-130">
    <div className="container">
      <div className="row mb-55 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
        <div className="col-lg-12 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="section-title-5">
            <span>THE PROCESS</span>
            <h2>What We Do</h2>
          </div>
          <div className="section-content">
            <p>Our disciplined agile engineering methodology ensures transparent communication, rapid shipping, and scalable code.</p>
          </div>
        </div>
      </div>
      <div className="row g-lg-4 gy-5 justify-content-center">
        <div className="col-lg-4 col-sm-6 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="single-process">
            <div className="sl">
              <h2>01</h2>
            </div>
            <div className="content">
              <h3>Research &amp; Discovery</h3>
              <p>We analyze system constraints, API dependencies, and user experience flows to draft resilient architecture roadmaps.</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6 wow animate fadeInUp" data-wow-delay="300ms" data-wow-duration="1500ms">
          <div className="single-process">
            <div className="sl">
              <h2>02</h2>
            </div>
            <div className="content">
              <h3>Industry Expertise</h3>
              <p>Our seasoned software engineers implement cutting-edge stacks across Next.js, Python, Node.js, and cloud Kubernetes.</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6 wow animate fadeInUp" data-wow-delay="400ms" data-wow-duration="1500ms">
          <div className="single-process">
            <div className="sl">
              <h2>03</h2>
            </div>
            <div className="content">
              <h3>Quality Assurance</h3>
              <p>Automated CI/CD test suites, static vulnerability scans, and performance benchmarks guarantee flawless deployment.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="achievement-area mb-80">
        <div className="row g-lg-4 gy-5">
          <div className="col-xl-7 col-lg-6 d-flex align-items-center wow animate fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="achievement-content">
              <h2>#1</h2>
              <h3>Best IT Agency Services And Solutions Company <span>Since <span className="year">2024.</span></span></h3>
            </div>
          </div>
          <div className="col-xl-5 col-lg-6 wow animate fadeInRight" data-wow-delay="300ms" data-wow-duration="1500ms">
            <div className="achievement-img magnetic-item">
              <img className="img-fluid" src="assets/img/home-5/achievement-img.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="achievement-text-slider">
        <Marquee speed={40} gradient={false}>
          <h2 className="marquee_text2">
            Enterprise Architecture <span>✦</span> Scalable Cloud Systems <span>✦</span> AI Automation &amp; LLMs <span>✦</span> Modern Web &amp; Mobile Apps <span>✦</span> 99.99% Uptime SLA <span>✦</span> TechWithJoshi Private Limited <span>✦</span> 
          </h2>
        </Marquee>
      </div>
    </div>
  </div>
  )
}

export default WhatWeDo5
