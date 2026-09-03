import React, { useState, useEffect } from 'react';

const BANNER_IMAGES = [
  "/assets/img/inner-pages/blog-banner.png",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80",
];

function BlogBanner() {
  const [bannerImg, setBannerImg] = useState("/assets/img/inner-pages/blog-banner.png");

  useEffect(() => {
    // Pick a random fresh banner image on each page visit
    const randomIndex = Math.floor(Math.random() * BANNER_IMAGES.length);
    setBannerImg(BANNER_IMAGES[randomIndex]);
  }, []);

  return (
    <div className="blog-banner sec-mar">
        <div className="container">
            <div className="row">
            <div className="col-lg-12">
                <div className="blog-banner-wrap position-relative overflow-hidden rounded-4" style={{ borderRadius: "24px" }}>
                <div className="banner-img" style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                    <img
                      src={bannerImg}
                      alt="TechWithJoshi Blog Banner"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(90deg, rgba(8, 4, 17, 0.8) 0%, rgba(121, 40, 202, 0.45) 50%, rgba(0, 223, 216, 0.35) 100%)",
                        mixBlendMode: "multiply",
                      }}
                    />
                </div>
                <div className="banner-content position-relative" style={{ zIndex: 2 }}>
                    <h2 className="text-white fw-bold">Tech Insights</h2>
                    <p className="text-white-50">Join 50,000+ Software Engineers &amp; Tech Leaders</p>
                    <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-inner">
                        <input type="email" placeholder="Enter engineering email..." required />
                        <button type="submit" style={{ cursor: "pointer" }}>
                        Subscribe
                        <svg width={12} height={12} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1H12M12 1V13M12 1L0.5 12" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
  );
}

export default BlogBanner;
