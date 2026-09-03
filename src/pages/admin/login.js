import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already logged in, redirect to /admin
  // If already logged in, redirect to /admin
  useEffect(() => {
    async function checkExistingAuth() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("/api/auth/me", { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            window.location.href = "/admin";
          }
        }
      } catch (err) {
        // Not logged in
      }
    }
    checkExistingAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernameOrEmail: identifier.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (data.token) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        document.cookie = `admin_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      }

      window.location.href = "/admin";
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - TechWithJoshi CMS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at top, #1b0e38 0%, #0c0618 60%, #06020c 100%)",
          color: "#e2e8f0",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          padding: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "15%",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(121, 40, 202, 0.25) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "15%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(0, 223, 216, 0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            background: "rgba(18, 12, 36, 0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(121, 40, 202, 0.35)",
            borderRadius: "20px",
            padding: "40px 36px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(121, 40, 202, 0.15)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Logo & Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "12px" }}>
                <span
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: "800",
                    fontSize: "20px",
                    boxShadow: "0 4px 15px rgba(121, 40, 202, 0.4)",
                  }}
                >
                  TW
                </span>
                <span style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px", color: "#ffffff" }}>
                  TechWith<span style={{ color: "#00dfd8" }}>Joshi</span>
                </span>
              </div>
            </Link>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px 0" }}>
              Enterprise CMS Portal
            </h2>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
              Sign in to manage dynamic pages, content, and inquiries
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#fca5a5",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "16px" }}></i>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#cbd5e1",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Username or Email
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your username or email"
                  style={{
                    width: "100%",
                    padding: "14px 16px 14px 44px",
                    background: "rgba(10, 5, 22, 0.8)",
                    border: "1px solid rgba(121, 40, 202, 0.3)",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#00dfd8";
                    e.target.style.boxShadow = "0 0 12px rgba(0, 223, 216, 0.25)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(121, 40, 202, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <i
                  className="bi bi-person"
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    fontSize: "18px",
                  }}
                ></i>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Password
                </label>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: "100%",
                    padding: "14px 48px 14px 44px",
                    background: "rgba(10, 5, 22, 0.8)",
                    border: "1px solid rgba(121, 40, 202, 0.3)",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#00dfd8";
                    e.target.style.boxShadow = "0 0 12px rgba(0, 223, 216, 0.25)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(121, 40, 202, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <i
                  className="bi bi-shield-lock"
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    fontSize: "18px",
                  }}
                ></i>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "18px",
                    padding: "4px",
                  }}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)",
                border: "none",
                borderRadius: "10px",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 20px rgba(121, 40, 202, 0.4)",
                transition: "opacity 0.2s, transform 0.1s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.opacity = "0.92";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.opacity = "1";
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                    style={{ width: "18px", height: "18px" }}
                  ></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>Sign In to Admin CMS</span>
                </>
              )}
            </button>

            {/* Quick credentials chip */}
            <div
              style={{
                marginTop: "18px",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "rgba(121, 40, 202, 0.15)",
                border: "1px dashed rgba(0, 223, 216, 0.35)",
                fontSize: "12px",
                color: "#cbd5e1",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span>User: <strong style={{ color: "#00dfd8" }}>admin-twj</strong></span>
                <span style={{ margin: "0 8px", opacity: 0.4 }}>|</span>
                <span>Pass: <strong style={{ color: "#00dfd8" }}>fluidislive2024</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIdentifier("admin-twj");
                  setPassword("fluidislive2024");
                }}
                style={{
                  background: "rgba(0, 223, 216, 0.15)",
                  border: "1px solid #00dfd8",
                  color: "#ffffff",
                  fontSize: "11px",
                  padding: "4px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Auto-Fill
              </button>
            </div>
          </form>

          {/* Footer Back Link */}
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link
              href="/"
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00dfd8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              <i className="bi bi-arrow-left"></i>
              <span>Back to TechWithJoshi Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
