import Link from 'next/link'
import React from 'react'

function Home5Team() {
  return (
    <>
      <div className="collaborate-section mb-130">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="collaborate-wrapper">
                <div className="section-title-5">
                  <span>LET’S COLLABORATE</span>
                  <h2>Ready to <br />
                    <span>work with us?</span></h2>
                  <div className="get-btn">
                    <Link legacyBehavior href="/contact"><a className="primary-btn3">Get a quote</a></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="home5-team-section mb-130">
        <div className="container">
          <div className="row mb-55 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="col-lg-12 ">
              <div className="section-title-5 text-center">
                <span>Meet Our Team</span>
                <h2>Our Experts</h2>
              </div>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-xl-3 col-lg-4 col-sm-6 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="single-team magnetic-item">
                <div className="social-area">
                  <ul>
                    <li><a href="https://www.linkedin.com/in/dhanesh-joshi/" target="_blank" rel="noopener noreferrer"><i className="bx bxl-linkedin" /></a></li>
                    <li><a href="https://www.instagram.com/its_dhanesh_joshi_/" target="_blank" rel="noopener noreferrer"><i className="bx bxl-instagram" /></a></li>
                  </ul>
                </div>
                <div className="team-img">
                  <img className="img-fluid" src="/assets/img/home-5/home5-team-01.png?v=5" alt="Cassian Coleson" />
                </div>
                <div className="team-content">
                  <h4>Cassian Coleson</h4>
                  <span>Founder, CTO</span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-sm-6 wow animate fadeInUp" data-wow-delay="300ms" data-wow-duration="1500ms">
              <div className="single-team magnetic-item">
                <div className="social-area">
                  <ul>
                    <li><a href="https://www.linkedin.com/in/dhanesh-joshi/" target="_blank" rel="noopener noreferrer"><i className="bx bxl-linkedin" /></a></li>
                    <li><a href="https://www.instagram.com/its_dhanesh_joshi_/" target="_blank" rel="noopener noreferrer"><i className="bx bxl-instagram" /></a></li>
                  </ul>
                </div>
                <div className="team-img">
                  <img className="img-fluid" src="/assets/img/home-5/home5-team-02.png?v=5" alt="Blaise Davian" />
                </div>
                <div className="team-content">
                  <h4>Blaise Davian</h4>
                  <span>Co-Founder, CEO</span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-sm-6 wow animate fadeInUp" data-wow-delay="400ms" data-wow-duration="1500ms">
              <div className="single-team magnetic-item">
                <div className="social-area">
                  <ul>
                    <li><a href="https://www.linkedin.com/in/dhanesh-joshi/" target="_blank" rel="noopener noreferrer"><i className="bx bxl-linkedin" /></a></li>
                    <li><a href="https://www.instagram.com/its_dhanesh_joshi_/" target="_blank" rel="noopener noreferrer"><i className="bx bxl-instagram" /></a></li>
                  </ul>
                </div>
                <div className="team-img">
                  <img className="img-fluid" src="/assets/img/home-5/home5-team-03.png?v=5" alt="Koen Maxton" />
                </div>
                <div className="team-content">
                  <h4>Koen Maxton</h4>
                  <span>Head of HR &amp; Manager</span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-sm-6 wow animate fadeInUp" data-wow-delay="500ms" data-wow-duration="1500ms">
              <div className="single-team magnetic-item">
                <div className="social-area">
                  <ul>
                    <li><a href="https://www.linkedin.com/in/dhanesh-joshi/" target="_blank" rel="noopener noreferrer"><i className="bx bxl-linkedin" /></a></li>
                    <li><a href="https://www.instagram.com/its_dhanesh_joshi_/" target="_blank" rel="noopener noreferrer"><i className="bx bxl-instagram" /></a></li>
                  </ul>
                </div>
                <div className="team-img">
                  <img className="img-fluid" src="/assets/img/home-5/home5-team-04.png?v=5" alt="Landry Palmer" />
                </div>
                <div className="team-content">
                  <h4>Landry Palmer</h4>
                  <span>Software Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </>
  )
}

export default Home5Team
