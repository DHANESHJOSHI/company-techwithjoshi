import React, { useState, useEffect, useRef, useCallback } from "react";

function FormattedAiMessage({ content, isUser }) {
  if (!content) return null;
  if (isUser) {
    return <span>{content}</span>;
  }

  const lines = content.split("\n");

  return (
    <div className="ai-formatted-content" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} style={{ height: "4px" }} />;
        }

        const isH3 = trimmed.startsWith("### ");
        const isH2 = trimmed.startsWith("## ");
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed);

        let cleanLine = trimmed;
        if (isH3) cleanLine = trimmed.replace(/^###\s+/, "");
        else if (isH2) cleanLine = trimmed.replace(/^##\s+/, "");
        else if (isBullet) cleanLine = trimmed.replace(/^([-*]|\d+\.)\s+/, "");

        const parts = [];
        const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
        let lastIdx = 0;
        let match;

        while ((match = regex.exec(cleanLine)) !== null) {
          if (match.index > lastIdx) {
            parts.push(cleanLine.substring(lastIdx, match.index));
          }
          const token = match[0];
          if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
            parts.push(
              <strong key={`${lIdx}-${match.index}`} style={{ color: "#00dfd8", fontWeight: "700" }}>
                {token.slice(2, -2)}
              </strong>
            );
          } else if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
            parts.push(
              <em key={`${lIdx}-${match.index}`} style={{ color: "#cbd5e1", fontStyle: "italic" }}>
                {token.slice(1, -1)}
              </em>
            );
          } else if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
            parts.push(
              <code
                key={`${lIdx}-${match.index}`}
                style={{
                  background: "rgba(0, 223, 216, 0.15)",
                  color: "#00dfd8",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {token.slice(1, -1)}
              </code>
            );
          }
          lastIdx = regex.lastIndex;
        }

        if (lastIdx < cleanLine.length) {
          parts.push(cleanLine.substring(lastIdx));
        }

        if (isH2 || isH3) {
          return (
            <div
              key={lIdx}
              style={{
                fontSize: "14px",
                fontWeight: "800",
                color: "#ffffff",
                marginTop: "6px",
                borderBottom: "1px solid rgba(121, 40, 202, 0.3)",
                paddingBottom: "3px",
              }}
            >
              {parts}
            </div>
          );
        }

        if (isBullet) {
          return (
            <div key={lIdx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", paddingLeft: "4px" }}>
              <span style={{ color: "#00dfd8", fontSize: "12px", lineHeight: "1.5" }}>✦</span>
              <span style={{ flex: 1 }}>{parts}</span>
            </div>
          );
        }

        return <div key={lIdx}>{parts}</div>;
      })}
    </div>
  );
}

export default function AiChatWidget({
  onOpenCal,
  isOpen: propIsOpen,
  onClose: propOnClose,
  hideFloatingTrigger = false,
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = typeof propIsOpen === "boolean";
  const isOpen = isControlled ? propIsOpen : internalIsOpen;

  const handleClose = () => {
    if (isControlled && propOnClose) {
      propOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleToggle = () => {
    if (isControlled && propOnClose) {
      if (isOpen) propOnClose();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState(null);
  const [leadScore, setLeadScore] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  // Web Audio API sound effects for message send & receive
  const playAudioChime = useCallback((type = "receive") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (type === "send") {
        // Crisp, bright upward frequency chirp for sent message
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(460, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.09);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else {
        // Warm, dual-tone elegant bell chime for incoming AI message
        const now = ctx.currentTime;
        
        // Harmonic 1
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(587.33, now); // D5
        gain1.gain.setValueAtTime(0.14, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.26);

        // Harmonic 2 (delayed by 65ms)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(880, now + 0.065); // A5
        gain2.gain.setValueAtTime(0.11, now + 0.065);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.065);
        osc2.stop(now + 0.35);
      }
    } catch (e) {
      // Browsers may restrict audio until first interaction; gracefully ignore
    }
  }, [soundEnabled]);

  // Helper to extract and format clean name
  const extractCleanName = (raw) => {
    let text = (raw || "").replace(/^(my name is|i am|i'm|this is|call me|myself|hey i am|hello i am)\s+/i, "").trim();
    text = text.replace(/[.!?,].*$/, "").trim();
    if (!text) text = (raw || "").trim();
    return text
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  // Initialize or restore session ID & visitor name from localStorage
  useEffect(() => {
    let storedSession = "";
    let savedName = "";
    try {
      savedName = localStorage.getItem("twj_visitor_name") || "";
      if (savedName) setUserName(savedName);

      storedSession = localStorage.getItem("twj_ai_session_id");
      if (!storedSession) {
        storedSession = `twj_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        localStorage.setItem("twj_ai_session_id", storedSession);
      }
      setSessionId(storedSession);
    } catch (e) {
      storedSession = `twj_sess_${Date.now()}`;
      setSessionId(storedSession);
    }

    // Load existing messages
    if (storedSession) {
      fetch(`/api/ai/chat?sessionId=${storedSession}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages(data.messages);
            if (data.leadData) {
              setLeadData(data.leadData);
              if (data.leadData.name && !savedName) {
                setUserName(data.leadData.name);
                localStorage.setItem("twj_visitor_name", data.leadData.name);
              }
            }
            if (data.leadScore) setLeadScore(data.leadScore);
          } else {
            // Initial welcome: Ask name first if not saved
            if (savedName) {
              setMessages([
                {
                  id: "welcome_saved",
                  role: "assistant",
                  content: `👋 **Welcome back, ${savedName}!**\n\nI am your dedicated enterprise technology & architecture specialist for **TechWithJoshi Private Limited**.\n\nWhether you're looking to build an **AI SaaS**, develop **custom web/mobile apps**, or architect **cloud infrastructure**, I'm here to assist!\n\nWhat kind of digital product are you planning to build?`,
                  timestamp: new Date(),
                },
              ]);
            } else {
              setMessages([
                {
                  id: "welcome_name_req",
                  role: "assistant",
                  content: "👋 **Hello! Welcome to TechWithJoshi.**\n\nI am your dedicated technology & enterprise architecture specialist.\n\nTo get started and personalize your project consultation, **may I know your name?**",
                  timestamp: new Date(),
                  isNamePrompt: true,
                },
              ]);
            }
          }
        })
        .catch(() => {
          if (savedName) {
            setMessages([
              {
                id: "welcome_saved",
                role: "assistant",
                content: `👋 **Welcome back, ${savedName}!**\n\nHow can I help engineer your next digital product or AI solution today?`,
                timestamp: new Date(),
              },
            ]);
          } else {
            setMessages([
              {
                id: "welcome_name_req",
                role: "assistant",
                content: "👋 **Hello! Welcome to TechWithJoshi.**\n\nTo begin our project consultation, **what is your name?**",
                timestamp: new Date(),
                isNamePrompt: true,
              },
            ]);
          }
        });
    }
  }, []);

  // Handle name submission
  const handleNameSubmit = (providedName) => {
    const raw = (providedName || nameInput || inputMessage).trim();
    if (!raw) return;

    const clean = extractCleanName(raw);
    try {
      localStorage.setItem("twj_visitor_name", clean);
    } catch (e) {}
    setUserName(clean);
    setNameInput("");
    setInputMessage("");

    const userMsg = {
      id: `msg_u_${Date.now()}`,
      role: "user",
      content: raw,
      timestamp: new Date(),
    };

    const welcomeReply = {
      id: `msg_w_${Date.now()}`,
      role: "assistant",
      content: `🎉 **Welcome, ${clean}!** Wonderful to connect with you.\n\nAt **TechWithJoshi**, we engineer enterprise **AI Systems & SaaS**, build scalable **Web & Mobile Apps**, modernize existing codebases, and deploy high-performance **Cloud Architectures**.\n\nWhat kind of digital product or software challenge are you looking to solve?`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, welcomeReply]);
    playAudioChime("send");
    setTimeout(() => playAudioChime("receive"), 350);

    // Send to backend to track lead name
    fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        message: `Visitor introduced themselves as: ${clean}`,
        userDetails: { name: clean },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.leadData) setLeadData(data.leadData);
      })
      .catch((e) => console.error("Error saving visitor name:", e));
  };

  // Scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    // If visitor has not provided their name yet, treat first message as name
    if (!userName) {
      handleNameSubmit(text);
      return;
    }

    setInputMessage("");
    const tempUserMsg = {
      id: `msg_u_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    playAudioChime("send");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: text,
          userDetails: { name: userName },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reach AI");

      const aiMsg = {
        id: `msg_a_${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      playAudioChime("receive");
      if (data.leadData) setLeadData(data.leadData);
      if (data.leadScore) setLeadScore(data.leadScore);

      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: "assistant",
          content:
            "⚠️ " +
            (err.message ||
              "I am momentarily recalibrating. You can directly connect with Founder Dhanesh Joshi on WhatsApp at +91 7623890736."),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    if (!confirm("Start a new conversation with TechWithJoshi AI?")) return;
    const newSession = `twj_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem("twj_ai_session_id", newSession);
    setSessionId(newSession);
    setLeadData(null);
    setLeadScore(null);
    setUserName("");
    try {
      localStorage.removeItem("twj_visitor_name");
    } catch (e) {}

    setMessages([
      {
        id: "welcome_reset",
        role: "assistant",
        content:
          "👋 **Hello! TechWithJoshi AI restarted.**\n\nBefore we begin, **may I know your name?**",
        timestamp: new Date(),
        isNamePrompt: true,
      },
    ]);
  };

  // Build direct WhatsApp prefilled requirement text with user's verified name
  const getWhatsAppLeadLink = () => {
    const name = userName || leadData?.name || (typeof window !== "undefined" ? localStorage.getItem("twj_visitor_name") : "") || "Website Visitor";
    const project = leadData?.project_type || "Software Development & AI Solutions";
    const req = leadData?.requirement || "Discuss project scope & engineering sprint";
    const timeline = leadData?.timeline || "Immediate / 1-3 Months";

    const text = `Hi Dhanesh,

My name is ${name}.
I connected with TechWithJoshi AI on your website:
• Name: ${name}
• Project: ${project}
• Timeline: ${timeline}
• Requirement: ${req}

I would like to discuss next steps and project estimation.`;

    return `https://wa.me/917623890736?text=${encodeURIComponent(text)}`;
  };

  // Quick Chips
  const QUICK_PROMPTS = [
    "🚀 Build an AI SaaS or Agent",
    "💻 Custom Web & Mobile App",
    "☁️ Cloud Architecture & DevOps",
    "⚡ Modernize Existing Codebase",
    "💼 Request Project Cost & Timeline",
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!hideFloatingTrigger && (
        <div style={{ position: "relative", alignSelf: "flex-end" }}>
          <button
            className="twj-chat-trigger-btn"
            onClick={handleToggle}
            aria-label="Toggle TechWithJoshi AI Assistant"
          style={{
            position: "relative",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7928CA 0%, #00DFD8 100%)",
            color: "#ffffff",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            boxShadow: "0 8px 30px rgba(121, 40, 202, 0.6), 0 0 20px rgba(0, 223, 216, 0.4)",
            cursor: "pointer",
            transition: "transform 0.25s, box-shadow 0.25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 12px 35px rgba(121, 40, 202, 0.8), 0 0 25px rgba(0, 223, 216, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 8px 30px rgba(121, 40, 202, 0.6), 0 0 20px rgba(0, 223, 216, 0.4)";
          }}
        >
          {isOpen ? (
            <i className="bi bi-x-lg" style={{ fontSize: "22px" }}></i>
          ) : (
            <i className="bi bi-robot" style={{ fontSize: "24px" }}></i>
          )}

          {/* Glowing Ping Dot */}
          {!isOpen && (
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
            ></span>
          )}
        </button>

        {/* Floating Tooltip Pill */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            style={{
              position: "absolute",
              right: "68px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(18, 10, 36, 0.92)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(121, 40, 202, 0.5)",
              color: "#ffffff",
              padding: "7px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "700",
              whiteSpace: "nowrap",
              cursor: "pointer",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              gap: "7px",
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
            ></span>
            <span>TechWithJoshi AI • Online</span>
          </div>
        )}
      </div>
      )}

      {/* Main Chat Drawer / Window */}
      {isOpen && (
        <div
          className="ai-chat-window animate__animated animate__fadeInUp"
          style={{
            position: "fixed",
            bottom: "95px",
            right: "25px",
            width: "410px",
            maxWidth: "calc(100vw - 40px)",
            height: "620px",
            maxHeight: "calc(100vh - 120px)",
            background: "radial-gradient(circle at 80% 10%, rgba(121, 40, 202, 0.25) 0%, rgba(12, 6, 24, 0.96) 65%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(121, 40, 202, 0.4)",
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(121, 40, 202, 0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 99999,
            fontFamily: "var(--font-saira), 'Inter', system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 18px",
              background: "rgba(18, 10, 36, 0.85)",
              borderBottom: "1px solid rgba(121, 40, 202, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: "800",
                  boxShadow: "0 4px 15px rgba(121, 40, 202, 0.5)",
                }}
              >
                <i className="bi bi-robot"></i>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#ffffff", letterSpacing: "0.3px" }}>
                    TechWithJoshi <span style={{ color: "#00dfd8" }}>AI</span>
                  </h4>
                  <span
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      color: "#34d399",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "2px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    CTO Level
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#10b981",
                      display: "inline-block",
                      boxShadow: "0 0 6px #10b981",
                    }}
                  ></span>
                  <span>{userName ? `Assisting ${userName}` : "Technology & Business Specialist"}</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Mute Audio Notifications" : "Enable Audio Notifications"}
                style={{
                  background: soundEnabled ? "rgba(0, 223, 216, 0.12)" : "rgba(255, 255, 255, 0.05)",
                  border: soundEnabled ? "1px solid rgba(0, 223, 216, 0.35)" : "1px solid rgba(255, 255, 255, 0.1)",
                  color: soundEnabled ? "#00DFD8" : "#94a3b8",
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "13px",
                  transition: "all 0.2s",
                }}
              >
                <i className={`bi ${soundEnabled ? "bi-volume-up-fill" : "bi-volume-mute-fill"}`}></i>
              </button>
              <button
                onClick={handleResetChat}
                title="Restart Chat"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#94a3b8",
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "13px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00dfd8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
              <button
                onClick={handleClose}
                title="Close Window"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#94a3b8",
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Lead Status Bar (If user qualifies as lead) */}
          {(leadScore || leadData?.requirement) && (
            <div
              style={{
                background:
                  leadScore === "HOT"
                    ? "rgba(239, 68, 68, 0.12)"
                    : leadScore === "WARM"
                    ? "rgba(245, 158, 11, 0.12)"
                    : "rgba(59, 130, 246, 0.12)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px" }}>
                  {leadScore === "HOT" ? "🔥" : leadScore === "WARM" ? "🟡" : "🔵"}
                </span>
                <span style={{ fontWeight: "700", color: "#f8fafc" }}>
                  {leadScore === "HOT"
                    ? "High-Priority Requirement Identified"
                    : leadScore === "WARM"
                    ? "Project Requirement Registered"
                    : "General Technology Consultation"}
                </span>
              </div>
              <a
                href={getWhatsAppLeadLink()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#25d366",
                  color: "#ffffff",
                  padding: "4px 9px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "700",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <i className="fab fa-whatsapp"></i>
                <span>Connect</span>
              </a>
            </div>
          )}

          {/* Message Stream */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id || idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "88%",
                      padding: "12px 16px",
                      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: isUser
                        ? "linear-gradient(135deg, #7928ca 0%, #6610f2 100%)"
                        : "rgba(22, 14, 44, 0.8)",
                      border: isUser
                        ? "1px solid rgba(255, 255, 255, 0.2)"
                        : "1px solid rgba(121, 40, 202, 0.35)",
                      color: "#f8fafc",
                      fontSize: "13.5px",
                      lineHeight: "1.55",
                      whiteSpace: "pre-wrap",
                      boxShadow: isUser
                        ? "0 4px 15px rgba(121, 40, 202, 0.3)"
                        : "0 4px 15px rgba(0, 0, 0, 0.3)",
                      wordBreak: "break-word",
                    }}
                  >
                    <FormattedAiMessage content={m.content} isUser={isUser} />
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#64748b",
                      marginTop: "4px",
                      padding: "0 4px",
                    }}
                  >
                    {isUser ? "You" : "TechWithJoshi AI"}
                  </span>
                </div>
              );
            })}

            {/* Interactive Name Collection Card */}
            {!userName && (
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(121, 40, 202, 0.22) 0%, rgba(0, 223, 216, 0.15) 100%)",
                  border: "1px solid rgba(0, 223, 216, 0.4)",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  maxWidth: "92%",
                  alignSelf: "flex-start",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
                  marginBottom: "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", color: "#00dfd8", fontSize: "12px", fontWeight: "700" }}>
                  <i className="bi bi-person-badge"></i>
                  <span>Enter your name to personalize your consultation:</span>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNameSubmit();
                  }}
                  style={{ display: "flex", gap: "8px" }}
                >
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Your Name (e.g. Rahul Sharma)"
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      background: "rgba(10, 5, 20, 0.85)",
                      border: "1px solid rgba(121, 40, 202, 0.5)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!nameInput.trim()}
                    style={{
                      background: nameInput.trim() ? "linear-gradient(135deg, #00DFD8 0%, #7928CA 100%)" : "rgba(121, 40, 202, 0.3)",
                      border: "none",
                      color: "#ffffff",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: nameInput.trim() ? "pointer" : "default",
                      transition: "all 0.2s",
                    }}
                  >
                    Continue →
                  </button>
                </form>
              </div>
            )}

            {/* Typing Indicator */}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 4px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "rgba(121, 40, 202, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#00dfd8",
                    fontSize: "14px",
                  }}
                >
                  <i className="bi bi-robot"></i>
                </div>
                <div
                  style={{
                    background: "rgba(22, 14, 44, 0.8)",
                    border: "1px solid rgba(121, 40, 202, 0.3)",
                    padding: "10px 16px",
                    borderRadius: "16px 16px 16px 4px",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <span className="spinner-grow spinner-grow-sm text-info" style={{ width: "8px", height: "8px" }} />
                  <span className="spinner-grow spinner-grow-sm text-light" style={{ width: "8px", height: "8px" }} />
                  <span className="spinner-grow spinner-grow-sm text-primary" style={{ width: "8px", height: "8px" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Action Hub (Quick Chips & WhatsApp Escalate) */}
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(15, 8, 30, 0.9)",
              borderTop: "1px solid rgba(121, 40, 202, 0.2)",
            }}
          >
            {/* Quick Chips if conversation is fresh */}
            {messages.length <= 2 && (
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                  scrollbarWidth: "none",
                }}
              >
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    style={{
                      background: "rgba(121, 40, 202, 0.15)",
                      border: "1px solid rgba(121, 40, 202, 0.35)",
                      color: "#cbd5e1",
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(0, 223, 216, 0.2)";
                      e.currentTarget.style.borderColor = "#00dfd8";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(121, 40, 202, 0.15)";
                      e.currentTarget.style.borderColor = "rgba(121, 40, 202, 0.35)";
                      e.currentTarget.style.color = "#cbd5e1";
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Direct Connect Row */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <a
                href={getWhatsAppLeadLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!userName) {
                    e.preventDefault();
                    const entered = prompt("Please enter your name so Dhanesh knows who is reaching out:", "");
                    if (entered && entered.trim()) {
                      handleNameSubmit(entered.trim());
                      const wa = `https://wa.me/917623890736?text=${encodeURIComponent(
                        `Hi Dhanesh,\n\nMy name is ${entered.trim()}.\nI connected with TechWithJoshi AI on your website and would like to discuss a project.`
                      )}`;
                      window.open(wa, "_blank");
                    }
                  }
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  color: "#ffffff",
                  padding: "7px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  textDecoration: "none",
                  boxShadow: "0 2px 10px rgba(37, 211, 102, 0.3)",
                }}
              >
                <i className="fab fa-whatsapp"></i>
                <span>Connect with Dhanesh on WhatsApp</span>
              </a>

              {onOpenCal && (
                <button
                  type="button"
                  onClick={onOpenCal}
                  style={{
                    background: "rgba(121, 40, 202, 0.25)",
                    border: "1px solid rgba(121, 40, 202, 0.5)",
                    color: "#00dfd8",
                    padding: "7px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  title="Book Call"
                >
                  <i className="bi bi-calendar2-check"></i>
                  <span>Call</span>
                </button>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  !userName
                    ? "Enter your name to begin..."
                    : "Ask about tech stack, pricing, AI SaaS, timeline..."
                }
                style={{
                  flex: 1,
                  padding: "11px 14px",
                  background: "rgba(22, 14, 44, 0.9)",
                  border: "1px solid rgba(121, 40, 202, 0.4)",
                  borderRadius: "10px",
                  color: "#ffffff",
                  fontSize: "13px",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#00dfd8")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(121, 40, 202, 0.4)")}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background:
                    !inputMessage.trim() || loading
                      ? "rgba(121, 40, 202, 0.25)"
                      : "linear-gradient(135deg, #7928CA 0%, #00DFD8 100%)",
                  border: "none",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: !inputMessage.trim() || loading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  transition: "all 0.2s",
                }}
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
