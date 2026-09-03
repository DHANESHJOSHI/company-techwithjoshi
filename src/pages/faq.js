import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";
import React, { useState, useEffect } from "react";

const DEFAULT_FAQS = [
  {
    question: "What core technologies and tech stacks do you specialize in?",
    answer: "We specialize in modern, high-performance web and cloud ecosystems. Our primary stacks include React, Next.js, Node.js, Python, TypeScript, Docker, Kubernetes, AWS, GCP, and MongoDB/PostgreSQL. We also engineer custom artificial intelligence workflows using modern LLMs, vector embeddings, and autonomous agent frameworks.",
    category: "Technology"
  },
  {
    question: "How do you ensure system scalability and high uptime?",
    answer: "All our architectures follow cloud-native best practices: multi-region deployments, automated load balancing, stateless container services, caching layers (Redis/Cloudflare Edge), and rigorous CI/CD test automation. We establish 99.99% SLA guarantees with 24/7 telemetry and APM monitoring.",
    category: "Architecture"
  },
  {
    question: "Can TechWithJoshi build and deploy custom AI agents for our business?",
    answer: "Yes, absolutely. We architect custom AI agents capable of reasoning, utilizing tools, interacting with internal databases via Retrieval-Augmented Generation (RAG), and executing complex multi-step workflows while keeping your company data completely private and sandboxed.",
    category: "AI & ML"
  },
  {
    question: "What is your typical project delivery timeline and process?",
    answer: "For MVP prototypes and initial product launches, we operate in rapid 2-4 week sprints. For enterprise scale systems, we provide dedicated agile squads with weekly sprint demos, continuous delivery, direct Slack/Teams engineering channels, and transparent code reviews.",
    category: "Process"
  },
  {
    question: "How do we get started or schedule an architecture consultation?",
    answer: "You can schedule a direct 30-minute discovery consultation using our Cal.com booking link (https://cal.com/dhanesh-joshi/30min), chat with us on WhatsApp (+91 7623897036), or submit your project details via our contact page. We typically respond within 2-4 business hours.",
    category: "Consulting"
  }
];

function FaqPage() {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/faqs")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setFaqs(data);
        }
      })
      .catch((err) => console.error("Error fetching FAQs:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      <Breadcrumb
        pageList="FAQs"
        title="Frequently Asked Questions"
        pageName="FAQS"
      />
      <div className="faq-page sec-mar">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="accordion" id="accordionFaq">
                {faqs.map((faq, idx) => (
                  <div
                    key={faq._id || idx}
                    className="accordion-item mb-4"
                    style={{
                      background: "rgba(18, 12, 36, 0.75)",
                      border: openIndex === idx ? "1px solid #00dfd8" : "1px solid rgba(121, 40, 202, 0.25)",
                      borderRadius: "14px",
                      overflow: "hidden",
                    }}
                  >
                    <h2 className="accordion-header" id={`heading-${idx}`}>
                      <button
                        className={`accordion-button ${openIndex === idx ? "" : "collapsed"}`}
                        type="button"
                        onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                        style={{
                          background: openIndex === idx ? "rgba(121, 40, 202, 0.25)" : "transparent",
                          color: "#ffffff",
                          fontSize: "17px",
                          fontWeight: "700",
                          padding: "20px 24px",
                          boxShadow: "none",
                        }}
                      >
                        <span style={{ color: "#00dfd8", marginRight: "12px" }}>
                          #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      id={`collapse-${idx}`}
                      className={`accordion-collapse collapse ${openIndex === idx ? "show" : ""}`}
                    >
                      <div
                        className="accordion-body"
                        style={{
                          color: "#cbd5e1",
                          fontSize: "15px",
                          lineHeight: 1.7,
                          padding: "0 24px 24px 24px",
                        }}
                      >
                        {faq.answer}
                        {faq.category && (
                          <div style={{ marginTop: "14px" }}>
                            <span
                              style={{
                                background: "rgba(0, 223, 216, 0.15)",
                                color: "#00dfd8",
                                fontSize: "11px",
                                fontWeight: "700",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                textTransform: "uppercase",
                              }}
                            >
                              {faq.category}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FaqPage;
