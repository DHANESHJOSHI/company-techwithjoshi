import React, { useState } from 'react';
import Link from 'next/link';
import { useCMS } from '@/hooks/useCMS';

const DEFAULT_PRICING = [
  {
    id: "tier-1",
    title: "MVP Sprint",
    price: "1,499",
    yearlyPrice: "1,199",
    period: "month",
    description: "Ideal for early-stage startups needing a rapid, production-grade MVP prototype in 2-4 weeks.",
    features: [
      "Complete UI/UX Prototype",
      "Next.js Modern Frontend",
      "MongoDB / PostgreSQL Backend",
      "REST & GraphQL APIs",
      "Standard Cloud Deployment",
      "14 Days Post-Launch Support"
    ],
    isPopular: false,
    link: "/contact"
  },
  {
    id: "tier-2",
    title: "Dedicated Squad",
    price: "3,899",
    yearlyPrice: "3,199",
    period: "month",
    description: "A fully dedicated full-stack engineering team with senior architecture and DevSecOps leadership.",
    features: [
      "Senior Full-Stack Engineers",
      "AI / LLM Model Integration",
      "Custom Cloud CI/CD Pipelines",
      "High-Concurrency Performance",
      "Real-Time Monitoring & Telemetry",
      "24/7 Priority Engineering SLA"
    ],
    isPopular: true,
    link: "/contact"
  },
  {
    id: "tier-3",
    title: "Enterprise Studio",
    price: "7,500",
    yearlyPrice: "5,999",
    period: "month",
    description: "End-to-end digital transformation, security compliance, distributed microservices, and custom AI.",
    features: [
      "Principal Solutions Architect",
      "Zero-Trust Cloud Governance",
      "Custom Distributed Microservices",
      "Dedicated AI Research & R&D",
      "Enterprise SOC2 & GDPR Compliance",
      "Dedicated 24/7 Engineering Support"
    ],
    isPopular: false,
    link: "/contact"
  }
];

function PricingPlan3() {
  const [isYearly, setIsYearly] = useState(false);
  const { data: cmsData } = useCMS("pricing");
  const plans = (cmsData && cmsData.items && cmsData.items.length > 0) ? cmsData.items : DEFAULT_PRICING;
  const sectionTitle = cmsData?.title || "Choose Your Plan";
  const sectionSubtitle = cmsData?.subtitle || "Flexible, transparent engineering subscriptions and SLA-backed plans tailored for high-growth startups and established enterprises.";

  return (
    <div className="home3-pricing-plan-area sec-mar">
      <div className="container">
        <div className="row mb-55 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-12 d-flex align-items-center justify-content-between gap-4 flex-wrap">
            <div className="section-title-3">
              <h2>{sectionTitle}</h2>
              <p>{sectionSubtitle}</p>
            </div>
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className={`nav-link ${!isYearly ? "active" : ""}`}
                  type="button"
                  onClick={() => setIsYearly(false)}
                >
                  Billed Monthly
                </button>
                <button
                  className={`nav-link ${isYearly ? "active" : ""}`}
                  type="button"
                  onClick={() => setIsYearly(true)}
                >
                  Billed Yearly (20% Off)
                </button>
              </div>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="row g-lg-4 g-4 align-items-center justify-content-center">
              {plans.map((plan, idx) => (
                <div
                  key={plan.id || idx}
                  className="col-xl-4 col-md-6 wow animate fadeInUp"
                  data-wow-delay={`${200 + idx * 100}ms`}
                  data-wow-duration="1500ms"
                >
                  <div className={`pricing-card ${plan.isPopular ? "active" : ""}`} style={{ position: "relative", minHeight: "520px" }}>
                    {plan.isPopular && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-12px",
                          right: "24px",
                          background: "linear-gradient(135deg, #7928ca, #00dfd8)",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "700",
                          padding: "4px 14px",
                          borderRadius: "20px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Most Popular
                      </span>
                    )}
                    <div className="pricing-top">
                      <div className="left">
                        <span>{plan.title}</span>
                        <h2>
                          <sup>$</sup>
                          {isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                          <sub>/{plan.period || "mo"}</sub>
                        </h2>
                      </div>
                      <div className="right">
                        <img src={`assets/img/home-3/pricing-vec${(idx % 3) + 1}.svg`} alt="" />
                      </div>
                    </div>
                    <div className="pricing-content">
                      <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "20px" }}>
                        {plan.description}
                      </p>
                      <ul style={{ minHeight: "180px" }}>
                        {Array.isArray(plan.features) &&
                          plan.features.map((feat, fIdx) => (
                            <li key={fIdx}>
                              <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: "16px" }}>
                                <circle cx={8} cy={8} r={8} fill="rgba(0, 223, 216, 0.2)" />
                                <path d="M6.34172 12.8L6.28743 12.6983C5.45809 11.1441 3.25425 7.84599 3.23199 7.81286L3.2002 7.76536L3.95103 6.94922L6.32778 8.77458C7.82424 6.63876 9.22034 5.17178 10.131 4.31512C11.1272 3.37803 12.7936 3.20415 12.8002 3.20001C9.6713 6.26525 6.42863 12.632 6.39485 12.6975L6.34172 12.8Z" fill="#00dfd8" />
                              </svg>
                              {feat}
                            </li>
                          ))}
                      </ul>
                      <div className="pricing-btn" style={{ marginTop: "25px" }}>
                        <Link legacyBehavior href={plan.link || "/contact"}>
                          <a className={plan.isPopular ? "primary-btn3" : "primary-btn4"} style={{ width: "100%", textAlign: "center", display: "block" }}>
                            <span>
                              <svg width={13} height={13} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 1H12M12 1V13M12 1L0.5 12" />
                              </svg>
                            </span>
                            Choose Plan
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPlan3;
