import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const DEFAULT_BLOGS = [
  {
    id: 1,
    category: "AI & Automation",
    date: "Jan 15, 2025",
    count_comment: 5,
    title: "Architecting Real-Time AI Agents with Next.js and LLMs",
    img: "assets/img/home-3/home3-blog-01.png"
  },
  {
    id: 2,
    category: "Cloud & DevOps",
    date: "Jan 28, 2025",
    count_comment: 8,
    title: "Zero-Downtime Cloud Migration & Microservices Architecture",
    img: "assets/img/home-3/home3-blog-02.png"
  },
  {
    id: 3,
    category: "Web Performance",
    date: "Feb 10, 2025",
    count_comment: 12,
    title: "Modern Web Performance: Core Web Vitals & Edge Delivery",
    img: "assets/img/home-3/home3-blog-03.png"
  }
];

function Home3Blog() {
  const [blogs, setBlogs] = useState(DEFAULT_BLOGS);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setBlogs(data.slice(0, 3));
        }
      })
      .catch((err) => console.error("Error fetching blogs for Home3:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home3-blog-area sec-mar">
      <div className="container">
        <div className="row mb-55 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-12 d-flex justify-content-center">
            <div className="section-title-3 text-center">
              <h2>Latest Tech Insights</h2>
              <p>Explore deep dives into software architecture, artificial intelligence, cloud scaling, and modern engineering practices.</p>
            </div>
          </div>
        </div> 
        <div className="row justify-content-center g-lg-4 gy-5">
          {blogs.map((post, idx) => (
            <div
              key={post._id || post.id || idx}
              className="col-lg-4 col-md-6 wow animate fadeInUp"
              data-wow-delay={`${200 + (idx % 3) * 100}ms`}
              data-wow-duration="1500ms"
            >
              <div className="single-blog magnetic-item">
                <div className="blog-img">
                  <img className="img-fluid" src={post.image || post.img || "assets/img/home-3/home3-blog-01.png"} alt={post.title} />
                  <div className="blog-tag">
                    <Link legacyBehavior href="/blog"><a>{post.category || "Technology"}</a></Link>
                  </div>
                </div>
                <div className="blog-content">
                  <ul className="blog-meta">
                    <li><Link legacyBehavior href="/blog"><a>{post.date || "2025"}</a></Link></li>
                    <li><Link legacyBehavior href="/blog"><a>Comment ({post.comments || post.count_comment || 0})</a></Link></li>
                  </ul>
                  <h4><Link legacyBehavior href="/blog-details"><a>{post.title}</a></Link></h4>
                  <div className="blog-footer">
                    <div className="read-btn">
                      <Link legacyBehavior href="/blog-details">
                        <a>
                          Read More
                          <svg width={12} height={12} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1H12M12 1V13M12 1L0.5 12" />
                          </svg>
                        </a>
                      </Link>
                    </div>
                    <div className="social-area">
                      <ul>
                        <li><a href="https://www.linkedin.com/in/dhanesh-joshi/" target="_blank" rel="noopener noreferrer"><i className="bx bxl-linkedin" /></a></li>
                        <li><a href="https://www.instagram.com/its_dhanesh_joshi_/" target="_blank" rel="noopener noreferrer"><i className="bx bxl-instagram" /></a></li>
                      </ul>
                      <span><img src="assets/img/home-3/plain-icon.svg" alt="" /></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home3Blog;
