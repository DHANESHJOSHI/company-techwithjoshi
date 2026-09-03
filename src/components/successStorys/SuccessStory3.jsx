import React, { useMemo, useState, useEffect } from "react";
import SwiperCore, { Autoplay, EffectFade, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useCMS } from "@/hooks/useCMS";

SwiperCore.use([Pagination, Autoplay, EffectFade]);

const DEFAULT_CASE_STUDIES = [
  {
    id: "cs-1",
    title: "Streamlining Enterprise IT Infrastructure",
    category: "Cloud Architecture",
    image: "assets/img/home-3/home3-suc-sto-01.png",
    link: "/project-details"
  },
  {
    id: "cs-2",
    title: "Transforming SaaS Customer Experience",
    category: "Next.js Web App",
    image: "assets/img/home-3/home3-suc-sto-02.png",
    link: "/project-details"
  },
  {
    id: "cs-3",
    title: "Autonomous Workflow Engine & LLMs",
    category: "AI & Automation",
    image: "assets/img/home-3/home3-suc-sto-03.png",
    link: "/project-details"
  },
  {
    id: "cs-4",
    title: "Zero-Trust Cloud & Microservices Migration",
    category: "DevSecOps",
    image: "assets/img/home-3/home3-suc-sto-04.png",
    link: "/project-details"
  },
  {
    id: "cs-5",
    title: "Predictive Analytics Data Mesh",
    category: "Data Engineering",
    image: "assets/img/home-3/home3-suc-sto-05.png",
    link: "/project-details"
  }
];

function SuccessStory3() {
  const { data: cmsData } = useCMS("case_studies");
  const [caseStudies, setCaseStudies] = useState(DEFAULT_CASE_STUDIES);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCaseStudies(data);
        } else if (cmsData && cmsData.items && cmsData.items.length > 0) {
          setCaseStudies(cmsData.items);
        }
      })
      .catch((err) => {
        console.error("Error fetching projects for SuccessStory3:", err);
        if (cmsData && cmsData.items) setCaseStudies(cmsData.items);
      });

    return () => {
      isMounted = false;
    };
  }, [cmsData]);

  const sectionTitle = cmsData?.title || "Featured Case Studies";
  const sectionSubtitle = cmsData?.subtitle || "Discover how our digital engineering, AI agents, and cloud infrastructure have transformed operations for modern enterprises.";

  const slider = useMemo(() => {
    return {
      loop: true,
      slidesPerView: 3,
      spaceBetween: 30,
      speed: 1000,
      pagination: {
        el: ".swiper-pagination11",
        clickable: true,
      },
      autoplay: {
        delay: 5000
      },
      breakpoints: {
        280: { slidesPerView: 1 },
        386: { slidesPerView: 1 },
        576: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 2 },
        1200: { slidesPerView: 3, spaceBetween: 20 },
        1400: { slidesPerView: 3 },
      }
    };
  }, []);

  return (
    <div className="home3-success-stories-area sec-mar">
      <div className="container">
        <div className="row mb-60 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-12 d-flex align-items-center justify-content-between flex-wrap gap-4">
            <div className="section-title-3">
              <h2>{sectionTitle}</h2>
              <p>{sectionSubtitle}</p>
            </div>
            <div className="view-all-btn">
              <Link legacyBehavior href="/project">
                <a className="primary-btn3">View All Projects</a>
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Swiper {...slider} className="swiper home3-success-stories-slider">
              <div className="swiper-wrapper">
                {caseStudies.map((item, idx) => (
                  <SwiperSlide key={item._id || item.id || idx} className="swiper-slide">
                    <div className="success-storie-card">
                      <div className="success-img">
                        <img className="img-fluid magnetic-item" src={item.image || "assets/img/home-3/home3-suc-sto-01.png"} alt={item.title} />
                      </div>
                      <div className="success-content">
                        <span>{item.category || "Case Study"}</span>
                        <h3>
                          <Link legacyBehavior href={item.link || "/project-details"}>
                            <a>{item.title}</a>
                          </Link>
                        </h3>
                        <div className="view-btn">
                          <Link legacyBehavior href={item.link || "/project-details"}>
                            <a>
                              <svg width={12} height={12} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 1H12M12 1V13M12 1L0.5 12" />
                              </svg>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>
            <div className="swiper-pagination11 text-center" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessStory3;
