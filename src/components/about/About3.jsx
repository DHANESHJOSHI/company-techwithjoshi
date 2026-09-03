import { useRouter } from 'next/router';
import React from 'react';
import { useCMS } from "@/hooks/useCMS";

const DEFAULT_ABOUT = {
  badge: "Our Approach",
  subtitle: "We engineer end-to-end digital solutions that bridge technical complexity with high-growth business impact, designed to scale with your architecture.",
  title: "Architecting High-Impact Digital Ecosystems.",
  description: "Our engineering teams craft tailored cloud solutions, enterprise-grade AI models, and modern web platforms. We align state-of-the-art tech stacks with your strategic roadmap to ensure resilience, security, and exponential scalability.",
  yearsCount: "5yr",
  yearsLabel: "Excellence",
  feature1Title: "Full-Stack Precision",
  feature1Desc: "Production-ready architectures built for agility, security, and speed.",
  feature2Title: "Enterprise Reliability",
  feature2Desc: "99.99% uptime systems backed by proactive monitoring and DevSecOps.",
  image1: "assets/img/home-3/home3-about-1.png",
  image2: "assets/img/home-3/home3-about-2.png",
  stats: [
    { number: "5+", label: "Years of Excellence", icon: "bi-trophy" },
    { number: "150+", label: "Enterprise Projects", icon: "bi-check2-circle" },
    { number: "99.9%", label: "Uptime SLA", icon: "bi-shield-check" },
    { number: "24/7", label: "Dedicated Support", icon: "bi-headset" }
  ]
};

function About3() {
  const currentRoute = useRouter().pathname;
  const { data: cmsAbout } = useCMS("about");
  const about = cmsAbout && cmsAbout.title ? cmsAbout : DEFAULT_ABOUT;
  const statsList = Array.isArray(about.stats) && about.stats.length > 0 ? about.stats : DEFAULT_ABOUT.stats;

  return (
    <div className={`home3-about-section ${currentRoute === "/about" ? "sec-mar" : ""}`}>
      <div className="container-fluid">
        <div className="row g-lg-4 gy-5">
          <div className="col-lg-9">
            <div className="section-title-3 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
              <h2>{about.badge || "Our Approach"}</h2>
              <p>{about.subtitle}</p>
            </div>
            <div className="about-left">
              <div className="about-img wow animate fadeInUp" data-wow-delay="300ms" data-wow-duration="1500ms">
                <img className="img-fluid magnetic-item" src={about.image1 || "assets/img/home-3/home3-about-1.png"} alt="About Our Engineering Team" />
              </div>
              <div className="about-content wow animate fadeInUp" data-wow-delay="400ms" data-wow-duration="1500ms">
                <h2>{about.title}</h2>
                <p>{about.description}</p>
                <div className="devider" />
                <ul className="about-feature">
                  <li>
                    <h5>{about.feature1Title || "Full-Stack Precision"}</h5>
                    <p>{about.feature1Desc || "Production-ready architectures built for agility, security, and speed."}</p>
                  </li>
                  <li>
                    <h5>{about.feature2Title || "Enterprise Reliability"}</h5>
                    <p>{about.feature2Desc || "99.99% uptime systems backed by proactive monitoring and DevSecOps."}</p>
                  </li>
                </ul>

                {/* Multiple Dynamic Stats Badges from Admin */}
                <div className="row g-3 mt-4 about-stats-row">
                  {statsList.map((stat, sIdx) => (
                    <div key={sIdx} className="col-6 col-md-3 d-flex">
                      <div className="about-stat-box">
                        <div className="stat-number">
                          {stat.number}
                        </div>
                        <div className="stat-label">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="about-right">
              <div className="about-img wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                <img className="img-fluid magnetic-item" src={about.image2 || "assets/img/home-3/home3-about-2.png"} alt="Office Tech Workspace" />
              </div>
              <div className="about-exprience wow animate fadeInUp" data-wow-delay="300ms" data-wow-duration="1500ms">
                <div className="exp-text">
                  <img src="/assets/img/home-3/rotate-text.svg?v=2" alt="5 Years of Excellence" />
                </div>
                <div className="years">
                  <h2>{about.yearsCount || "5yr"}</h2>
                  <span>{about.yearsLabel || "Excellence"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About3;
