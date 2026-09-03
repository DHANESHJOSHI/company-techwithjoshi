import React, { useState, useRef, useEffect } from "react";

export default function RichTextEditor({ value = "", onChange, label = "Article / Description Content", minHeight = "280px" }) {
  const [activeTab, setActiveTab] = useState("visual"); // 'visual' | 'html' | 'preview'
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(() => {
    setInternalValue(value || "");
    if (editorRef.current && activeTab === "visual" && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, activeTab]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setInternalValue(html);
      onChange(html);
    }
  };

  const handleHtmlChange = (e) => {
    const val = e.target.value;
    setInternalValue(val);
    onChange(val);
  };

  const exec = (command, arg = null) => {
    if (activeTab !== "visual") return;
    document.execCommand(command, false, arg);
    handleEditorInput();
  };

  const insertHeading = (tag) => {
    exec("formatBlock", `<${tag}>`);
  };

  const insertLink = () => {
    const url = prompt("Enter hyperlink URL (e.g. https://...):", "https://");
    if (url && url !== "https://") {
      exec("createLink", url);
    }
  };

  const insertImagePrompt = () => {
    const url = prompt("Enter image URL:", "https://");
    if (url && url !== "https://") {
      exec("insertImage", url);
    }
  };

  const insertVideoEmbed = () => {
    const url = prompt("Enter YouTube / Vimeo / Video URL (e.g. https://www.youtube.com/watch?v=...):");
    if (!url) return;

    let embedUrl = url;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    const videoHtml = `
      <div class="video-embed-container my-4" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; border: 1px solid rgba(121,40,202,0.3);">
        <iframe src="${embedUrl}" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen loading="lazy"></iframe>
      </div><p></p>
    `;

    if (activeTab === "visual") {
      exec("insertHTML", videoHtml);
    } else {
      const updated = internalValue + videoHtml;
      setInternalValue(updated);
      onChange(updated);
    }
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            data: reader.result,
            name: file.name
          })
        });
        const data = await res.json();
        if (res.ok && data.url) {
          const imgHtml = `<p><img src="${data.url}" alt="${file.name}" style="max-width: 100%; border-radius: 12px; margin: 15px 0;" /></p><p></p>`;
          if (activeTab === "visual") {
            exec("insertHTML", imgHtml);
          } else {
            const updated = internalValue + imgHtml;
            setInternalValue(updated);
            onChange(updated);
          }
        } else {
          alert("Image upload failed: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        alert("Upload error: " + err.message);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rich-text-editor-container mb-3" style={{ border: "1px solid rgba(121,40,202,0.3)", borderRadius: "12px", background: "#0c0817", overflow: "hidden" }}>
      {/* Header Bar */}
      <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom border-secondary border-opacity-25" style={{ background: "rgba(14,9,27,0.8)" }}>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-fonts text-info" />
          <span className="fw-bold text-white small">{label}</span>
        </div>
        <div className="btn-group btn-group-sm">
          <button
            type="button"
            className={`btn ${activeTab === "visual" ? "btn-info text-dark fw-bold" : "btn-outline-secondary text-white"}`}
            onClick={() => setActiveTab("visual")}
          >
            <i className="bi bi-eye me-1" /> Visual
          </button>
          <button
            type="button"
            className={`btn ${activeTab === "html" ? "btn-info text-dark fw-bold" : "btn-outline-secondary text-white"}`}
            onClick={() => setActiveTab("html")}
          >
            <i className="bi bi-code-slash me-1" /> HTML Code
          </button>
          <button
            type="button"
            className={`btn ${activeTab === "preview" ? "btn-info text-dark fw-bold" : "btn-outline-secondary text-white"}`}
            onClick={() => setActiveTab("preview")}
          >
            <i className="bi bi-display me-1" /> Live Preview
          </button>
        </div>
      </div>

      {/* Toolbar (Active in Visual mode) */}
      {activeTab === "visual" && (
        <div className="editor-toolbar d-flex flex-wrap gap-1 p-2 border-bottom border-secondary border-opacity-25" style={{ background: "rgba(255,255,255,0.02)" }}>
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary" title="Heading 2" onClick={() => insertHeading("h2")}>H2</button>
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary" title="Heading 3" onClick={() => insertHeading("h3")}>H3</button>
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary" title="Heading 4" onClick={() => insertHeading("h4")}>H4</button>
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary" title="Paragraph" onClick={() => insertHeading("p")}>P</button>
          
          <div className="vr bg-secondary opacity-50 mx-1" />
          
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary fw-bold" title="Bold" onClick={() => exec("bold")}><i className="bi bi-type-bold" /></button>
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary fst-italic" title="Italic" onClick={() => exec("italic")}><i className="bi bi-type-italic" /></button>
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary text-decoration-underline" title="Underline" onClick={() => exec("underline")}><i className="bi bi-type-underline" /></button>
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary" title="Quote" onClick={() => insertHeading("blockquote")}><i className="bi bi-quote" /></button>
          
          <div className="vr bg-secondary opacity-50 mx-1" />
          
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary" title="Bullet List" onClick={() => exec("insertUnorderedList")}><i className="bi bi-list-ul" /></button>
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary" title="Numbered List" onClick={() => exec("insertOrderedList")}><i className="bi bi-list-ol" /></button>
          
          <div className="vr bg-secondary opacity-50 mx-1" />
          
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary" title="Insert Link" onClick={insertLink}><i className="bi bi-link" /></button>
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary" title="Insert Image by URL" onClick={insertImagePrompt}><i className="bi bi-card-image" /></button>
          <button type="button" className="btn btn-sm btn-outline-info text-info border-info" title="Upload Local Image" onClick={() => fileInputRef.current?.click()}><i className="bi bi-cloud-arrow-up" /> Upload Img</button>
          <button type="button" className="btn btn-sm btn-outline-danger text-danger border-danger" title="Embed Video / YouTube" onClick={insertVideoEmbed}><i className="bi bi-play-btn-fill" /> Video</button>
          
          <div className="vr bg-secondary opacity-50 mx-1" />
          
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary" title="Horizontal Line" onClick={() => exec("insertHorizontalRule")}><i className="bi bi-hr" /></button>
          <button type="button" className="btn btn-sm btn-dark text-white border-secondary" title="Code Block" onClick={() => exec("insertHTML", "<pre><code>// Enter your code here\n</code></pre><p></p>")}>&lt;/&gt;</button>
          <button type="button" className="btn btn-sm btn-dark text-warning border-secondary" title="Clear Formatting" onClick={() => exec("removeFormat")}><i className="bi bi-eraser" /></button>
        </div>
      )}

      {/* Hidden file input for toolbar image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFile}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Mode 1: Visual Editable Area */}
      {activeTab === "visual" && (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleEditorInput}
          className="rich-editor-canvas text-white p-3"
          style={{
            minHeight: minHeight,
            maxHeight: "650px",
            overflowY: "auto",
            outline: "none",
            fontSize: "15px",
            lineHeight: "1.7",
            fontFamily: "var(--font-d-manope), sans-serif"
          }}
          placeholder="Start writing rich article, case study, or service description..."
        />
      )}

      {/* Mode 2: HTML Source Editor */}
      {activeTab === "html" && (
        <textarea
          className="form-control bg-dark text-info border-0 rounded-0 p-3"
          style={{
            minHeight: minHeight,
            fontFamily: "monospace",
            fontSize: "13px",
            lineHeight: "1.6"
          }}
          value={internalValue}
          onChange={handleHtmlChange}
          placeholder="Enter clean raw HTML tags..."
        />
      )}

      {/* Mode 3: Live Preview Tab */}
      {activeTab === "preview" && (
        <div
          className="rich-preview-canvas p-4 text-white"
          style={{
            minHeight: minHeight,
            maxHeight: "650px",
            overflowY: "auto",
            background: "radial-gradient(circle at 10% 20%, rgba(121, 40, 202, 0.1) 0%, #080411 90%)"
          }}
          dangerouslySetInnerHTML={{ __html: internalValue || "<p className='text-muted'>No content written yet. Switch to Visual Editor to compose.</p>" }}
        />
      )}
    </div>
  );
}
