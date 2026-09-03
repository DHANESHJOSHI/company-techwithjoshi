import React, { useState, useRef } from "react";

export default function ImageUploadInput({ label = "Featured Image", value = "", onChange, helpText = "Provide a public image URL or upload directly from your device." }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP, SVG, GIF)");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setUploadError("Image size exceeds 12MB limit");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            data: base64Data,
            name: file.name
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        onChange(data.url);
      } catch (err) {
        console.error("Upload error:", err);
        setUploadError(err.message || "Failed to upload image");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      setUploadError("Failed to read local file");
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const copyToClipboard = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="image-upload-wrapper mb-3" style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(121,40,202,0.25)" }}>
      <label className="form-label d-flex align-items-center justify-content-between text-white fw-bold mb-2">
        <span>{label}</span>
        {value && (
          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1" style={{ fontSize: "11px" }}>
            Image Linked
          </span>
        )}
      </label>

      <div className="input-group mb-2">
        <span className="input-group-text bg-dark border-secondary text-info">
          <i className="bi bi-link-45deg" />
        </span>
        <input
          type="text"
          className="form-control bg-dark text-white border-secondary"
          placeholder="Paste image URL (e.g. /assets/img/... or https://...)"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-outline-info d-flex align-items-center gap-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <i className="bi bi-cloud-arrow-up-fill" />
              <span>Upload</span>
            </>
          )}
        </button>
        {value && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            title="Copy URL"
            onClick={copyToClipboard}
          >
            <i className={`bi ${copied ? "bi-check2 text-success" : "bi-clipboard"}`} />
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        style={{ display: "none" }}
      />

      {uploadError && (
        <div className="text-danger small mt-1 mb-2">
          <i className="bi bi-exclamation-triangle-fill me-1" />
          {uploadError}
        </div>
      )}

      {/* Live Preview Card */}
      {value ? (
        <div className="position-relative mt-2 d-inline-block rounded-3 overflow-hidden border border-secondary" style={{ maxWidth: "100%" }}>
          <img
            src={value}
            alt="Preview"
            style={{ maxHeight: "160px", maxWidth: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => {
              e.target.style.display = "none";
              const errEl = e.target.nextSibling;
              if (errEl) errEl.style.display = "block";
            }}
          />
          <div style={{ display: "none", padding: "15px", background: "rgba(220,53,69,0.15)", color: "#ff6b6b", fontSize: "12px" }}>
            <i className="bi bi-image-alt me-1" /> Unable to preview image from URL
          </div>
          <button
            type="button"
            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-1 rounded-circle"
            style={{ width: "26px", height: "26px", lineHeight: "1", fontSize: "12px" }}
            title="Clear Image"
            onClick={() => onChange("")}
          >
            &times;
          </button>
        </div>
      ) : (
        <div className="small text-muted mt-1" style={{ fontSize: "12px" }}>
          <i className="bi bi-info-circle me-1" /> {helpText}
        </div>
      )}
    </div>
  );
}
