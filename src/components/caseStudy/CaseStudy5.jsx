import Link from "next/link";
import React, { useState, useEffect } from "react";

const INITIAL_CASES = [
  {
    slug: "enterprise-headless-ecommerce-platform",
    title: "Enterprise Headless E-Commerce & Multi-Channel Platform",
    category: "Headless E-Commerce",
    image: "/assets/img/home-5/home5-case-01.png?v=5",
  },
  {
    slug: "building-scalable-cloud-infrastructure",
    title: "Building a Scalable Cloud Infrastructure",
    category: "Cloud & DevOps",
    image: "/assets/img/home-5/home5-case-02.png?v=5",
  },
  {
    slug: "leveraging-data-analytics-for-business-insights",
    title: "Leveraging Data Analytics for Business Insights",
    category: "Data & AI",
    image: "/assets/img/home-5/home5-case-03.png?v=5",
  },
  {
    slug: "optimizing-it-infrastructure-for-cost-efficiency",
    title: "Optimizing IT Infrastructure for Cost Efficiency",
    category: "DevSecOps",
    image: "/assets/img/home-5/home5-case-04.png?v=5",
  },
];

function CaseStudy5() {
  const [cases, setCases] = useState(INITIAL_CASES);

  useEffect(() => {
    fetch("/api/case-studies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCases(data.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="home5-case-study mb-130">
      <div className="container">
        <div
          className="row mb-55 wow animate fadeInUp"
          data-wow-delay="200ms"
          data-wow-duration="1500ms"
        >
          <div className="col-lg-12 d-flex align-items-center justify-content-between flex-wrap gap-4">
            <div className="section-title-5">
              <span>CASE STUDY</span>
              <h2>Success Stories</h2>
            </div>
            <div className="view-all-btn">
              <Link legacyBehavior href="/case-study">
                <a className="primary-btn3">View All Case</a>
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            {cases.map((item, idx) => (
              <div
                key={item.slug || idx}
                className="single-case-study wow animate fadeInUp"
                data-wow-delay={`${(idx + 2) * 100}ms`}
                data-wow-duration="1500ms"
              >
                <div className="row g-4">
                  <div className="col-lg-5 d-flex align-items-center">
                    <div className="case-study-content">
                      <span>{item.category || "Case Study"}</span>
                      <h3>
                        <Link legacyBehavior href={`/case-study-details?slug=${item.slug}`}>
                          <a>{item.title}</a>
                        </Link>
                      </h3>
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="case-study-img-and-btn">
                      <div className="case-img magnetic-item">
                        <img
                          className="img-fluid"
                          src={item.image || "/assets/img/home-5/home5-case-01.png?v=5"}
                          alt={item.title}
                        />
                      </div>
                      <div className="learn-more-btn">
                        <Link legacyBehavior href={`/case-study-details?slug=${item.slug}`}>
                          <a className="primary-btn8">
                            <svg
                              width={12}
                              height={12}
                              viewBox="0 0 13 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M0 1H12M12 1V13M12 1L0.5 12" />
                            </svg>
                            LEARN MORE
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseStudy5;
