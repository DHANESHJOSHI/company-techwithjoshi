import React, { useState, useEffect } from "react";

const DEFAULT_MEMBERS = [
  {
    name: "Dhanesh Joshi",
    designation: "Founder & CEO",
    image: "assets/img/home-4/experts-01.png",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
      instagram: "https://www.instagram.com/its_dhanesh_joshi_/"
    }
  },
  {
    name: "Sophia Chen",
    designation: "Co-Founder & Head of AI",
    image: "assets/img/home-4/experts-02.png",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
      instagram: "https://www.instagram.com/its_dhanesh_joshi_/"
    }
  },
  {
    name: "Marcus Rivera",
    designation: "Director of Cloud & DevOps",
    image: "assets/img/home-4/experts-03.png",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
      instagram: "https://www.instagram.com/its_dhanesh_joshi_/"
    }
  },
  {
    name: "Emily Tanaka",
    designation: "Lead Full-Stack Engineer",
    image: "assets/img/home-4/experts-04.png",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
      instagram: "https://www.instagram.com/its_dhanesh_joshi_/"
    }
  }
];

function Home3Team() {
  const [teamMembers, setTeamMembers] = useState(DEFAULT_MEMBERS);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setTeamMembers(data);
        }
      })
      .catch((err) => console.error("Error fetching team data:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home3-team-area sec-mar">
      <div className="container">
        <div className="row mb-55 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
          <div className="col-lg-12 d-flex justify-content-center">
            <div className="section-title-3 text-center">
              <h2>Engineering Leaders</h2>
              <p>Our team of senior system architects, AI researchers, and cloud engineers build transformative digital products.</p>
            </div>
          </div>
        </div>
        <div className="row">
          {teamMembers.map((member, idx) => (
            <div
              key={member._id || member.id || idx}
              className="col-lg-3 col-sm-6 experts wow animate fadeInUp"
              data-wow-delay={`${200 + (idx % 4) * 100}ms`}
              data-wow-duration="1500ms"
            >
              <div className="experts-card magnetic-item">
                <div className="experts-img">
                  <img className="img-fluid" src={member.image || "assets/img/home-4/experts-01.png"} alt={member.name} />
                  <div className="expert-social">
                    <ul>
                      <li>
                        <a href={member.socialLinks?.linkedin || "https://www.linkedin.com/in/dhanesh-joshi/"} target="_blank" rel="noopener noreferrer">
                          <i className="bx bxl-linkedin" />
                        </a>
                      </li>
                      <li>
                        <a href={member.socialLinks?.instagram || "https://www.instagram.com/its_dhanesh_joshi_/"} target="_blank" rel="noopener noreferrer">
                          <i className="bx bxl-instagram" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="experts-content">
                  <h4>{member.name}</h4>
                  <span>{member.designation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home3Team;
