import React, { useState } from "react";
import CalModal from "./CalModal";
import AiChatWidget from "./AiChatWidget";

export default function FloatingWidgets() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCalOpen, setIsCalOpen] = useState(false);

  const handleWhatsAppClick = (e) => {
    if (e) e.preventDefault();
    let name = "";
    try {
      name = localStorage.getItem("twj_visitor_name") || "";
    } catch (err) {}
    if (!name) {
      name = prompt("Please enter your name so Dhanesh knows who is reaching out:", "") || "";
      if (name.trim()) {
        try {
          localStorage.setItem("twj_visitor_name", name.trim());
        } catch (err) {}
      }
    }
    const text = name.trim()
      ? `Hi Dhanesh, my name is ${name.trim()}. I visited TechWithJoshi and would like to discuss a project.`
      : "Hi Dhanesh / TechWithJoshi Team, I would like to discuss an engineering project.";
    window.open(`https://wa.me/917623897036?text=${encodeURIComponent(text)}`, "_blank");
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* AI Technology Specialist Chatbot Widget (Controlled) */}
      <AiChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenCal={() => {
          setIsChatOpen(false);
          setIsCalOpen(true);
        }}
        hideFloatingTrigger={true}
      />

      {/* Cal.com Schedule Consultation Modal */}
      <CalModal isOpen={isCalOpen} onClose={() => setIsCalOpen(false)} />

      {/* Outside Click Backdrop when Speed-Dial menu is open */}
      {isMenuOpen && !isChatOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99988,
            background: "rgba(5, 2, 14, 0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            transition: "opacity 0.25s ease",
          }}
        />
      )}

      {/* Unified Speed-Dial Floating Actions Hub */}
      {!isChatOpen && (
        <div className="floating-quick-connect">
          {/* Expanded Speed-Dial Action Cards */}
          {isMenuOpen && (
            <div
              className="twj-speed-dial-panel animate__animated animate__fadeInUp"
              style={{
                width: "320px",
                maxWidth: "calc(100vw - 36px)",
                background: "radial-gradient(circle at 85% 15%, rgba(121, 40, 202, 0.28) 0%, rgba(14, 8, 28, 0.96) 75%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(121, 40, 202, 0.45)",
                borderRadius: "20px",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.75), 0 0 35px rgba(121, 40, 202, 0.25)",
                padding: "16px",
                marginBottom: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                zIndex: 99995,
                animationDuration: "0.25s",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "10px",
                  borderBottom: "1px solid rgba(121, 40, 202, 0.25)",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      letterSpacing: "1px",
                      color: "#00dfd8",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    QUICK CONNECT
                  </span>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                    Choose how you'd like to connect
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#94a3b8",
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                  title="Close Menu"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              {/* Action 1: TechWithJoshi AI Specialist */}
              <div
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsChatOpen(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "14px",
                  background: "rgba(121, 40, 202, 0.12)",
                  border: "1px solid rgba(0, 223, 216, 0.35)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 223, 216, 0.15)";
                  e.currentTarget.style.borderColor = "#00dfd8";
                  e.currentTarget.style.transform = "translateX(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(121, 40, 202, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(0, 223, 216, 0.35)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #7928CA 0%, #00DFD8 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "20px",
                    boxShadow: "0 4px 15px rgba(0, 223, 216, 0.35)",
                    flexShrink: 0,
                  }}
                >
                  <i className="bi bi-robot"></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#ffffff" }}>
                      TechWithJoshi AI
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        color: "#10b981",
                        background: "rgba(16, 185, 129, 0.15)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "#10b981",
                          boxShadow: "0 0 6px #10b981",
                        }}
                      />
                      Online
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Tech stack, architecture &amp; scope
                  </p>
                </div>
              </div>

              {/* Action 2: Schedule 1:1 Video Call */}
              <div
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsCalOpen(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "14px",
                  background: "rgba(102, 16, 242, 0.12)",
                  border: "1px solid rgba(121, 40, 202, 0.35)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(121, 40, 202, 0.22)";
                  e.currentTarget.style.borderColor = "#7928CA";
                  e.currentTarget.style.transform = "translateX(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(102, 16, 242, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(121, 40, 202, 0.35)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #7928CA 0%, #6610F2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "19px",
                    boxShadow: "0 4px 15px rgba(102, 16, 242, 0.35)",
                    flexShrink: 0,
                  }}
                >
                  <i className="bi bi-calendar2-check"></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#ffffff" }}>
                      Schedule 1:1 Call
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        color: "#a855f7",
                        background: "rgba(168, 85, 247, 0.15)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        padding: "2px 6px",
                        borderRadius: "10px",
                      }}
                    >
                      Cal.com
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Direct video consultation with Dhanesh
                  </p>
                </div>
              </div>

              {/* Action 3: Chat on WhatsApp */}
              <div
                onClick={handleWhatsAppClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "14px",
                  background: "rgba(37, 211, 102, 0.1)",
                  border: "1px solid rgba(37, 211, 102, 0.35)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(37, 211, 102, 0.2)";
                  e.currentTarget.style.borderColor = "#25D366";
                  e.currentTarget.style.transform = "translateX(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(37, 211, 102, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(37, 211, 102, 0.35)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "22px",
                    boxShadow: "0 4px 15px rgba(37, 211, 102, 0.35)",
                    flexShrink: 0,
                  }}
                >
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: "700", color: "#ffffff" }}>
                      Chat on WhatsApp
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        color: "#25D366",
                        background: "rgba(37, 211, 102, 0.15)",
                        border: "1px solid rgba(37, 211, 102, 0.3)",
                        padding: "2px 6px",
                        borderRadius: "10px",
                      }}
                    >
                      Instant
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Instant direct inquiry &amp; consultation
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Unified Floating Action Button (FAB) */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            {/* Desktop Label Pill (only shown when closed and on screens >= 768px) */}
            {!isMenuOpen && (
              <div
                className="twj-fab-pill"
                onClick={() => setIsMenuOpen(true)}
                style={{
                  marginRight: "12px",
                  background: "rgba(18, 10, 36, 0.92)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(121, 40, 202, 0.5)",
                  color: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "24px",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.5)",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#00dfd8";
                  e.currentTarget.style.transform = "translateX(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(121, 40, 202, 0.5)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 8px #10b981",
                  }}
                />
                <span>TechWithJoshi AI • Connect</span>
              </div>
            )}

            {/* Circular FAB Toggle */}
            <button
              type="button"
              className="twj-fab-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Quick Connect Options"
              style={{
                position: "relative",
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: isMenuOpen
                  ? "linear-gradient(135deg, #1f1438 0%, #120924 100%)"
                  : "linear-gradient(135deg, #7928CA 0%, #00DFD8 100%)",
                color: "#ffffff",
                border: isMenuOpen
                  ? "2px solid rgba(255, 255, 255, 0.25)"
                  : "2px solid rgba(255, 255, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                boxShadow: isMenuOpen
                  ? "0 10px 30px rgba(0, 0, 0, 0.6)"
                  : "0 8px 30px rgba(121, 40, 202, 0.6), 0 0 20px rgba(0, 223, 216, 0.4)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                zIndex: 99996,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                if (!isMenuOpen) {
                  e.currentTarget.style.boxShadow =
                    "0 12px 35px rgba(121, 40, 202, 0.8), 0 0 25px rgba(0, 223, 216, 0.6)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                if (!isMenuOpen) {
                  e.currentTarget.style.boxShadow =
                    "0 8px 30px rgba(121, 40, 202, 0.6), 0 0 20px rgba(0, 223, 216, 0.4)";
                }
              }}
            >
              {isMenuOpen ? (
                <i className="bi bi-x-lg" style={{ fontSize: "22px", color: "#f1f5f9" }} />
              ) : (
                <i className="bi bi-chat-dots-fill" style={{ fontSize: "24px", color: "#ffffff" }} />
              )}

              {/* Online pulse ping dot when collapsed */}
              {!isMenuOpen && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#00dfd8",
                    border: "2px solid #0c0618",
                    boxShadow: "0 0 10px #00dfd8",
                  }}
                />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
