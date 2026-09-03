import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";
import React, { useState } from "react";
import CalModal from "@/components/common/CalModal";

function Contactpage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [isCalOpen, setIsCalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message.");
      }

      setStatus({ loading: false, success: true, error: null });
      setFormData({
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <Layout>
      <Breadcrumb
        pageList="Contact"
        title="For Any Query &amp; Collaboration"
        pageName="CONTACT"
      />
      <div className="contact-page-wrap sec-mar">
        <div className="container">
          <div className="row g-lg-4 gy-5">
            <div className="col-lg-6">
              <div className="contact-content">
                <span>CONTACT WITH US</span>
                <h2>LET’S WORK TOGETHER?</h2>
                <p>
                  We provide world-class, flexible engineering support via live chat, email, and phone. I guarantee that you’ll be able to have any inquiry addressed within 24 hours.
                </p>
                <div className="informations">
                  <div className="single-info">
                    <div className="icon">
                      <i className="fas fa-map-marker-alt" />
                    </div>
                    <div className="info">
                      <p>
                        Shanoo Digital Photo Studio, Government Polytechnic,<br />
                        College Road, Dahod, Usarvan Part, Gujarat 389151
                      </p>
                    </div>
                  </div>
                  <div className="single-info">
                    <div className="icon">
                      <i className="fas fa-phone-alt" />
                    </div>
                    <div className="info">
                      <a href="tel:+917623897036">+91 7623897036</a>
                    </div>
                  </div>
                  <div className="single-info">
                    <div className="icon">
                      <i className="far fa-envelope" />
                    </div>
                    <div className="info">
                      <a href="mailto:work@techwithjoshi.in">work@techwithjoshi.in</a><br />
                      <a href="mailto:dhaneshjoshi1234@gmail.com">dhaneshjoshi1234@gmail.com</a>
                    </div>
                  </div>
                </div>

                {/* Cal.com booking action */}
                <div className="pt-3 pb-4">
                  <button
                    type="button"
                    onClick={() => setIsCalOpen(true)}
                    className="primary-btn9 d-inline-flex align-items-center gap-2"
                    style={{ padding: "12px 24px", fontSize: "15px", cursor: "pointer" }}
                  >
                    <i className="bi bi-calendar-check"></i>
                    <span>Schedule 30-Min Call on Cal.com</span>
                  </button>
                </div>

                <div className="follow-area">
                  <h5 className="blog-widget-title">Follow Us</h5>
                  <p className="para">Follow us on Social Network</p>
                  <div className="blog-widget-body">
                    <ul className="follow-list d-flex flex-row align-items-start gap-4">
                      <li>
                        <a
                          href="https://www.linkedin.com/in/dhanesh-joshi/"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="LinkedIn"
                        >
                          <i className="bx bxl-linkedin" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/its_dhanesh_joshi_/"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Instagram"
                        >
                          <i className="bx bxl-instagram" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="contact-form-wrap">
                <div className="form-tltle">
                  <h5>Make a Free Consulting</h5>
                </div>
                <div className="contact-form">
                  {status.success && (
                    <div className="alert alert-success" role="alert" style={{ background: "rgba(0, 240, 118, 0.15)", border: "1px solid #00F076", color: "#00F076" }}>
                      <i className="bi bi-check-circle me-2"></i>
                      Thank you! Your message has been received and saved. We will get back to you shortly.
                    </div>
                  )}
                  {status.error && (
                    <div className="alert alert-danger" role="alert" style={{ background: "rgba(255, 62, 84, 0.15)", border: "1px solid #FF3E54", color: "#FF3E54" }}>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {status.error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-20">
                        <div className="form-inner">
                          <label>First name *</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mb-20">
                        <div className="form-inner">
                          <label>Last name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 mb-20">
                        <div className="form-inner">
                          <label>Company/Organization</label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your Company Name"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 mb-20">
                        <div className="form-inner">
                          <label>Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 mb-20">
                        <div className="form-inner">
                          <label>Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 mb-20">
                        <div className="form-inner">
                          <label>Message *</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us about your project requirements..."
                            rows={4}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-inner">
                          <button className="primary-btn3 w-100" type="submit" disabled={status.loading}>
                            {status.loading ? "Sending..." : "Submit Inquiry"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Location Section */}
      <div className="container pb-120">
        <div
          className="rounded-4 overflow-hidden position-relative"
          style={{
            border: "1px solid rgba(121, 40, 202, 0.35)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(121, 40, 202, 0.2)",
            background: "#080411",
          }}
        >
          {/* Map Top Info Header */}
          <div
            className="px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom"
            style={{
              background: "rgba(18, 10, 36, 0.95)",
              borderColor: "rgba(121, 40, 202, 0.25)",
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "rgba(0, 223, 216, 0.15)",
                  border: "1px solid rgba(0, 223, 216, 0.4)",
                  color: "#00DFD8",
                  fontSize: "18px",
                }}
              >
                <i className="fas fa-map-marker-alt" />
              </div>
              <div>
                <h5 className="text-white mb-0 fw-bold" style={{ fontSize: "16px" }}>
                  TechWithJoshi Private Limited Headquarters
                </h5>
                <p className="text-white-50 small mb-0" style={{ fontSize: "12.5px" }}>
                  Shanoo Digital Photo Studio, Government Polytechnic, College Road, Dahod, Gujarat 389151
                </p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Shanoo+Digital+Photo+Studio,+Government+Polytechnic,+College+Road,+Dahod,+Gujarat+389151"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-info rounded-pill px-3 py-2 d-flex align-items-center gap-2"
              style={{ fontSize: "12px", fontWeight: "700" }}
            >
              <i className="bi bi-geo-alt-fill text-danger" />
              <span>Open in Google Maps</span>
              <i className="bi bi-box-arrow-up-right ms-1" style={{ fontSize: "10px" }} />
            </a>
          </div>

          {/* Interactive Google Map Embed */}
          <div style={{ height: "450px", width: "100%", position: "relative" }}>
            <iframe
              src="https://maps.google.com/maps?q=Shanoo+Digital+Photo+Studio+Government+Polytechnic+College+Road+Dahod+Gujarat+389151&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{
                border: 0,
                display: "block",
                filter: "invert(90%) hue-rotate(180deg) contrast(95%) saturate(120%)",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TechWithJoshi Private Limited Google Map Location"
            />
          </div>
        </div>
      </div>

      <CalModal isOpen={isCalOpen} onClose={() => setIsCalOpen(false)} />
    </Layout>
  );
}

export default Contactpage;
