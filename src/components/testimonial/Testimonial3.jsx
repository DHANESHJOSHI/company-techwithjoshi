import React, { useMemo, useState, useEffect } from "react";
import SwiperCore, { Autoplay, EffectFade, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Pagination, Autoplay, EffectFade, Navigation]);

const DEFAULT_TESTIMONIALS = [
  {
    id: "testi-1",
    name: "David Sterling",
    designation: "VP of Engineering at AuraTech",
    review: "TechWithJoshi re-architected our legacy stack into high-concurrency microservices with zero downtime. Their technical speed and AI expertise are unmatched.",
    rating: 5,
    avatar: "assets/img/home-3/h3-testi-01.png",
    date: "Oct 12, 2024",
    time: "02:45 PM"
  },
  {
    id: "testi-2",
    name: "Elena Rostova",
    designation: "Chief Product Officer at Nexus AI",
    review: "From conceptual wireframing to production deployment, Dhanesh and his engineering team delivered our Next.js platform two weeks ahead of schedule.",
    rating: 5,
    avatar: "assets/img/home-3/h3-testi-02.png",
    date: "Nov 04, 2024",
    time: "11:20 AM"
  },
  {
    id: "testi-3",
    name: "Rajesh Nair",
    designation: "Founder & CEO at CloudVenture",
    review: "The level of engineering rigor TechWithJoshi brings to cloud infrastructure and automated CI/CD pipelines saved us over 40% in AWS infrastructure costs.",
    rating: 5,
    avatar: "assets/img/home-3/h3-testi-03.png",
    date: "Dec 18, 2024",
    time: "04:15 PM"
  }
];

function Testimonial3() {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch((err) => console.error("Error fetching testimonials for Testimonial3:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const slider = useMemo(() => {
    return {
      loop: true,
      spaceBetween: 30,
      speed: 2000,
      centeredSlides: true,
      navigation: {
        nextEl: ".nextbtn2",
        prevEl: ".prevbtn2",
      },
      autoplay: {
        delay: 5000,
      },
      breakpoints: {
        280: { slidesPerView: 1 },
        386: { slidesPerView: 1 },
        576: { slidesPerView: 1 },
        768: { slidesPerView: 1.5 },
        992: { slidesPerView: 2 },
        1200: { slidesPerView: 2 },
        1400: { slidesPerView: 2 },
      },
    };
  }, []);

  return (
    <div className="home3-testimonil-area sec-mar">
      <div className="container">
        <div className="row mb-55 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-12 d-flex align-items-center justify-content-between gap-4 flex-wrap">
            <div className="section-title-3">
              <h2>Client Testimonials</h2>
              <p>Hear from technology leaders and startup founders on how our engineering solutions delivered measurable performance and scalability.</p>
            </div>
            <div className="swiper-btn-group">
              <div className="swiper-btn prevbtn2" style={{ cursor: "pointer" }}>
                <i className="bi bi-arrow-left" />
              </div>
              <div className="swiper-btn nextbtn2" style={{ cursor: "pointer" }}>
                <i className="bi bi-arrow-right" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Swiper {...slider} className="swiper home3-testimonial-slider">
                {testimonials.map((item, idx) => (
                  <SwiperSlide key={item._id || item.id || idx} className="swiper-slide">
                    <div className="testimonial-card3">
                      <div className="quate-icon">
                        <img src="assets/img/home-4/left-quote.svg" alt="Quote" />
                      </div>
                      <div className="testimonial-top">
                        <div className="review-left">
                          <img src="assets/img/home-4/trustpilot.svg" alt="Trustpilot" />
                        </div>
                        <div className="review-right">
                          <ul className="star">
                            {Array.from({ length: item.rating || 5 }).map((_, i) => (
                              <li key={i}><i className="bi bi-star-fill text-warning" /></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="testimonial-content">
                        <p>“{item.review || item.text}”</p>
                      </div>
                      <div className="testimonial-btm">
                        <div className="author-area">
                          <div className="author-content">
                            <h4>{item.name}</h4>
                            <span>{item.designation} {item.company ? `• ${item.company}` : ""}</span>
                          </div>
                        </div>
                        <div className="review-date-and-time">
                          <p>{item.date || "Verified Review"}</p>
                          <span>{item.time || "Enterprise Partner"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="author-img">
                      <img src={item.avatar || item.img || "assets/img/home-3/h3-testi-01.png"} alt={item.name} />
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonial3;
