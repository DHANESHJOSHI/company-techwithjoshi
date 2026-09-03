import React, { useState, useEffect, useRef } from "react";

function Preloader() {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("INITIALIZING ENTERPRISE RUNTIME...");

  // Progress & Status sequence
  useEffect(() => {
    const statuses = [
      { p: 35, text: "ARCHITECTING CLUSTER NODES..." },
      { p: 68, text: "SYNCHRONIZING AI & CLOUD ENGINES..." },
      { p: 92, text: "VERIFYING SECURITY & COMPLIANCE..." },
      { p: 100, text: "TECHWITHJOSHI PLATFORM READY." },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < statuses.length) {
        setProgress(statuses[currentStep].p);
        setStatusText(statuses[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 380);

    return () => clearInterval(interval);
  }, []);

  // Futuristic Canvas Constellation in Brand Colors (#7928CA & #00DFD8)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = document.documentElement.clientWidth || window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = document.documentElement.clientWidth || window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const particles = [];
    const colors = ["#00DFD8", "#7928CA", "#A855F7", "#38BDF8"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with glowing gradient lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(121, 40, 202, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="twj-preloader-container">
      {/* Background Interactive Star-Mesh Canvas */}
      <canvas ref={canvasRef} className="twj-preloader-canvas" />

      {/* Center Cinematic Card */}
      <div className="twj-preloader-center">
        {/* Ambient Radial Nebula Aura */}
        <div className="twj-preloader-aura" />

        {/* Dual Orbital Rings with Glowing Scanner */}
        <div className="twj-orbital-stage">
          <div className="twj-orbit-outer" />
          <div className="twj-orbit-scanner" />
          <div className="twj-orbit-inner" />

          {/* Glowing Brand Icon Badge */}
          <div className="twj-preloader-badge">
            <svg width={72} height={72} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="twj-loader-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7928CA" />
                  <stop offset="100%" stopColor="#00DFD8" />
                </linearGradient>
                <filter id="twj-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00DFD8" floodOpacity="0.7" />
                </filter>
              </defs>
              <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#twj-loader-glow)" />
              <rect x="4.5" y="4.5" width="35" height="35" rx="10" fill="#0C0618" />
              <path
                d="M14 15H30M22 15V29C22 30.8 20.2 32 18 32C16 32 14.5 30.8 14.5 29"
                stroke="url(#twj-loader-glow)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#twj-shadow)"
              />
              <circle cx="28" cy="27" r="3.2" fill="#00DFD8" filter="url(#twj-shadow)" />
            </svg>
          </div>
        </div>

        {/* Brand Name & Tag */}
        <div className="twj-preloader-info">
          <div className="twj-preloader-title-row">
            <span className="twj-preloader-main">TechWith</span>
            <span className="twj-preloader-highlight">Joshi</span>
          </div>
          <span className="twj-preloader-corp-badge">PRIVATE LIMITED</span>

          {/* Futuristic Progress Tracker */}
          <div className="twj-progress-wrapper">
            <div className="twj-progress-track">
              <div
                className="twj-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="twj-progress-percent">{progress}%</span>
          </div>

          {/* Typing System Status */}
          <div className="twj-preloader-status">
            <span className="twj-status-dot" />
            <span className="twj-status-text">{statusText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
