import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";
import React, { useState, useEffect } from "react";

const DEFAULT_TEAM = [
  {
    name: "Dhanesh Joshi",
    designation: "CEO & Founder",
    image: "/assets/img/founder/dhanesh-joshi.png",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
      instagram: "https://www.instagram.com/its_dhanesh_joshi_/"
    }
  },
  {
    name: "Alexander Wright",
    designation: "Head of AI & Research",
    image: "/assets/img/home-5/home5-team-02.png",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
      instagram: "https://www.instagram.com/its_dhanesh_joshi_/"
    }
  },
  {
    name: "Sophia Chen",
    designation: "Director of Cloud & DevOps",
    image: "/assets/img/home-5/home5-team-03.png",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
      instagram: "https://www.instagram.com/its_dhanesh_joshi_/"
    }
  },
  {
    name: "Marcus Rivera",
    designation: "Lead Full-Stack Engineer",
    image: "/assets/img/home-5/home5-team-04.png",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
      instagram: "https://www.instagram.com/its_dhanesh_joshi_/"
    }
  }
];

function Team3() {
  const [teamMembers, setTeamMembers] = useState(DEFAULT_TEAM);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setTeamMembers(data);
        }
      })
      .catch((err) => console.error("Error fetching team:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      <Breadcrumb pageList="Team" title="Meet Our Experts" pageName="TEAM" />
      <div className="home5-team-section sec-mar">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {teamMembers.map((member, idx) => {
              let socials = member.socialLinks;
              if (typeof socials === "string") {
                try {
                  socials = JSON.parse(socials.replace(/'/g, '"'));
                } catch {
                  socials = {};
                }
              }
              const linkedin = socials?.linkedin || "https://www.linkedin.com/in/dhanesh-joshi/";
              const instagram = socials?.instagram || "https://www.instagram.com/its_dhanesh_joshi_/";

              let imgSrc = member.image;
              if (!imgSrc) {
                imgSrc = `/assets/img/home-5/home5-team-0${(idx % 4) + 1}.png`;
              } else if (!imgSrc.startsWith("/") && !imgSrc.startsWith("http")) {
                imgSrc = `/${imgSrc}`;
              }

              return (
                <div
                  key={member._id || member.id || idx}
                  className="col-xl-3 col-lg-4 col-sm-6 wow animate fadeInUp"
                  data-wow-delay={`${200 + (idx % 4) * 100}ms`}
                  data-wow-duration="1500ms"
                >
                  <div className="single-team magnetic-item">
                    <div className="social-area">
                      <ul>
                        <li>
                          <a href={linkedin} target="_blank" rel="noopener noreferrer">
                            <i className="bx bxl-linkedin" />
                          </a>
                        </li>
                        <li>
                          <a href={instagram} target="_blank" rel="noopener noreferrer">
                            <i className="bx bxl-instagram" />
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="team-img">
                      <img
                        className="img-fluid"
                        src={imgSrc}
                        alt={member.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="team-content">
                      <h4>{member.name}</h4>
                      <span>{member.designation || member.role || "Technology Specialist"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Team3;
