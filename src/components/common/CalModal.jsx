import React from "react";

export default function CalModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="cal-modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(8, 7, 19, 0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        className="cal-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "960px",
          height: "85vh",
          maxHeight: "750px",
          background: "#0c0d1e",
          borderRadius: "16px",
          border: "1px solid rgba(121, 40, 202, 0.4)",
          boxShadow: "0 25px 60px -15px rgba(102, 16, 242, 0.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          animation: "fadeInUp 0.3s ease-out",
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(90deg, #12132a 0%, #0c0d1e 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7928CA 0%, #00DFD8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "18px",
              }}
            >
              <i className="bi bi-calendar-event"></i>
            </div>
            <div>
              <h5 style={{ margin: 0, color: "#fff", fontSize: "17px", fontWeight: "600" }}>
                Book a Free Consultation
              </h5>
              <span style={{ color: "#a5a6c2", fontSize: "13px" }}>
                30 Min Meeting with Dhanesh Joshi (TechWithJoshi)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              color: "#fff",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              transition: "0.2s",
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div style={{ flex: 1, position: "relative", background: "#080713" }}>
          <iframe
            src="https://cal.com/dhanesh-joshi/30min"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            title="Book 30 Min Meeting"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
