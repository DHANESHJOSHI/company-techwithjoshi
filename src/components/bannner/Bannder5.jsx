import React, { useState, useMemo, useEffect, useRef } from "react";
import SwiperCore, { Autoplay, EffectFade, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import gsap from "gsap";

SwiperCore.use([Pagination, Autoplay, EffectFade]);

function Bannder5() {
  const bannerRef = useRef(null);
  const imgWrapRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const companyTextRef = useRef(null);

  // Dynamic Typewriter Phrases
  const WORDS = useMemo(
    () => [
      "AI SaaS Platforms.",
      "Enterprise Cloud Scale.",
      "High-Performance Web Apps.",
      "Autonomous AI Agents.",
      "Digital Business Potential.",
      "Mission-Critical Systems."
    ],
    []
  );

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullWord = WORDS[currentWordIndex];
    let typingSpeed = isDeleting ? 40 : 85;

    if (!isDeleting && currentText === fullWord) {
      typingSpeed = 2200; // Pause at full word
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % WORDS.length);
      typingSpeed = 400; // Pause before typing next word
      return;
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < fullWord.length) {
          setCurrentText(fullWord.slice(0, currentText.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        setCurrentText(fullWord.slice(0, currentText.length - 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, WORDS]);
 
  // Ensure company vertical brand text stays solid white & centered
  useEffect(() => {
    // Kept static, white, and rock-solid fitted
  }, []);

  const slider = useMemo(() => {
    return {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 1500,
      effect: "fade",
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination1",
        clickable: true,
      },
      fadeEffect: {
        crossFade: true,
      },
    };
  }, []);

  // GSAP Entrance & Floating Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Staggered Entrance
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".gsap-tagline-wrapper", {
        y: -25,
        opacity: 0,
        duration: 0.9,
      })
        .from(
          ".banner-title h1",
          {
            y: 40,
            opacity: 0,
            duration: 1.1,
          },
          "-=0.6"
        )
        .from(
          ".gsap-pill-item",
          {
            y: 15,
            opacity: 0,
            stagger: 0.15,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.7"
        )
        .from(
          ".banner-desc-text",
          {
            y: 25,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.7"
        )
        .from(
          ".view-btn",
          {
            scale: 0.85,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.6)",
          },
          "-=0.6"
        )
        .from(
          imgWrapRef.current,
          {
            x: 50,
            opacity: 0,
            duration: 1.2,
          },
          "-=0.9"
        );

      // 2. Subtle continuous floating idle animation for laptop image
      if (imgWrapRef.current) {
        gsap.to(imgWrapRef.current, {
          y: -12,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 3. Gentle ambient glow pulse
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          scale: 1.2,
          x: 30,
          y: -20,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          scale: 1.15,
          x: -25,
          y: 20,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 4. Continuous GSAP kinetic floating animation for side TechWithJoshi
      if (companyTextRef.current) {
        gsap.to(companyTextRef.current, {
          y: -12,
          scale: 1.025,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  // Interactive Mouse Parallax
  const handleMouseMove = (e) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Parallax on image wrap (3D tilt effect)
    if (imgWrapRef.current) {
      gsap.to(imgWrapRef.current, {
        rotateY: x * 10,
        rotateX: -y * 10,
        x: x * 18,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    // Parallax on ambient glow orbs (opposite direction for depth)
    if (orb1Ref.current) {
      gsap.to(orb1Ref.current, {
        x: -x * 45,
        y: -y * 45,
        duration: 0.8,
        ease: "power2.out",
      });
    }
    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, {
        x: -x * 35,
        y: -y * 35,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (imgWrapRef.current) {
      gsap.to(imgWrapRef.current, {
        rotateY: 0,
        rotateX: 0,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }
    if (orb1Ref.current) {
      gsap.to(orb1Ref.current, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "power2.out",
      });
    }
    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      ref={bannerRef}
      className="banner-area-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Cosmic Glow Orbs for High-End Glassmorphism */}
      <div ref={orb1Ref} className="hero-ambient-glow hero-orb-1" />
      <div ref={orb2Ref} className="hero-ambient-glow hero-orb-2" />

      <div className="company-name">
        <h2 ref={companyTextRef} className="brand-vertical-text">
          {"TECHWITHJOSHI".split("").map((char, i) => (
            <span key={i} className="letter-char" style={{ "--i": i }}>
              {char}
            </span>
          ))}
        </h2>
      </div>

      <div className="banner-area">
        <div className="social-area">
          <ul>
            <li>
              <a
                href="https://www.linkedin.com/in/dhanesh-joshi/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bx bxl-linkedin" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/its_dhanesh_joshi_/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bx bxl-instagram" />
              </a>
            </li>
          </ul>
        </div>

        {/* GSAP Style Tagline Badge like on gsap.com */}
        <div className="gsap-tagline-wrapper">
          <span className="gsap-tagline-bracket">&#123;</span>
          <span className="gsap-tagline-text">
            TechWithJoshi – Elite AI SaaS, Cloud &amp; High-Velocity Software Engineering
          </span>
          <span className="gsap-tagline-bracket">&#125;</span>
        </div>

        {/* High-Impact Engineering Feature Strip (Clean, responsive, never overlaps) */}
        <div className="gsap-badges-strip">
          <span className="gsap-pill-item">
            <span className="gsap-pill-dot" /> Reasoning AI &amp; LLM Systems
          </span>
          <span className="gsap-pill-item">
            <span className="gsap-pill-dot purple" /> 99.99% Cloud SLA Architecture
          </span>
          <span className="gsap-pill-item d-none d-md-inline-flex">
            <span className="gsap-pill-dot" /> Autonomous Agentic Pipelines
          </span>
        </div>

        <div className="banner-title">
          <h1>
            Unlock your <br />
            <span className="hero-typewriter-container">
              <span className="hero-typewriter-badge">{currentText}</span>
              <span className="hero-typewriter-cursor">|</span>
            </span>
          </h1>
        </div>

        <div className="banner-content">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <p className="banner-desc-text">
                We engineer high-performance web applications, intelligent AI
                systems, and automated cloud platforms designed for enterprise
                reliability and rapid scale.
              </p>
              <div className="view-btn">
                <Link legacyBehavior href="/service">
                  <a className="primary-btn7">
                    <span className="circle2">
                      <svg
                        width={13}
                        height={13}
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M0 1H12M12 1V13M12 1L0.5 12" />
                      </svg>
                    </span>
                    <span className="text">VIEW MORE</span>
                  </a>
                </Link>
              </div>
              <div className="scroll-and-social-area">
                <div className="scroll-down-area">
                  <a href="#home5-about-area">
                    <span />
                    Scroll Down to explore
                  </a>
                </div>
                <div className="swiper-pagination1 two " />
              </div>
            </div>

            <div className="col-lg-7">
              <div ref={imgWrapRef} className="banner-img-wrap">
                <Swiper {...slider} className="swiper banner5-slider">
                  <SwiperSlide className="swiper-slide">
                    <div className="banner-img">
                      <img
                        className="img-fluid"
                        src="/assets/img/home-5/h5-banner-img1.png?v=6"
                        alt="TechWithJoshi Full-Stack Engineering Architecture"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="banner-img">
                      <img
                        className="img-fluid"
                        src="/assets/img/home-5/h5-banner-img2.png?v=6"
                        alt="TechWithJoshi Cloud & DevOps Systems"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div className="banner-img">
                      <img
                        className="img-fluid"
                        src="/assets/img/home-5/h5-banner-img3.png?v=6"
                        alt="TechWithJoshi AI & Neural Systems"
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>

        <div className="banner-text-slider">
          <Marquee speed={45} gradient={false}>
            <h2 className="marquee_text">
              <img src="/assets/img/home-5/star.svg" alt="" />
              Enterprise AI Engineering
              <img src="/assets/img/home-5/star.svg" alt="" />
              Cloud-Native Architecture
              <img src="/assets/img/home-5/star.svg" alt="" />
              Full-Stack Web &amp; Mobile Apps
              <img src="/assets/img/home-5/star.svg" alt="" />
              DevOps &amp; Microservices
              <img src="/assets/img/home-5/star.svg" alt="" />
              Enterprise AI Engineering
              <img src="/assets/img/home-5/star.svg" alt="" />
              Cloud-Native Architecture
              <img src="/assets/img/home-5/star.svg" alt="" />
              Full-Stack Web &amp; Mobile Apps
              <img src="/assets/img/home-5/star.svg" alt="" />
              DevOps &amp; Microservices
            </h2>
          </Marquee>
        </div>
      </div>
    </div>
  );
}

export default Bannder5;
