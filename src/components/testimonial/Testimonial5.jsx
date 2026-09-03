import React, { useMemo } from "react";
import SwiperCore, { Autoplay, EffectFade, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
SwiperCore.use([Pagination, Autoplay, EffectFade, Navigation]);

function Testimonial5() {
  const slider = useMemo(()=>{
    return {
      loop: true,
      spaceBetween: 0,
      speed: 2000,
      centeredSlides: true,
      // direction: "vertical",
      navigation: {
          nextEl: ".nextbtn3",
          prevEl: ".prevbtn3",
      },
      autoplay: {
          delay: 5000
      },
    }
},[])
  return (
    <div className="home5-testimonial-area mb-130">
    <div className="container">
      <div className="row g-lg-4 gy-5 align-items-center">
        <div className="col-lg-4 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="section-title-5">
            <span>CLIENT REVIEW</span>
            <h2>Happy Client</h2>
            <div className="testimolial-left">
              <p>Discover how TechWithJoshi helps forward-thinking companies engineer high-performance cloud applications, AI agents, and secure distributed software.</p>
              <div className="customar-review">
                <h6>Review On</h6>
                <ul>
                  <li>
                    <a
                      href="https://www.google.com/search?q=techwithjoshi+private+limited"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="single-review"
                      style={{ transition: "all 0.3s ease" }}
                      title="View TechWithJoshi on Google"
                    >
                      <div className="icon">
                        <img src="assets/img/home-5/google-1.svg" alt="Google Reviews" />
                      </div>
                      <ul className="star">
                        <li><i className="bi bi-star-fill" style={{ color: "#FBBC05" }} /></li>
                        <li><i className="bi bi-star-fill" style={{ color: "#FBBC05" }} /></li>
                        <li><i className="bi bi-star-fill" style={{ color: "#FBBC05" }} /></li>
                        <li><i className="bi bi-star-fill" style={{ color: "#FBBC05" }} /></li>
                        <li><i className="bi bi-star-fill" style={{ color: "#FBBC05" }} /></li>
                        <li style={{ fontWeight: "700", color: "#FFFFFF" }}>5.0/5.0</li>
                      </ul>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8 position-relative wow animate fadeInUp" data-wow-delay="300ms" data-wow-duration="1500ms">
          <Swiper {...slider} className="swiper home5-testimonial-slider">
            <div className="swiper-wrapper">
              {/* Enterprise Review 1: LaCuna CEO */}
              <SwiperSlide className="swiper-slide">
                <div className="testimonial-wrapper">
                  <div className="testimonial-top">
                    <div
                      className="author-img d-flex align-items-center justify-content-center overflow-hidden"
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                        background: "#080411",
                        boxShadow: "0 8px 25px rgba(0, 223, 216, 0.45)",
                        border: "3px solid #00DFD8",
                      }}
                    >
                      <img
                        src="/assets/img/clients/lacuna-favicon.png"
                        alt="LaCuna CEO"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="review d-flex flex-column align-items-end">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <img
                          src="/assets/img/clients/lacuna-logo.png"
                          alt="LaCuna"
                          style={{ height: "26px", maxWidth: "130px", objectFit: "contain" }}
                        />
                        <div className="d-flex" style={{ color: "#FBBC05", fontSize: "16px", gap: "2px" }}>
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                        </div>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#00DFD8", letterSpacing: "0.5px" }}>
                        VERIFIED CLIENT &bull; LACUNA.ME
                      </span>
                    </div>
                  </div>
                  <div className="testimonial-content">
                    <p>“TechWithJoshi engineered the scalable cloud infrastructure and high-velocity web architecture for LaCuna. Their deep full-stack mastery, fast turnaround, and pixel-perfect design execution made them our most trusted development partner.”</p>
                  </div>
                  <div className="testimonial-btm">
                    <div className="author-content">
                      <h4>Marcus Vance</h4>
                      <span>Founder &amp; CEO At LaCuna</span>
                    </div>
                    <div className="quote-icon">
                      <img src="assets/img/home-5/left-quote.svg" alt="" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* Google Review 2: Tapan Ghosh */}
              <SwiperSlide className="swiper-slide">
                <div className="testimonial-wrapper">
                  <div className="testimonial-top">
                    <div
                      className="author-img d-flex align-items-center justify-content-center"
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #10B981, #059669)",
                        boxShadow: "0 8px 25px rgba(16, 185, 129, 0.45)",
                        border: "3px solid #00DFD8",
                        userSelect: "none",
                      }}
                    >
                      <span style={{ color: "#FFFFFF", fontSize: "38px", fontWeight: "800", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                        T
                      </span>
                    </div>
                    <div className="review d-flex flex-column align-items-end">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <img src="assets/img/home-5/google-1.svg" alt="Google" style={{ height: "24px" }} />
                        <div className="d-flex" style={{ color: "#FBBC05", fontSize: "16px", gap: "2px" }}>
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                        </div>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#00DFD8", letterSpacing: "0.5px" }}>
                        VERIFIED GOOGLE REVIEW
                      </span>
                    </div>
                  </div>
                  <div className="testimonial-content">
                    <p>“Delivered quality work on time, communicated effectively, and handled requirements professionally. Highly recommended.”</p>
                  </div>
                  <div className="testimonial-btm">
                    <div className="author-content">
                      <h4>Tapan Ghosh</h4>
                      <span>Google Local Guide &bull; 4 Reviews &bull; 5 Photos</span>
                    </div>
                    <div className="quote-icon">
                      <img src="assets/img/home-5/left-quote.svg" alt="" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* Google Review 2: Rajat */}
              <SwiperSlide className="swiper-slide">
                <div className="testimonial-wrapper">
                  <div className="testimonial-top">
                    <div
                      className="author-img d-flex align-items-center justify-content-center"
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.45)",
                        border: "3px solid #00DFD8",
                        userSelect: "none",
                      }}
                    >
                      <span style={{ color: "#FFFFFF", fontSize: "38px", fontWeight: "800", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                        R
                      </span>
                    </div>
                    <div className="review d-flex flex-column align-items-end">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <img src="assets/img/home-5/google-1.svg" alt="Google" style={{ height: "24px" }} />
                        <div className="d-flex" style={{ color: "#FBBC05", fontSize: "16px", gap: "2px" }}>
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                        </div>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#00DFD8", letterSpacing: "0.5px" }}>
                        VERIFIED GOOGLE REVIEW
                      </span>
                    </div>
                  </div>
                  <div className="testimonial-content">
                    <p>“Good services. Outstanding engineering execution, transparent communication, and reliable software delivery.”</p>
                  </div>
                  <div className="testimonial-btm">
                    <div className="author-content">
                      <h4>Rajat</h4>
                      <span>Google Reviewer &bull; 4 Reviews</span>
                    </div>
                    <div className="quote-icon">
                      <img src="assets/img/home-5/left-quote.svg" alt="" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* Google Review 3: Minni Jat */}
              <SwiperSlide className="swiper-slide">
                <div className="testimonial-wrapper">
                  <div className="testimonial-top">
                    <div
                      className="author-img d-flex align-items-center justify-content-center"
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                        boxShadow: "0 8px 25px rgba(139, 92, 246, 0.45)",
                        border: "3px solid #00DFD8",
                        userSelect: "none",
                      }}
                    >
                      <span style={{ color: "#FFFFFF", fontSize: "38px", fontWeight: "800", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                        M
                      </span>
                    </div>
                    <div className="review d-flex flex-column align-items-end">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <img src="assets/img/home-5/google-1.svg" alt="Google" style={{ height: "24px" }} />
                        <div className="d-flex" style={{ color: "#FBBC05", fontSize: "16px", gap: "2px" }}>
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                          <i className="bi bi-star-fill" />
                        </div>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#00DFD8", letterSpacing: "0.5px" }}>
                        VERIFIED GOOGLE REVIEW
                      </span>
                    </div>
                  </div>
                  <div className="testimonial-content">
                    <p>“Exceptional experience working with TechWithJoshi! Fast response times, deep technical proficiency, and high-impact delivery. &#x1F609; &#x1F44D;”</p>
                  </div>
                  <div className="testimonial-btm">
                    <div className="author-content">
                      <h4>Minni Jat</h4>
                      <span>Google Reviewer &bull; 2 Reviews</span>
                    </div>
                    <div className="quote-icon">
                      <img src="assets/img/home-5/left-quote.svg" alt="" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </div>
          </Swiper>
          <div className="swiper-btn-group">
            <div className="swiper-btn prevbtn3">
              <i className="bi bi-arrow-up" />
            </div>
            <div className="swiper-btn nextbtn3">
              <i className="bi bi-arrow-down" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Testimonial5
