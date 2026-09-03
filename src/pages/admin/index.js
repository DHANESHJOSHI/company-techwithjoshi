import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ImageUploadInput from "@/components/admin/ImageUploadInput";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [adminUser, setAdminUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Collections State
  const [cms, setCms] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [team, setTeam] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [news, setNews] = useState([]);
  const [liveNewsStream, setLiveNewsStream] = useState([]);
  const [blogSubTab, setBlogSubTab] = useState("articles"); // "articles" | "news" | "liveStream"
  const [settings, setSettings] = useState({});
  const [aiSessions, setAiSessions] = useState([]);
  const [selectedSessionTranscript, setSelectedSessionTranscript] = useState(null);
  const [aiGenLoading, setAiGenLoading] = useState(false);
  const [aiFilter, setAiFilter] = useState("all");
  const [ceoProfile, setCeoProfile] = useState({
    name: "Dhanesh Joshi",
    designation: "CEO & Founder",
    company: "TechWithJoshi Private Limited",
    location: "Gujarat, India • Global Operations",
    headline: "Visionary Full-Stack Engineer, AI Innovator & Cloud Enterprise Architect",
    image: "/assets/img/founder/dhanesh-joshi.png",
    bio: "",
    visionQuote: "",
    quoteAuthor: "Dhanesh Joshi",
    quoteAuthorTitle: "CEO & Principal Architect",
    credlyBadgeUrl: "https://www.credly.com/badges/b02cb041-67bd-487d-b261-7b7318a89f36/linked_in?t=sr9p06",
    credlyImg: "/assets/img/founder/mongodb-associate-developer-badge.png",
    linkedinCertificationsUrl: "https://www.linkedin.com/in/dhanesh-joshi/details/certifications/",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
      github: "https://github.com/DHANESHJOSHI",
      instagram: "https://www.instagram.com/its_dhanesh_joshi_/",
      cal: "https://cal.com/dhanesh-joshi/30min"
    },
    metrics: [],
    certifications: [],
    skillDomains: [],
    techBadges: []
  });

  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [inquiryFilter, setInquiryFilter] = useState("all");

  // Form States for Adding New Items
  const [newService, setNewService] = useState({
    title: "",
    slug: "",
    category: "Web Applications",
    icon: "bi-code-slash",
    image: "/assets/img/home-3/home3-banner-img.png",
    description: "",
    features: "Server-Side Rendering, Microservices, API Integrations",
    details: "",
    content: "<h3>Service Scope</h3><p>Describe technical deliverables and workflow...</p>",
    order: 1
  });

  const [newProject, setNewProject] = useState({
    title: "",
    slug: "",
    category: "Cloud Architecture",
    client: "Enterprise Partner",
    image: "/assets/img/home-3/home3-suc-sto-01.png",
    link: "/project-details",
    description: "",
    deliverables: "Kubernetes Setup, CI/CD Pipelines, 99.99% Uptime",
    content: "<h3>Project Overview</h3><p>Technical architecture and engineering implementation...</p>",
    order: 1
  });

  const [newCaseStudy, setNewCaseStudy] = useState({
    title: "",
    slug: "",
    category: "Cloud & DevOps",
    client: "Enterprise Client",
    image: "/assets/img/home-5/home5-case-01.png?v=5",
    videoUrl: "",
    tags: "AWS, Kubernetes, Terraform",
    metrics: [{ label: "Uptime", value: "99.999%" }, { label: "Performance", value: "4.2x Faster" }],
    challenge: "",
    solution: "",
    content: "<h2>Challenge &amp; Architecture Overhaul</h2><p>Describe problem, technical solution, and measurable business impact...</p>",
    order: 1
  });

  const [newFaq, setNewFaq] = useState({ question: "", answer: "", category: "General", order: 1 });
  const [newTestimonial, setNewTestimonial] = useState({ name: "", designation: "VP of Engineering", company: "", review: "", rating: 5, avatar: "/assets/img/home-3/h3-testi-01.png", order: 1 });
  const [newPricing, setNewPricing] = useState({ title: "Custom Sprint", price: "2,500", yearlyPrice: "1,999", period: "sprint", description: "Tailored engineering engagement", features: "Architecture Blueprint, CI/CD Pipeline, Next.js Frontend", isPopular: false, link: "/contact" });
  const [newTeam, setNewTeam] = useState({ name: "", designation: "Senior Architect", image: "/assets/img/home-4/experts-01.png", socialLinks: { linkedin: "https://www.linkedin.com/in/dhanesh-joshi/", instagram: "https://www.instagram.com/its_dhanesh_joshi_/" } });
  
  const [newBlog, setNewBlog] = useState({
    title: "",
    slug: "",
    category: "AI & Software",
    author: "TechWithJoshi Team",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readTime: "5 min read",
    comments: "0",
    image: "/assets/img/home-3/home3-blog-01.png",
    videoUrl: "",
    tags: "Next.js, AI, Cloud Architecture",
    excerpt: "",
    content: "<h2>Executive Summary</h2><p>Start writing high-impact engineering article...</p>"
  });

  const [newNewsItem, setNewNewsItem] = useState({
    title: "",
    category: "IT News",
    image: "/assets/img/home-5/home5-blog-img-01.png",
    excerpt: "",
    content: "<h3>News Update</h3><p>Full details on IT and software trend...</p>",
    source: "TechWithJoshi Newsroom",
    url: "",
    tags: "AI, Tech, Cloud",
    order: 1
  });

  const [editingItem, setEditingItem] = useState(null); // { type: 'testimonial' | 'project' | 'blog' | 'caseStudy' | 'service' | 'news', data: {...} }

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ name: "", email: "", currentPassword: "", newPassword: "", confirmPassword: "" });

  const showFeedback = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4500);
  };

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  // 1. Session Verification
  useEffect(() => {
    async function verifyAuth() {
      try {
        const token = localStorage.getItem("admin_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("/api/auth/me", { headers });
        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }
        const authData = await res.json();
        if (authData.authenticated) {
          setAdminUser(authData.user);
          setProfileForm((prev) => ({ ...prev, name: authData.user.name || "", email: authData.user.email || "" }));
          setAuthChecking(false);
          fetchAllData();
        } else {
          router.replace("/admin/login");
        }
      } catch (err) {
        router.replace("/admin/login");
      }
    }
    verifyAuth();
  }, [router]);

  // 2. Fetch all collections from MongoDB
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [cmsRes, inqRes, servRes, projRes, caseRes, faqRes, testRes, teamRes, blogsRes, newsRes, setRes, aiRes] = await Promise.all([
        fetch("/api/cms"),
        fetch("/api/contact", { headers }),
        fetch("/api/services"),
        fetch("/api/projects"),
        fetch("/api/case-studies"),
        fetch("/api/faqs"),
        fetch("/api/testimonials"),
        fetch("/api/team"),
        fetch("/api/blogs"),
        fetch("/api/news"),
        fetch("/api/settings"),
        fetch("/api/ai/sessions", { headers }),
      ]);

      const [cmsData, inqData, servData, projData, caseData, faqData, testData, teamData, blogsData, newsData, setData, aiData] = await Promise.all([
        cmsRes.json(),
        inqRes.json(),
        servRes.json(),
        projRes.json(),
        caseRes.json(),
        faqRes.json(),
        testRes.json(),
        teamRes.json(),
        blogsRes.json(),
        newsRes.json(),
        setRes.json(),
        aiRes.json().catch(() => []),
      ]);

      setCms(cmsData || {});
      setInquiries(Array.isArray(inqData) ? inqData : []);
      setServices(Array.isArray(servData) ? servData : []);
      setProjects(Array.isArray(projData) ? projData : []);
      setCaseStudies(Array.isArray(caseData) ? caseData : []);
      setFaqs(Array.isArray(faqData) ? faqData : []);
      setTestimonials(Array.isArray(testData) ? testData : []);
      setTeam(Array.isArray(teamData) ? teamData : []);
      const founderDoc = Array.isArray(teamData) ? teamData.find(m => (m.name && m.name.toLowerCase().includes("dhanesh")) || (m.designation && m.designation.toLowerCase().includes("founder"))) : null;
      if (founderDoc) {
        let socials = founderDoc.socialLinks;
        if (typeof socials === "string") {
          try { socials = JSON.parse(socials.replace(/'/g, '"')); } catch {}
        }
        setCeoProfile({
          _id: founderDoc._id,
          id: founderDoc.id || "dhanesh-joshi",
          name: founderDoc.name || "Dhanesh Joshi",
          designation: founderDoc.designation || "CEO & Founder",
          company: founderDoc.company || "TechWithJoshi Private Limited",
          location: founderDoc.location || "Gujarat, India • Global Operations",
          headline: founderDoc.headline || "Visionary Full-Stack Engineer, AI Innovator & Cloud Enterprise Architect",
          image: founderDoc.image || "/assets/img/founder/dhanesh-joshi.png",
          bio: founderDoc.bio || "",
          visionQuote: founderDoc.visionQuote || "",
          quoteAuthor: founderDoc.quoteAuthor || "Dhanesh Joshi",
          quoteAuthorTitle: founderDoc.quoteAuthorTitle || "CEO & Principal Architect",
          credlyBadgeUrl: founderDoc.credlyBadgeUrl || "https://www.credly.com/badges/b02cb041-67bd-487d-b261-7b7318a89f36/linked_in?t=sr9p06",
          credlyImg: founderDoc.credlyImg || "/assets/img/founder/mongodb-associate-developer-badge.png",
          linkedinCertificationsUrl: founderDoc.linkedinCertificationsUrl || "https://www.linkedin.com/in/dhanesh-joshi/details/certifications/",
          socialLinks: {
            linkedin: socials?.linkedin || "https://www.linkedin.com/in/dhanesh-joshi/",
            github: socials?.github || "https://github.com/DHANESHJOSHI",
            instagram: socials?.instagram || "https://www.instagram.com/its_dhanesh_joshi_/",
            cal: socials?.cal || "https://cal.com/dhanesh-joshi/30min"
          },
          metrics: Array.isArray(founderDoc.metrics) ? founderDoc.metrics : [],
          certifications: Array.isArray(founderDoc.certifications) ? founderDoc.certifications : [],
          skillDomains: Array.isArray(founderDoc.skillDomains) ? founderDoc.skillDomains : [],
          techBadges: Array.isArray(founderDoc.techBadges) ? founderDoc.techBadges : []
        });
      }
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
      if (newsData && newsData.success) {
        setNews(newsData.customNews || []);
        setLiveNewsStream(newsData.liveNews || []);
      }
      setSettings(setData || {});
      setAiSessions(Array.isArray(aiData) ? aiData : []);
    } catch (err) {
      console.error("Error loading CMS data:", err);
      showFeedback("Error loading data from MongoDB Atlas", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  // Generic Save for CMS Document Sections
  const saveCmsSection = async (sectionName, data) => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ section: sectionName, data }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");
      setCms((prev) => ({ ...prev, [sectionName]: result.data }));
      showFeedback(`Section '${sectionName.toUpperCase()}' saved to MongoDB!`);
    } catch (err) {
      showFeedback(err.message, "danger");
    } finally {
      setSaving(false);
    }
  };

  // Save Global Settings
  const saveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      showFeedback("Global Site Settings updated in MongoDB Atlas!");
    } catch (err) {
      showFeedback(err.message, "danger");
    } finally {
      setSaving(false);
    }
  };

  // Update Profile & Password
  const updateProfile = async (e) => {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      return showFeedback("New passwords do not match", "danger");
    }
    setSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          currentPassword: profileForm.currentPassword,
          newPassword: profileForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setAdminUser(data.user);
      setProfileForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      showFeedback("Profile and security credentials updated!");
    } catch (err) {
      showFeedback(err.message, "danger");
    } finally {
      setSaving(false);
    }
  };

  // Services Handlers
  const handleAiGenerateService = async () => {
    if (!newService.title) return showFeedback("Please enter a Service Title first!", "danger");
    setAiGenLoading(true);
    try {
      const res = await fetch("/api/ai/generate-service", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: newService.title,
          category: newService.category || "IT Solutions",
        }),
      });
      const data = await res.json();
      if (res.ok && data.service) {
        setNewService((prev) => ({
          ...prev,
          description: data.service.description || prev.description,
          features: Array.isArray(data.service.features)
            ? data.service.features.join(", ")
            : (data.service.features || prev.features),
          details: data.service.details || prev.details,
          content: data.service.content || prev.content,
        }));
        showFeedback("Service specifications auto-generated by TechWithJoshi AI!");
      } else {
        showFeedback(data.error || "AI generation failed", "danger");
      }
    } catch {
      showFeedback("AI service generation failed", "danger");
    } finally {
      setAiGenLoading(false);
    }
  };

  const deleteAiSession = async (id) => {
    if (!confirm("Delete this AI chat conversation?")) return;
    try {
      const res = await fetch(`/api/ai/sessions?id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setAiSessions((prev) => prev.filter((s) => s.sessionId !== id && s._id !== id));
        showFeedback("AI session deleted.");
      }
    } catch {
      showFeedback("Failed to delete session", "danger");
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    if (!newService.title) return showFeedback("Title required", "danger");
    setSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newService),
      });
      const data = await res.json();
      if (res.ok) {
        setServices([...services, { ...newService, _id: data.id }]);
        setNewService({ title: "", category: "Web Applications", icon: "bi-code-slash", description: "", features: "", order: services.length + 1 });
        showFeedback("New service added to MongoDB Atlas!");
      }
    } catch {
      showFeedback("Failed to add service", "danger");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (res.ok) {
        setServices(services.filter((s) => s._id !== id));
        showFeedback("Service removed.");
      }
    } catch {
      showFeedback("Failed to delete service", "danger");
    }
  };

  // Projects Handlers
  const addProject = async (e) => {
    e.preventDefault();
    if (!newProject.title) return showFeedback("Title required", "danger");
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newProject),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects([...projects, { ...newProject, _id: data.id }]);
        setNewProject({ title: "", category: "Cloud Architecture", client: "Enterprise Client", image: "assets/img/home-3/home3-suc-sto-01.png", link: "/project-details", description: "", deliverables: "", order: projects.length + 1 });
        showFeedback("New project added to MongoDB!");
      }
    } catch {
      showFeedback("Failed to add project", "danger");
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== id));
        showFeedback("Project removed.");
      }
    } catch {
      showFeedback("Failed to delete project", "danger");
    }
  };

  // FAQs Handlers
  const addFaq = async (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return showFeedback("Question and Answer required", "danger");
    setSaving(true);
    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newFaq),
      });
      const data = await res.json();
      if (res.ok) {
        setFaqs([...faqs, { ...newFaq, _id: data.id }]);
        setNewFaq({ question: "", answer: "", category: "General", order: faqs.length + 1 });
        showFeedback("New FAQ added to MongoDB Atlas!");
      }
    } catch {
      showFeedback("Failed to add FAQ", "danger");
    } finally {
      setSaving(false);
    }
  };

  const deleteFaq = async (id) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faqs?id=${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (res.ok) {
        setFaqs(faqs.filter((f) => f._id !== id));
        showFeedback("FAQ deleted.");
      }
    } catch {
      showFeedback("Failed to delete FAQ", "danger");
    }
  };

  // Testimonials Handlers
  const addTestimonial = async (e) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.review) return showFeedback("Name and Review required", "danger");
    setSaving(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newTestimonial),
      });
      const data = await res.json();
      if (res.ok) {
        setTestimonials([...testimonials, { ...newTestimonial, _id: data.id }]);
        setNewTestimonial({ name: "", designation: "VP of Engineering", company: "", review: "", rating: 5, avatar: "assets/img/home-3/h3-testi-01.png", order: testimonials.length + 1 });
        showFeedback("New Testimonial added to MongoDB Atlas!");
      }
    } catch {
      showFeedback("Failed to add testimonial", "danger");
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (res.ok) {
        setTestimonials(testimonials.filter((t) => t._id !== id));
        showFeedback("Testimonial removed.");
      }
    } catch {
      showFeedback("Failed to delete testimonial", "danger");
    }
  };

  // Team Handlers
  const addTeamMember = async (e) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.designation) return showFeedback("Name and Designation required", "danger");
    setSaving(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newTeam),
      });
      const data = await res.json();
      if (res.ok) {
        setTeam([...team, { ...newTeam, _id: data.id }]);
        setNewTeam({ name: "", designation: "Senior Architect", image: "assets/img/home-4/experts-01.png", socialLinks: { linkedin: "https://www.linkedin.com/in/dhanesh-joshi/", instagram: "https://www.instagram.com/its_dhanesh_joshi_/" } });
        showFeedback("New team leader added to MongoDB!");
      }
    } catch {
      showFeedback("Failed to add team member", "danger");
    } finally {
      setSaving(false);
    }
  };

  const deleteTeamMember = async (id) => {
    if (!confirm("Delete this member?")) return;
    try {
      const res = await fetch(`/api/team?id=${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (res.ok) {
        setTeam(team.filter((m) => m._id !== id && m.id !== id));
        showFeedback("Team member removed.");
      }
    } catch {
      showFeedback("Failed to delete team member", "danger");
    }
  };

  const saveCeoProfile = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const founder = team.find((m) => (m.name && m.name.toLowerCase().includes("dhanesh")) || (m.designation && m.designation.toLowerCase().includes("founder")));
      const payload = {
        ...(founder?._id ? { _id: founder._id } : {}),
        id: "dhanesh-joshi",
        name: ceoProfile.name,
        designation: ceoProfile.designation,
        company: ceoProfile.company,
        location: ceoProfile.location,
        headline: ceoProfile.headline,
        image: ceoProfile.image,
        bio: ceoProfile.bio,
        visionQuote: ceoProfile.visionQuote,
        quoteAuthor: ceoProfile.quoteAuthor,
        quoteAuthorTitle: ceoProfile.quoteAuthorTitle,
        credlyBadgeUrl: ceoProfile.credlyBadgeUrl,
        credlyImg: ceoProfile.credlyImg,
        linkedinCertificationsUrl: ceoProfile.linkedinCertificationsUrl,
        socialLinks: ceoProfile.socialLinks,
        metrics: ceoProfile.metrics,
        certifications: ceoProfile.certifications,
        skillDomains: ceoProfile.skillDomains,
        techBadges: Array.isArray(ceoProfile.techBadges) ? ceoProfile.techBadges : (typeof ceoProfile.techBadges === "string" ? ceoProfile.techBadges.split(",").map(s => s.trim()).filter(Boolean) : []),
        updatedAt: new Date()
      };

      const res = await fetch("/api/team", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showFeedback("CEO & Founder Profile saved successfully to MongoDB Atlas!");
        const refreshed = await fetch("/api/team").then(r => r.json());
        setTeam(Array.isArray(refreshed) ? refreshed : []);
      } else {
        const err = await res.json().catch(() => ({}));
        showFeedback("Failed to update CEO profile: " + (err.error || res.statusText), "danger");
      }
    } catch (err) {
      showFeedback("Error saving CEO profile: " + err.message, "danger");
    } finally {
      setSaving(false);
    }
  };

  // Blog Handlers
  const addBlogPost = async (e) => {
    e.preventDefault();
    if (!newBlog.title) return showFeedback("Blog title required", "danger");
    setSaving(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newBlog),
      });
      const data = await res.json();
      if (res.ok) {
        setBlogs([{ ...newBlog, _id: data.id }, ...blogs]);
        setNewBlog({ title: "", category: "AI & Software", author: "TechWithJoshi Team", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), comments: "0", image: "assets/img/home-3/home3-blog-01.png", excerpt: "" });
        showFeedback("New article published to MongoDB Atlas!");
      }
    } catch {
      showFeedback("Failed to publish blog post", "danger");
    } finally {
      setSaving(false);
    }
  };

  const deleteBlogPost = async (id) => {
    if (!confirm("Delete this blog article?")) return;
    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (res.ok) {
        setBlogs(blogs.filter((b) => b._id !== id && b.id !== id));
        showFeedback("Blog post deleted.");
      }
    } catch {
      showFeedback("Failed to delete blog post", "danger");
    }
  };

  // Case Study Handlers
  const addCaseStudy = async (e) => {
    e.preventDefault();
    if (!newCaseStudy.title) return showFeedback("Case study title required", "danger");
    setSaving(true);
    try {
      const res = await fetch("/api/case-studies", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newCaseStudy),
      });
      const data = await res.json();
      if (res.ok) {
        setCaseStudies([data.item, ...caseStudies]);
        setNewCaseStudy({
          title: "",
          slug: "",
          category: "Cloud & DevOps",
          client: "Enterprise Client",
          image: "/assets/img/home-5/home5-case-01.png?v=5",
          videoUrl: "",
          tags: "AWS, Kubernetes, CI/CD",
          metrics: [{ label: "Uptime", value: "99.999%" }, { label: "Performance", value: "4.2x Faster" }],
          challenge: "",
          solution: "",
          content: "<h2>Challenge &amp; Architecture Overhaul</h2><p>Describe problem, technical solution, and measurable business impact...</p>",
          order: caseStudies.length + 1
        });
        showFeedback("New Case Study added to MongoDB Atlas!");
      } else {
        showFeedback(data.error || "Failed to add case study", "danger");
      }
    } catch {
      showFeedback("Failed to add case study", "danger");
    } finally {
      setSaving(false);
    }
  };

  const deleteCaseStudy = async (id) => {
    if (!confirm("Delete this case study?")) return;
    try {
      const res = await fetch(`/api/case-studies?id=${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (res.ok) {
        setCaseStudies(caseStudies.filter((c) => c._id !== id));
        showFeedback("Case study removed.");
      }
    } catch {
      showFeedback("Failed to delete case study", "danger");
    }
  };

  // News Handlers
  const addNewsItem = async (e) => {
    e.preventDefault();
    if (!newNewsItem.title) return showFeedback("News title required", "danger");
    setSaving(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newNewsItem),
      });
      const data = await res.json();
      if (res.ok) {
        setNews([data.item, ...news]);
        setNewNewsItem({
          title: "",
          category: "IT News",
          image: "/assets/img/home-5/home5-blog-img-01.png",
          excerpt: "",
          content: "<h3>News Update</h3><p>Full details on IT and software trend...</p>",
          source: "TechWithJoshi Newsroom",
          url: "",
          tags: "AI, Tech, Cloud",
          order: news.length + 1
        });
        showFeedback("New IT News published to MongoDB Atlas!");
      } else {
        showFeedback(data.error || "Failed to publish news", "danger");
      }
    } catch {
      showFeedback("Failed to publish news", "danger");
    } finally {
      setSaving(false);
    }
  };

  const deleteNewsItem = async (id) => {
    if (!confirm("Delete this news article?")) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (res.ok) {
        setNews(news.filter((n) => n._id !== id && n.id !== id));
        showFeedback("News item deleted.");
      }
    } catch {
      showFeedback("Failed to delete news", "danger");
    }
  };

  const importLiveNewsToDb = async (liveItem) => {
    setSaving(true);
    try {
      const payload = {
        title: liveItem.title,
        category: liveItem.category || "IT News",
        image: liveItem.image,
        excerpt: liveItem.excerpt,
        content: `<h3>${liveItem.title}</h3><p>${liveItem.excerpt}</p><p>Originally reported on ${liveItem.source}. <a href="${liveItem.url}" target="_blank" rel="noopener noreferrer">Read full story on original publisher</a></p>`,
        source: liveItem.source,
        url: liveItem.url,
        tags: [liveItem.category || "IT News"],
        order: 1
      };
      const res = await fetch("/api/news", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setNews([data.item, ...news]);
        showFeedback(`Imported "${liveItem.title.substring(0, 30)}..." into MongoDB!`);
      } else {
        showFeedback("Failed to import live news", "danger");
      }
    } catch {
      showFeedback("Error importing live news", "danger");
    } finally {
      setSaving(false);
    }
  };

  // Generic Update Handler for Edit Modals
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      const endpointMap = {
        testimonial: "/api/testimonials",
        project: "/api/projects",
        blog: "/api/blogs",
        caseStudy: "/api/case-studies",
        service: "/api/services",
        news: "/api/news",
      };
      const endpoint = endpointMap[editingItem.type];
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(editingItem.data),
      });
      if (res.ok) {
        if (editingItem.type === "testimonial") {
          setTestimonials(testimonials.map((t) => (t._id === editingItem.data._id ? { ...editingItem.data } : t)));
        } else if (editingItem.type === "project") {
          setProjects(projects.map((p) => (p._id === editingItem.data._id ? { ...editingItem.data } : p)));
        } else if (editingItem.type === "blog") {
          setBlogs(blogs.map((b) => ((b._id || b.id) === (editingItem.data._id || editingItem.data.id) ? { ...editingItem.data } : b)));
        } else if (editingItem.type === "caseStudy") {
          setCaseStudies(caseStudies.map((c) => (c._id === editingItem.data._id ? { ...editingItem.data } : c)));
        } else if (editingItem.type === "service") {
          setServices(services.map((s) => (s._id === editingItem.data._id ? { ...editingItem.data } : s)));
        } else if (editingItem.type === "news") {
          setNews(news.map((n) => ((n._id || n.id) === (editingItem.data._id || editingItem.data.id) ? { ...editingItem.data } : n)));
        }
        showFeedback(`${editingItem.type.toUpperCase()} updated in MongoDB!`);
        setEditingItem(null);
      } else {
        const errData = await res.json();
        showFeedback(errData.error || "Failed to update item", "danger");
      }
    } catch {
      showFeedback("Failed to update item in MongoDB", "danger");
    } finally {
      setSaving(false);
    }
  };

  // Inquiry Handlers
  const toggleInquiryStatus = async (inq) => {
    const nextStatus = inq.status === "unread" ? "read" : "unread";
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: inq._id, status: nextStatus }),
      });
      if (res.ok) {
        setInquiries(inquiries.map((i) => (i._id === inq._id ? { ...i, status: nextStatus } : i)));
        showFeedback(`Marked inquiry as ${nextStatus}`);
      }
    } catch {
      showFeedback("Failed to update inquiry status", "danger");
    }
  };

  const deleteInquiry = async (id) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (res.ok) {
        setInquiries(inquiries.filter((i) => i._id !== id));
        showFeedback("Inquiry deleted.");
      }
    } catch {
      showFeedback("Failed to delete inquiry", "danger");
    }
  };

  if (authChecking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0618", color: "#00dfd8" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner-border mb-3" role="status" style={{ width: "3rem", height: "3rem" }}></div>
          <h4>Verifying Admin Session...</h4>
        </div>
      </div>
    );
  }

  const unreadCount = inquiries.filter((i) => i.status === "unread").length;
  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryFilter === "unread") return inq.status === "unread";
    if (inquiryFilter === "read") return inq.status === "read";
    return true;
  });

  return (
    <>
      <Head>
        <title>TechWithJoshi CMS - Enterprise Admin Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ display: "flex", minHeight: "100vh", background: "#080411", color: "#e2e8f0", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        {/* Left Sidebar */}
        <aside
          style={{
            width: "280px",
            background: "rgba(16, 9, 32, 0.98)",
            borderRight: "1px solid rgba(121, 40, 202, 0.25)",
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: 0,
            height: "100vh",
            zIndex: 10,
          }}
        >
          {/* Brand */}
          <div style={{ padding: "20px", borderBottom: "1px solid rgba(121, 40, 202, 0.2)" }}>
            <Link href="/index3" target="_blank" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "800",
                    fontSize: "18px",
                  }}
                >
                  TW
                </span>
                <div>
                  <div style={{ fontSize: "17px", fontWeight: "800", color: "#fff" }}>
                    TechWith<span style={{ color: "#00dfd8" }}>Joshi</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "0.5px" }}>
                    FULL STACK CMS
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Nav List */}
          <div style={{ padding: "14px 12px", flex: 1, overflowY: "auto" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", padding: "6px 10px" }}>
              Control Center
            </div>
            <button
              onClick={() => setActiveTab("overview")}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "overview" ? "linear-gradient(135deg, rgba(121, 40, 202, 0.5), rgba(0, 223, 216, 0.25))" : "transparent",
                color: activeTab === "overview" ? "#00dfd8" : "#cbd5e1",
                fontWeight: activeTab === "overview" ? "700" : "500",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                marginBottom: "4px",
              }}
            >
              <i className="bi bi-speedometer2"></i>
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("inquiries")}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "inquiries" ? "linear-gradient(135deg, rgba(121, 40, 202, 0.5), rgba(0, 223, 216, 0.25))" : "transparent",
                color: activeTab === "inquiries" ? "#00dfd8" : "#cbd5e1",
                fontWeight: activeTab === "inquiries" ? "700" : "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                marginBottom: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="bi bi-envelope"></i>
                <span>Lead Inquiries</span>
              </div>
              {unreadCount > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "2px 7px", borderRadius: "10px" }}>
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("aiLeads")}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "aiLeads" ? "linear-gradient(135deg, rgba(121, 40, 202, 0.6), rgba(0, 223, 216, 0.3))" : "transparent",
                color: activeTab === "aiLeads" ? "#00dfd8" : "#cbd5e1",
                fontWeight: activeTab === "aiLeads" ? "700" : "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                marginBottom: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="bi bi-robot"></i>
                <span>AI Leads &amp; Chatbot</span>
              </div>
              {aiSessions.length > 0 && (
                <span style={{ background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "2px 7px", borderRadius: "10px" }}>
                  {aiSessions.length}
                </span>
              )}
            </button>

            <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", padding: "8px 10px" }}>
              Website Pages &amp; Sections
            </div>

            {[
              { id: "hero", label: "Hero & Banner Slider", icon: "bi-layout-text-window-reverse" },
              { id: "about", label: "About Page & Story", icon: "bi-building-check" },
              { id: "services", label: "IT Services", icon: "bi-grid-fill" },
              { id: "projects", label: "Client Projects", icon: "bi-collection-play" },
              { id: "caseStudies", label: "Case Studies (Success Stories)", icon: "bi-award-fill" },
              { id: "blogs", label: "News & Articles Studio", icon: "bi-newspaper" },
              { id: "testimonials", label: "Client Testimonials", icon: "bi-chat-square-quote" },
              { id: "pricing", label: "Pricing Packages", icon: "bi-tags" },
              { id: "faqs", label: "FAQs Manager", icon: "bi-question-circle" },
              { id: "ceoProfile", label: "CEO & Founder Studio", icon: "bi-person-badge-fill" },
              { id: "team", label: "Team Leaders", icon: "bi-people" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: activeTab === tab.id ? "linear-gradient(135deg, rgba(121, 40, 202, 0.5), rgba(0, 223, 216, 0.25))" : "transparent",
                  color: activeTab === tab.id ? "#00dfd8" : "#cbd5e1",
                  fontWeight: activeTab === tab.id ? "700" : "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  marginBottom: "4px",
                }}
              >
                <i className={`bi ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}

            <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", padding: "12px 10px 6px 10px" }}>
              Configuration &amp; Security
            </div>

            <button
              onClick={() => setActiveTab("settings")}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "settings" ? "linear-gradient(135deg, rgba(121, 40, 202, 0.5), rgba(0, 223, 216, 0.25))" : "transparent",
                color: activeTab === "settings" ? "#00dfd8" : "#cbd5e1",
                fontWeight: activeTab === "settings" ? "700" : "500",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                marginBottom: "4px",
              }}
            >
              <i className="bi bi-gear"></i>
              <span>Global Settings &amp; SEO</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "profile" ? "linear-gradient(135deg, rgba(121, 40, 202, 0.5), rgba(0, 223, 216, 0.25))" : "transparent",
                color: activeTab === "profile" ? "#00dfd8" : "#cbd5e1",
                fontWeight: activeTab === "profile" ? "700" : "500",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                marginBottom: "4px",
              }}
            >
              <i className="bi bi-shield-lock"></i>
              <span>Admin Profile &amp; Auth</span>
            </button>
          </div>

          {/* Profile Badge & Sign out */}
          <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(121, 40, 202, 0.2)", background: "rgba(10, 5, 20, 0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>
                  {adminUser?.name || "Dhanesh Joshi"}
                </div>
                <div style={{ fontSize: "11px", color: "#00dfd8" }}>
                  {adminUser?.role || "superadmin"}
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#f87171",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }}>
          {/* Header Bar */}
          <header
            style={{
              padding: "16px 32px",
              background: "rgba(12, 6, 24, 0.92)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(121, 40, 202, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 9,
            }}
          >
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#fff", textTransform: "capitalize" }}>
                {activeTab.replace("_", " ")} Management
              </h1>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                Live MongoDB Atlas Connected • Database: <code style={{ color: "#00dfd8" }}>techwithjoshi</code>
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link
                href="/index3"
                target="_blank"
                style={{
                  background: "rgba(121, 40, 202, 0.2)",
                  border: "1px solid rgba(121, 40, 202, 0.4)",
                  color: "#00dfd8",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <i className="bi bi-eye"></i>
                <span>Preview Site</span>
              </Link>

              <button
                onClick={fetchAllData}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#e2e8f0",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>
          </header>

          {/* Feedback Toast */}
          {feedback && (
            <div
              style={{
                margin: "16px 32px 0 32px",
                padding: "14px 20px",
                borderRadius: "10px",
                background: feedback.type === "danger" ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                border: feedback.type === "danger" ? "1px solid #ef4444" : "1px solid #10b981",
                color: feedback.type === "danger" ? "#fca5a5" : "#6ee7b7",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              <i className={`bi ${feedback.type === "danger" ? "bi-exclamation-octagon" : "bi-check-circle-fill"}`}></i>
              <span>{feedback.msg}</span>
            </div>
          )}

          {/* Tab Content Container */}
          <div style={{ padding: "32px", flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div className="spinner-border text-info" role="status" style={{ width: "3rem", height: "3rem" }}></div>
                <p style={{ marginTop: "16px", color: "#94a3b8" }}>Syncing with MongoDB Atlas...</p>
              </div>
            ) : (
              <>
                {/* 1. OVERVIEW */}
                {activeTab === "overview" && (
                  <div>
                    <div className="row g-4 mb-4">
                      {[
                        { label: "Total Inquiries", val: inquiries.length, sub: `${unreadCount} unread leads`, color: "#00dfd8" },
                        { label: "Active Services", val: services.length, sub: "Live IT solutions", color: "#a855f7" },
                        { label: "Case Studies", val: projects.length, sub: "Portfolio items", color: "#38bdf8" },
                        { label: "FAQs", val: faqs.length, sub: "Help center answers", color: "#f59e0b" },
                        { label: "Client Reviews", val: testimonials.length, sub: "Verified testimonials", color: "#10b981" },
                        { label: "Team Leaders", val: team.length, sub: "Senior engineers", color: "#ec4899" },
                        { label: "Tech Articles", val: blogs.length, sub: "Published blogs", color: "#6366f1" },
                        { label: "Database Health", val: "Online", sub: "MongoDB Atlas M0", color: "#10b981" },
                      ].map((card, i) => (
                        <div key={i} className="col-md-3">
                          <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", padding: "20px" }}>
                            <div style={{ fontSize: "13px", color: "#94a3b8" }}>{card.label}</div>
                            <div style={{ fontSize: "28px", fontWeight: "800", color: card.color, margin: "6px 0" }}>{card.val}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>{card.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#f8fafc" }}>
                      Manage Website Components
                    </h3>
                    <div className="row g-3">
                      {[
                        { tab: "hero", title: "Hero & Banner Slider", desc: "Change headlines, CTA buttons and slider images.", icon: "bi-layout-text-window-reverse" },
                        { tab: "about", title: "About Section", desc: "Edit story, 10 Years experience counter and feature pillars.", icon: "bi-building-check" },
                        { tab: "services", title: "Services & Solutions", desc: "Create, edit, or delete engineering services.", icon: "bi-grid-fill" },
                        { tab: "projects", title: "Projects & Case Studies", desc: "Manage client portfolio projects and case studies.", icon: "bi-collection-play" },
                        { tab: "testimonials", title: "Client Testimonials", desc: "Manage reviews, ratings and client avatars.", icon: "bi-chat-square-quote" },
                        { tab: "pricing", title: "Pricing Packages", desc: "Update subscription packages, pricing, and features.", icon: "bi-tags" },
                        { tab: "faqs", title: "FAQs Manager", desc: "Add, edit, or organize frequently asked questions.", icon: "bi-question-circle" },
                        { tab: "team", title: "Team Leaders", desc: "Manage engineers, architects, and social links.", icon: "bi-people" },
                        { tab: "blogs", title: "Tech Insights (Blogs)", desc: "Publish and manage high-tech software articles.", icon: "bi-journal-text" },
                        { tab: "inquiries", title: "Contact Inquiries", desc: "Review customer contact form messages.", icon: "bi-envelope" },
                        { tab: "settings", title: "Global Settings & SEO", desc: "Edit Dahod address, WhatsApp, emails, Cal.com link.", icon: "bi-gear" },
                        { tab: "profile", title: "Admin Profile & Auth", desc: "Update admin email and change secure password.", icon: "bi-shield-lock" },
                      ].map((item) => (
                        <div key={item.tab} className="col-md-4">
                          <div
                            onClick={() => setActiveTab(item.tab)}
                            style={{
                              background: "rgba(18, 12, 36, 0.5)",
                              border: "1px solid rgba(121, 40, 202, 0.2)",
                              borderRadius: "12px",
                              padding: "18px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#00dfd8";
                              e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "rgba(121, 40, 202, 0.2)";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                              <i className={`bi ${item.icon}`} style={{ fontSize: "18px", color: "#00dfd8" }}></i>
                              <h4 style={{ fontSize: "15px", fontWeight: "700", margin: 0, color: "#fff" }}>{item.title}</h4>
                            </div>
                            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. HERO SLIDER */}
                {activeTab === "hero" && (
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#fff" }}>Hero / Banner Slider (Home 3)</h2>
                    <div className="row g-4">
                      {cms?.hero?.slides?.map((slide, idx) => (
                        <div key={slide.id || idx} className="col-12">
                          <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", padding: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                              <span style={{ background: "rgba(121, 40, 202, 0.3)", color: "#00dfd8", fontSize: "12px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px" }}>
                                Slide #{idx + 1}
                              </span>
                            </div>
                            <div className="row g-3">
                              <div className="col-12">
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Main Headline</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={slide.heading || ""}
                                  onChange={(e) => {
                                    const updated = [...cms.hero.slides];
                                    updated[idx].heading = e.target.value;
                                    setCms({ ...cms, hero: { ...cms.hero, slides: updated } });
                                  }}
                                  style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                />
                              </div>
                              <div className="col-12">
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Description Subtext</label>
                                <textarea
                                  rows={2}
                                  className="form-control"
                                  value={slide.description || ""}
                                  onChange={(e) => {
                                    const updated = [...cms.hero.slides];
                                    updated[idx].description = e.target.value;
                                    setCms({ ...cms, hero: { ...cms.hero, slides: updated } });
                                  }}
                                  style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                />
                              </div>
                              <div className="col-md-6">
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Button 1 (Text &amp; Link)</label>
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <input
                                    type="text"
                                    placeholder="Text"
                                    className="form-control"
                                    value={slide.primaryBtnText || ""}
                                    onChange={(e) => {
                                      const updated = [...cms.hero.slides];
                                      updated[idx].primaryBtnText = e.target.value;
                                      setCms({ ...cms, hero: { ...cms.hero, slides: updated } });
                                    }}
                                    style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Link"
                                    className="form-control"
                                    value={slide.primaryBtnLink || ""}
                                    onChange={(e) => {
                                      const updated = [...cms.hero.slides];
                                      updated[idx].primaryBtnLink = e.target.value;
                                      setCms({ ...cms, hero: { ...cms.hero, slides: updated } });
                                    }}
                                    style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Banner Image Path</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={slide.image || ""}
                                  onChange={(e) => {
                                    const updated = [...cms.hero.slides];
                                    updated[idx].image = e.target.value;
                                    setCms({ ...cms, hero: { ...cms.hero, slides: updated } });
                                  }}
                                  style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: "20px" }}>
                      <button
                        disabled={saving}
                        onClick={() => saveCmsSection("hero", cms.hero)}
                        style={{ background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
                      >
                        {saving ? "Saving to MongoDB..." : "Save All Hero Slides"}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. ABOUT SECTION */}
                {activeTab === "about" && (
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#fff" }}>About Page &amp; Section CMS</h2>
                    <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", padding: "24px" }}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Badge Title</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cms?.about?.badge || ""}
                            onChange={(e) => setCms({ ...cms, about: { ...cms.about, badge: e.target.value } })}
                            style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Sub-Heading</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cms?.about?.subtitle || ""}
                            onChange={(e) => setCms({ ...cms, about: { ...cms.about, subtitle: e.target.value } })}
                            style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                          />
                        </div>
                        <div className="col-12">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Main Headline</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cms?.about?.title || ""}
                            onChange={(e) => setCms({ ...cms, about: { ...cms.about, title: e.target.value } })}
                            style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                          />
                        </div>
                        <div className="col-12">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Detailed Story / Description</label>
                          <textarea
                            rows={3}
                            className="form-control"
                            value={cms?.about?.description || ""}
                            onChange={(e) => setCms({ ...cms, about: { ...cms.about, description: e.target.value } })}
                            style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                          />
                        </div>
                        <div className="col-md-3">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Years Badge (e.g. 5yr)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cms?.about?.yearsCount || "5yr"}
                            onChange={(e) => setCms({ ...cms, about: { ...cms.about, yearsCount: e.target.value } })}
                            style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#00dfd8", fontWeight: "700" }}
                          />
                        </div>
                        <div className="col-md-3">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Years Label (e.g. Excellence)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cms?.about?.yearsLabel || "Excellence"}
                            onChange={(e) => setCms({ ...cms, about: { ...cms.about, yearsLabel: e.target.value } })}
                            style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Pillar 1 Title</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cms?.about?.feature1Title || ""}
                            onChange={(e) => setCms({ ...cms, about: { ...cms.about, feature1Title: e.target.value } })}
                            style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                          />
                        </div>
                        <div className="col-12 mt-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <label style={{ fontSize: "14px", fontWeight: "700", color: "#00dfd8" }}>
                              <i className="bi bi-bar-chart-line me-1"></i> Highlight Metric Counters (Add Multiple)
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const currentStats = Array.isArray(cms?.about?.stats) ? [...cms.about.stats] : [];
                                currentStats.push({ number: "100+", label: "New Metric", icon: "bi-check2-circle" });
                                setCms({ ...cms, about: { ...cms.about, stats: currentStats } });
                              }}
                              style={{ background: "rgba(0, 223, 216, 0.15)", border: "1px solid #00dfd8", color: "#00dfd8", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                            >
                              + Add Counter
                            </button>
                          </div>
                          <div className="row g-2">
                            {(Array.isArray(cms?.about?.stats) ? cms.about.stats : []).map((st, stIdx) => (
                              <div key={stIdx} className="col-md-6">
                                <div style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "8px", padding: "10px" }}>
                                  <div className="d-flex gap-2">
                                    <div style={{ flex: 1 }}>
                                      <label style={{ fontSize: "11px", color: "#94a3b8" }}>Count / Number</label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={st.number || ""}
                                        onChange={(e) => {
                                          const next = [...cms.about.stats];
                                          next[stIdx].number = e.target.value;
                                          setCms({ ...cms, about: { ...cms.about, stats: next } });
                                        }}
                                        style={{ background: "#080411", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#00dfd8", fontWeight: "700" }}
                                      />
                                    </div>
                                    <div style={{ flex: 2 }}>
                                      <label style={{ fontSize: "11px", color: "#94a3b8" }}>Label / Title</label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={st.label || ""}
                                        onChange={(e) => {
                                          const next = [...cms.about.stats];
                                          next[stIdx].label = e.target.value;
                                          setCms({ ...cms, about: { ...cms.about, stats: next } });
                                        }}
                                        style={{ background: "#080411", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                      />
                                    </div>
                                    <div className="d-flex align-items-end">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = cms.about.stats.filter((_, idx) => idx !== stIdx);
                                          setCms({ ...cms, about: { ...cms.about, stats: next } });
                                        }}
                                        style={{ background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", height: "31px" }}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: "20px" }}>
                        <button
                          disabled={saving}
                          onClick={() => saveCmsSection("about", cms.about)}
                          style={{ background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
                        >
                          Save About Section
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SERVICES CRUD */}
                {activeTab === "services" && (
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#fff" }}>IT Services &amp; Solutions (Full CRUD)</h2>
                    <div className="row g-4 mb-4">
                      {services.map((s) => (
                        <div key={s._id || s.slug} className="col-md-6">
                          <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", padding: "20px" }}>
                            {s.image && (
                              <div style={{ height: "140px", borderRadius: "10px", overflow: "hidden", marginBottom: "14px" }}>
                                <img src={s.image} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <i className={`bi ${s.icon || "bi-code-slash"}`} style={{ fontSize: "22px", color: "#00dfd8" }}></i>
                                <div>
                                  <h4 style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "#fff" }}>{s.title}</h4>
                                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Slug: {s.slug || "custom"}</span>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => setEditingItem({ type: 'service', data: { ...s } })} style={{ background: "rgba(0, 223, 216, 0.15)", border: "1px solid rgba(0, 223, 216, 0.3)", color: "#00dfd8", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", cursor: "pointer" }}>
                                  <i className="bi bi-pencil me-1"></i> Edit
                                </button>
                                <button onClick={() => deleteService(s._id)} style={{ background: "rgba(239, 68, 68, 0.15)", border: "none", color: "#ef4444", borderRadius: "6px", padding: "4px 8px", cursor: "pointer" }}>
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                            <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "10px" }}>{s.description}</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              <span style={{ fontSize: "11px", background: "rgba(121, 40, 202, 0.3)", color: "#00dfd8", padding: "2px 8px", borderRadius: "12px" }}>
                                {s.category}
                              </span>
                              {Array.isArray(s.features) && s.features.slice(0, 2).map((f, fIdx) => (
                                <span key={fIdx} style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", color: "#cbd5e1", padding: "2px 8px", borderRadius: "12px" }}>
                                  ✓ {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={addService} style={{ background: "rgba(18, 12, 36, 0.5)", border: "1px dashed rgba(0, 223, 216, 0.4)", borderRadius: "14px", padding: "24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                        <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", margin: 0 }}>+ Add New IT Service</h4>
                        <button
                          type="button"
                          disabled={aiGenLoading}
                          onClick={handleAiGenerateService}
                          style={{
                            background: "linear-gradient(135deg, rgba(121, 40, 202, 0.4) 0%, rgba(0, 223, 216, 0.25) 100%)",
                            border: "1px solid #00dfd8",
                            color: "#00dfd8",
                            fontWeight: "700",
                            fontSize: "12px",
                            padding: "6px 14px",
                            borderRadius: "8px",
                            cursor: aiGenLoading ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <i className="bi bi-robot"></i>
                          <span>{aiGenLoading ? "Generating with TechWithJoshi AI..." : "Auto-Generate with TechWithJoshi AI"}</span>
                        </button>
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Service Title</label>
                          <input type="text" placeholder="e.g. Cloud Infrastructure & DevOps" required className="form-control" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value, slug: newService.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>URL Slug</label>
                          <input type="text" placeholder="e.g. cloud-devops-infrastructure" required className="form-control" value={newService.slug} onChange={(e) => setNewService({ ...newService, slug: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Category</label>
                          <input type="text" placeholder="e.g. Cloud & Systems" className="form-control" value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Bootstrap Icon</label>
                          <input type="text" placeholder="e.g. bi-cloud-check, bi-cpu, bi-code-slash" className="form-control" value={newService.icon} onChange={(e) => setNewService({ ...newService, icon: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <ImageUploadInput
                            label="Service Cover Graphic"
                            value={newService.image}
                            onChange={(url) => setNewService({ ...newService, image: url })}
                          />
                        </div>
                        <div className="col-12">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Summary Description</label>
                          <textarea rows={2} placeholder="Short executive summary of service capability" required className="form-control" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Key Deliverables (comma-separated)</label>
                          <input type="text" placeholder="e.g. Terraform IaC, Kubernetes Setup, CI/CD, 24/7 Monitoring" className="form-control" value={newService.features} onChange={(e) => setNewService({ ...newService, features: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <RichTextEditor
                            label="Comprehensive Service Details & Architecture Scope"
                            value={newService.content}
                            onChange={(html) => setNewService({ ...newService, content: html })}
                            placeholder="Write full architectural breakdown, methodology, SLA standards..."
                          />
                        </div>
                        <div className="col-12">
                          <button type="submit" disabled={saving} style={{ background: "rgba(0, 223, 216, 0.2)", border: "1px solid #00dfd8", color: "#00dfd8", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                            Save IT Service to MongoDB
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* 5. PROJECTS CRUD */}
                {activeTab === "projects" && (
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#fff" }}>Client Projects Portfolio (Full CRUD)</h2>
                    <div className="row g-4 mb-4">
                      {projects.map((p) => (
                        <div key={p._id || p.id} className="col-md-4">
                          <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", overflow: "hidden" }}>
                            <img src={p.image || "/assets/img/home-3/home3-suc-sto-01.png"} alt={p.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                            <div style={{ padding: "16px" }}>
                              <span style={{ fontSize: "11px", color: "#00dfd8", textTransform: "uppercase", fontWeight: "700" }}>{p.category} {p.client ? `• ${p.client}` : ""}</span>
                              <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#fff", margin: "6px 0" }}>{p.title}</h5>
                              <p style={{ fontSize: "12px", color: "#94a3b8" }}>{p.description}</p>
                              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                                <button onClick={() => setEditingItem({ type: 'project', data: { ...p } })} style={{ background: "rgba(0, 223, 216, 0.15)", border: "1px solid rgba(0, 223, 216, 0.3)", color: "#00dfd8", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                                  <i className="bi bi-pencil me-1"></i> Edit
                                </button>
                                <button onClick={() => deleteProject(p._id)} style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                                  <i className="bi bi-trash me-1"></i> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={addProject} style={{ background: "rgba(18, 12, 36, 0.5)", border: "1px dashed rgba(0, 223, 216, 0.4)", borderRadius: "14px", padding: "24px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", marginBottom: "16px" }}>+ Add New Client Project</h4>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Project Title</label>
                          <input type="text" placeholder="Title" required className="form-control" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Category</label>
                          <input type="text" placeholder="Category (e.g. Cloud Architecture, AI Agent)" className="form-control" value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Client Name / Organization</label>
                          <input type="text" placeholder="Client Name" className="form-control" value={newProject.client} onChange={(e) => setNewProject({ ...newProject, client: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Live URL or Github Repo</label>
                          <input type="text" placeholder="e.g. https://github.com/techwithjoshi" className="form-control" value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <ImageUploadInput
                            label="Project Preview Screenshot / Cover"
                            value={newProject.image}
                            onChange={(url) => setNewProject({ ...newProject, image: url })}
                          />
                        </div>
                        <div className="col-12">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Executive Summary</label>
                          <textarea rows={2} placeholder="Description" required className="form-control" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Key Deliverables</label>
                          <input type="text" placeholder="e.g. Kubernetes Cluster, Terraform Scripts, Sub-20ms P99 Latency" className="form-control" value={newProject.deliverables} onChange={(e) => setNewProject({ ...newProject, deliverables: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <RichTextEditor
                            label="Project Architecture & Engineering Deep-Dive"
                            value={newProject.content}
                            onChange={(html) => setNewProject({ ...newProject, content: html })}
                            placeholder="Detail architecture diagrams, challenges overcome, metrics achieved..."
                          />
                        </div>
                        <div className="col-12">
                          <button type="submit" disabled={saving} style={{ background: "rgba(0, 223, 216, 0.2)", border: "1px solid #00dfd8", color: "#00dfd8", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                            Save Project to MongoDB
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* 5B. CASE STUDIES CRUD */}
                {activeTab === "caseStudies" && (
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#fff" }}>Enterprise Case Studies &amp; Success Stories (Full CRUD)</h2>
                    <div className="row g-4 mb-4">
                      {caseStudies.map((c) => (
                        <div key={c._id || c.slug} className="col-md-6">
                          <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", overflow: "hidden" }}>
                            {c.image && (
                              <img src={c.image} alt={c.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                            )}
                            <div style={{ padding: "18px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                                <span style={{ fontSize: "11px", color: "#00dfd8", textTransform: "uppercase", fontWeight: "700" }}>{c.category} • {c.client}</span>
                                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Slug: {c.slug}</span>
                              </div>
                              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", margin: "6px 0 10px" }}>{c.title}</h4>
                              
                              {Array.isArray(c.metrics) && c.metrics.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                                  {c.metrics.map((m, mIdx) => (
                                    <span key={mIdx} style={{ fontSize: "11px", background: "rgba(0, 223, 216, 0.12)", border: "1px solid rgba(0, 223, 216, 0.3)", color: "#00dfd8", padding: "2px 8px", borderRadius: "8px" }}>
                                      {m.value} ({m.label})
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                                <button onClick={() => setEditingItem({ type: 'caseStudy', data: { ...c } })} style={{ background: "rgba(0, 223, 216, 0.15)", border: "1px solid rgba(0, 223, 216, 0.3)", color: "#00dfd8", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                                  <i className="bi bi-pencil me-1"></i> Edit
                                </button>
                                <button onClick={() => deleteCaseStudy(c._id)} style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                                  <i className="bi bi-trash me-1"></i> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={addCaseStudy} style={{ background: "rgba(18, 12, 36, 0.5)", border: "1px dashed rgba(0, 223, 216, 0.4)", borderRadius: "14px", padding: "24px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", marginBottom: "16px" }}>+ Publish New Enterprise Case Study</h4>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Case Study Title</label>
                          <input type="text" placeholder="e.g. Building Scalable Multi-Region Cloud Infrastructure" required className="form-control" value={newCaseStudy.title} onChange={(e) => setNewCaseStudy({ ...newCaseStudy, title: e.target.value, slug: newCaseStudy.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>URL Slug</label>
                          <input type="text" placeholder="e.g. building-scalable-cloud-infrastructure" required className="form-control" value={newCaseStudy.slug} onChange={(e) => setNewCaseStudy({ ...newCaseStudy, slug: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Category</label>
                          <input type="text" placeholder="e.g. Cloud & DevOps" className="form-control" value={newCaseStudy.category} onChange={(e) => setNewCaseStudy({ ...newCaseStudy, category: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Client / Industry</label>
                          <input type="text" placeholder="e.g. Global FinTech Platform" className="form-control" value={newCaseStudy.client} onChange={(e) => setNewCaseStudy({ ...newCaseStudy, client: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <ImageUploadInput
                            label="Featured Hero Image"
                            value={newCaseStudy.image}
                            onChange={(url) => setNewCaseStudy({ ...newCaseStudy, image: url })}
                          />
                        </div>
                        <div className="col-12">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Video Walkthrough / Demo URL (Optional YouTube or Vimeo)</label>
                          <input type="text" placeholder="https://www.youtube.com/watch?v=..." className="form-control" value={newCaseStudy.videoUrl} onChange={(e) => setNewCaseStudy({ ...newCaseStudy, videoUrl: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>The Challenge</label>
                          <textarea rows={3} placeholder="What problem did the client face?" className="form-control" value={newCaseStudy.challenge} onChange={(e) => setNewCaseStudy({ ...newCaseStudy, challenge: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Our Engineered Solution</label>
                          <textarea rows={3} placeholder="How did TechWithJoshi solve it?" className="form-control" value={newCaseStudy.solution} onChange={(e) => setNewCaseStudy({ ...newCaseStudy, solution: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Technology Stack Tags (comma-separated)</label>
                          <input type="text" placeholder="AWS, Kubernetes, Next.js, Kafka, Terraform" className="form-control" value={typeof newCaseStudy.tags === 'string' ? newCaseStudy.tags : Array.isArray(newCaseStudy.tags) ? newCaseStudy.tags.join(', ') : ''} onChange={(e) => setNewCaseStudy({ ...newCaseStudy, tags: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <RichTextEditor
                            label="Complete Case Study Narrative & Results Breakdown"
                            value={newCaseStudy.content}
                            onChange={(html) => setNewCaseStudy({ ...newCaseStudy, content: html })}
                            placeholder="Write comprehensive story, architectural diagrams, outcomes..."
                          />
                        </div>
                        <div className="col-12">
                          <button type="submit" disabled={saving} style={{ background: "rgba(0, 223, 216, 0.2)", border: "1px solid #00dfd8", color: "#00dfd8", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                            Save Case Study to MongoDB Atlas
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* 6. TESTIMONIALS & GOOGLE REVIEWS CRUD */}
                {activeTab === "testimonials" && (
                  <div>
                    {/* Google Business & Review Management Card */}
                    <div style={{ background: "rgba(18, 12, 36, 0.75)", border: "1px solid rgba(66, 133, 244, 0.35)", borderRadius: "16px", padding: "22px", marginBottom: "24px" }}>
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(66, 133, 244, 0.15)", border: "1px solid rgba(66, 133, 244, 0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src="assets/img/home-5/google-1.svg" alt="Google" style={{ width: "22px", height: "22px" }} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: "17px", fontWeight: "700", margin: 0, color: "#fff" }}>
                              Google Reviews &amp; Client Testimonials Engine
                            </h3>
                            <span style={{ fontSize: "12px", color: "#00ed64", fontWeight: "600" }}>
                              ● Verified Policy: Only 4-Star &amp; 5-Star Reviews are published to homepage
                            </span>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <a
                            href="https://g.page/r/CdT43EVp0u6bEBM/review"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: "linear-gradient(135deg, #4285F4 0%, #00DFD8 100%)",
                              border: "none",
                              color: "#fff",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              fontSize: "13px",
                              fontWeight: "700",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <i className="bi bi-box-arrow-up-right"></i>
                            <span>Test Google Review Link</span>
                          </a>

                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                showFeedback("Checking Google Reviews sync endpoint...", "info");
                                const r = await fetch("/api/google-reviews");
                                const d = await r.json();
                                showFeedback(`Google Reviews verified! Total 4-5★ Reviews in DB: ${d.count || 0}`);
                                loadData();
                              } catch {
                                showFeedback("Error syncing Google reviews", "danger");
                              }
                            }}
                            style={{
                              background: "rgba(255, 255, 255, 0.08)",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              color: "#fff",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              fontSize: "13px",
                              fontWeight: "600",
                              cursor: "pointer"
                            }}
                          >
                            <i className="bi bi-arrow-repeat me-1"></i>
                            <span>Sync / Verify Status</span>
                          </button>
                        </div>
                      </div>

                      <div className="row g-2" style={{ fontSize: "12px" }}>
                        <div className="col-md-6">
                          <div style={{ background: "#0e081f", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <span style={{ color: "#94a3b8" }}>Google Review Shortlink: </span>
                            <span style={{ color: "#00dfd8", wordBreak: "break-all" }}>https://g.page/r/CdT43EVp0u6bEBM/review</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div style={{ background: "#0e081f", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <span style={{ color: "#94a3b8" }}>Google Maps Place ID: </span>
                            <span style={{ color: "#00ed64" }}>ChIJEVBKyPwdYTkR1PjcRWnS7ps</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#fff" }}>
                      Published Testimonials &amp; Reviews ({testimonials.length})
                    </h2>
                    <div className="row g-4 mb-4">
                      {testimonials.map((t) => (
                        <div key={t._id} className="col-md-4">
                          <div style={{ background: "rgba(18, 12, 36, 0.7)", border: t.source === "google" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", padding: "20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  {t.avatar ? (
                                    <img src={t.avatar} alt={t.name} style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }} />
                                  ) : (
                                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: t.color || "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700" }}>
                                      {t.initial || (t.name ? t.name[0] : "C")}
                                    </div>
                                  )}
                                  <div>
                                    <h5 style={{ fontSize: "14.5px", fontWeight: "700", margin: 0, color: "#fff" }}>{t.name}</h5>
                                    <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>{t.designation}</span>
                                  </div>
                                </div>
                                <span style={{ background: t.source === "google" ? "rgba(16, 185, 129, 0.2)" : "rgba(0, 223, 216, 0.2)", color: t.source === "google" ? "#10B981" : "#00DFD8", border: t.source === "google" ? "1px solid #10B981" : "1px solid #00DFD8", borderRadius: "6px", fontSize: "10px", fontWeight: "700", padding: "2px 8px" }}>
                                  {t.source === "google" ? "Google 5★" : `${t.rating || 5}★ Client`}
                                </span>
                              </div>
                              <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.6" }}>“{t.review}”</p>
                            </div>

                            <div style={{ display: "flex", gap: "8px", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                              <button onClick={() => setEditingItem({ type: 'testimonial', data: { ...t } })} style={{ background: "rgba(0, 223, 216, 0.15)", border: "1px solid rgba(0, 223, 216, 0.3)", color: "#00dfd8", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                                <i className="bi bi-pencil me-1"></i> Edit
                              </button>
                              <button onClick={() => deleteTestimonial(t._id)} style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                                <i className="bi bi-trash me-1"></i> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={addTestimonial} style={{ background: "rgba(18, 12, 36, 0.5)", border: "1px dashed rgba(0, 223, 216, 0.4)", borderRadius: "14px", padding: "24px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", marginBottom: "16px" }}>+ Add Client Testimonial / Google Review</h4>
                      <div className="row g-3">
                        <div className="col-md-3">
                          <input type="text" placeholder="Reviewer / Client Name" required className="form-control" value={newTestimonial.name} onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-3">
                          <input type="text" placeholder="Designation / Role" className="form-control" value={newTestimonial.designation} onChange={(e) => setNewTestimonial({ ...newTestimonial, designation: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-2">
                          <input type="text" placeholder="Company" className="form-control" value={newTestimonial.company} onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-2">
                          <select className="form-control" value={newTestimonial.source || "client"} onChange={(e) => setNewTestimonial({ ...newTestimonial, source: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}>
                            <option value="client">Client Review</option>
                            <option value="google">Google Review</option>
                          </select>
                        </div>
                        <div className="col-md-2">
                          <select className="form-control" value={newTestimonial.rating} onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}>
                            <option value={5}>5 Stars ★★★★★</option>
                            <option value={4}>4 Stars ★★★★</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <textarea rows={2} placeholder="Review Quote" required className="form-control" value={newTestimonial.review} onChange={(e) => setNewTestimonial({ ...newTestimonial, review: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <button type="submit" disabled={saving} style={{ background: "rgba(0, 223, 216, 0.2)", border: "1px solid #00dfd8", color: "#00dfd8", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                            Save Review to MongoDB
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* 7. PRICING CRUD */}
                {activeTab === "pricing" && (
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#fff" }}>Pricing Packages (Full CRUD)</h2>
                    <div className="row g-4 mb-4">
                      {cms?.pricing?.items?.map((item, idx) => (
                        <div key={item.id || idx} className="col-md-4">
                          <div style={{ background: "rgba(18, 12, 36, 0.7)", border: item.isPopular ? "1px solid #00dfd8" : "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", padding: "20px" }}>
                            {item.isPopular && <span style={{ background: "#00dfd8", color: "#000", fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "4px" }}>POPULAR</span>}
                            <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginTop: "6px" }}>{item.title}</h4>
                            <div style={{ fontSize: "28px", fontWeight: "800", color: "#00dfd8", margin: "8px 0" }}>${item.price} <span style={{ fontSize: "13px", color: "#94a3b8" }}>/{item.period}</span></div>
                            <p style={{ fontSize: "13px", color: "#94a3b8" }}>{item.description}</p>
                            <button onClick={() => {
                              const filtered = cms.pricing.items.filter((_, i) => i !== idx);
                              saveCmsSection("pricing", { ...cms.pricing, items: filtered });
                            }} style={{ background: "rgba(239, 68, 68, 0.15)", border: "none", color: "#ef4444", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", cursor: "pointer", marginTop: "10px" }}>
                              Delete Tier
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "rgba(18, 12, 36, 0.5)", border: "1px dashed rgba(0, 223, 216, 0.4)", borderRadius: "14px", padding: "24px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", marginBottom: "16px" }}>+ Add Pricing Tier</h4>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <input type="text" placeholder="Package Title" className="form-control" value={newPricing.title} onChange={(e) => setNewPricing({ ...newPricing, title: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-4">
                          <input type="text" placeholder="Monthly Price ($)" className="form-control" value={newPricing.price} onChange={(e) => setNewPricing({ ...newPricing, price: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-4">
                          <input type="text" placeholder="Features (comma-separated)" className="form-control" value={newPricing.features} onChange={(e) => setNewPricing({ ...newPricing, features: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <button type="button" onClick={() => {
                            if (!newPricing.title || !newPricing.price) return showFeedback("Title and price required", "danger");
                            const featArray = typeof newPricing.features === "string" ? newPricing.features.split(",").map(s => s.trim()) : [];
                            const updated = [...(cms?.pricing?.items || []), { ...newPricing, features: featArray, id: `tier-${Date.now()}` }];
                            saveCmsSection("pricing", { ...cms.pricing, items: updated });
                          }} style={{ background: "rgba(0, 223, 216, 0.2)", border: "1px solid #00dfd8", color: "#00dfd8", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                            Add Pricing Package
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. FAQS CRUD */}
                {activeTab === "faqs" && (
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#fff" }}>Frequently Asked Questions (Full CRUD)</h2>
                    <div className="row g-3 mb-4">
                      {faqs.map((f) => (
                        <div key={f._id} className="col-12">
                          <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "12px", padding: "18px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#00dfd8", margin: "0 0 6px 0" }}>{f.question}</h4>
                              <button onClick={() => deleteFaq(f._id)} style={{ background: "rgba(239, 68, 68, 0.15)", border: "none", color: "#ef4444", borderRadius: "6px", padding: "4px 8px", cursor: "pointer" }}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                            <p style={{ fontSize: "14px", color: "#cbd5e1", margin: 0, lineHeight: 1.6 }}>{f.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={addFaq} style={{ background: "rgba(18, 12, 36, 0.5)", border: "1px dashed rgba(0, 223, 216, 0.4)", borderRadius: "14px", padding: "24px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", marginBottom: "16px" }}>+ Add New FAQ</h4>
                      <div className="row g-3">
                        <div className="col-12">
                          <input type="text" placeholder="Question" required className="form-control" value={newFaq.question} onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <textarea rows={3} placeholder="Answer" required className="form-control" value={newFaq.answer} onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <button type="submit" disabled={saving} style={{ background: "rgba(0, 223, 216, 0.2)", border: "1px solid #00dfd8", color: "#00dfd8", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                            Save FAQ to MongoDB
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* CEO & FOUNDER PROFILE STUDIO */}
                {activeTab === "ceoProfile" && (
                  <div>
                    {/* Header & Save Bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "14px", background: "rgba(18, 12, 36, 0.7)", padding: "20px 24px", borderRadius: "16px", border: "1px solid rgba(0, 223, 216, 0.3)" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00ed64", boxShadow: "0 0 10px #00ed64", display: "inline-block" }}></span>
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "#00ed64", letterSpacing: "1px" }}>LIVE IN MONGODB: collection("team")</span>
                        </div>
                        <h2 style={{ fontSize: "22px", fontWeight: "800", margin: 0, color: "#fff" }}>
                          CEO &amp; Founder Spotlight Studio
                        </h2>
                        <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0 0" }}>
                          Manage Dhanesh Joshi's Executive Bio, Official Credly Badges, LinkedIn Certifications, Live Metrics, and Tech Stack.
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <a
                          href="/#founder-profile"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: "#fff",
                            padding: "9px 18px",
                            borderRadius: "10px",
                            fontSize: "13px",
                            fontWeight: "600",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <i className="bi bi-box-arrow-up-right"></i>
                          <span>View on Homepage</span>
                        </a>

                        <button
                          type="button"
                          onClick={saveCeoProfile}
                          disabled={saving}
                          style={{
                            background: "linear-gradient(135deg, #00DFD8 0%, #7928CA 100%)",
                            border: "none",
                            color: "#fff",
                            padding: "9px 24px",
                            borderRadius: "10px",
                            fontSize: "13.5px",
                            fontWeight: "700",
                            cursor: "pointer",
                            boxShadow: "0 4px 18px rgba(0, 223, 216, 0.4)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px"
                          }}
                        >
                          <i className="bi bi-cloud-arrow-up-fill"></i>
                          <span>{saving ? "Saving to MongoDB..." : "Save CEO Profile"}</span>
                        </button>
                      </div>
                    </div>

                    <form onSubmit={saveCeoProfile}>
                      <div className="row g-4 mb-4">
                        {/* 1. Visuals & Executive Identity */}
                        <div className="col-lg-5">
                          <div style={{ background: "rgba(18, 12, 36, 0.6)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "16px", padding: "22px", height: "100%" }}>
                            <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                              <i className="bi bi-person-bounding-box"></i> Executive Portrait &amp; Identity
                            </h4>

                            <div style={{ textAlign: "center", marginBottom: "18px" }}>
                              <div style={{ width: "160px", height: "160px", margin: "0 auto 12px", borderRadius: "20px", overflow: "hidden", border: "2px solid #00dfd8", boxShadow: "0 10px 30px rgba(0, 223, 216, 0.3)", background: "#0e081f" }}>
                                <img
                                  src={ceoProfile.image || "/assets/img/founder/dhanesh-joshi.png"}
                                  alt="CEO Preview"
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              </div>
                              <span style={{ fontSize: "12px", color: "#94a3b8" }}>Live Avatar Preview</span>
                            </div>

                            <div className="mb-3">
                              <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Profile Photo URL</label>
                              <input
                                type="text"
                                className="form-control"
                                value={ceoProfile.image || ""}
                                onChange={(e) => setCeoProfile({ ...ceoProfile, image: e.target.value })}
                                style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                              />
                            </div>

                            <div className="mb-3">
                              <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Full Name</label>
                              <input
                                type="text"
                                required
                                className="form-control"
                                value={ceoProfile.name || ""}
                                onChange={(e) => setCeoProfile({ ...ceoProfile, name: e.target.value })}
                                style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                              />
                            </div>

                            <div className="row g-2 mb-3">
                              <div className="col-6">
                                <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Designation</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ceoProfile.designation || ""}
                                  onChange={(e) => setCeoProfile({ ...ceoProfile, designation: e.target.value })}
                                  style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                />
                              </div>
                              <div className="col-6">
                                <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Company</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ceoProfile.company || ""}
                                  onChange={(e) => setCeoProfile({ ...ceoProfile, company: e.target.value })}
                                  style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                />
                              </div>
                            </div>

                            <div className="mb-3">
                              <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Operating Location</label>
                              <input
                                type="text"
                                className="form-control"
                                value={ceoProfile.location || ""}
                                onChange={(e) => setCeoProfile({ ...ceoProfile, location: e.target.value })}
                                style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                              />
                            </div>

                            <div>
                              <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Professional Headline</label>
                              <input
                                type="text"
                                className="form-control"
                                value={ceoProfile.headline || ""}
                                onChange={(e) => setCeoProfile({ ...ceoProfile, headline: e.target.value })}
                                style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Vision, Bio Narrative & Credly Badges */}
                        <div className="col-lg-7">
                          <div style={{ background: "rgba(18, 12, 36, 0.6)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "16px", padding: "22px", height: "100%" }}>
                            <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                              <i className="bi bi-chat-left-quote"></i> Vision Quote &amp; Leadership Narrative
                            </h4>

                            <div className="mb-3">
                              <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Executive Vision Statement</label>
                              <textarea
                                rows={3}
                                className="form-control"
                                value={ceoProfile.visionQuote || ""}
                                onChange={(e) => setCeoProfile({ ...ceoProfile, visionQuote: e.target.value })}
                                style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff", fontSize: "13.5px" }}
                              />
                            </div>

                            <div className="row g-2 mb-3">
                              <div className="col-6">
                                <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Quote Author</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ceoProfile.quoteAuthor || ""}
                                  onChange={(e) => setCeoProfile({ ...ceoProfile, quoteAuthor: e.target.value })}
                                  style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                />
                              </div>
                              <div className="col-6">
                                <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Author Title</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ceoProfile.quoteAuthorTitle || ""}
                                  onChange={(e) => setCeoProfile({ ...ceoProfile, quoteAuthorTitle: e.target.value })}
                                  style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                />
                              </div>
                            </div>

                            <div className="mb-4">
                              <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Executive Bio Narrative (Full Story)</label>
                              <textarea
                                rows={4}
                                className="form-control"
                                value={ceoProfile.bio || ""}
                                onChange={(e) => setCeoProfile({ ...ceoProfile, bio: e.target.value })}
                                style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff", fontSize: "13.5px", lineHeight: "1.6" }}
                              />
                            </div>

                            {/* Official Credly Badge & LinkedIn Certifications */}
                            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#00ed64", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                              <i className="bi bi-patch-check-fill"></i> Credly &amp; LinkedIn Verification Links
                            </h4>

                            <div className="row g-3">
                              <div className="col-md-7">
                                <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Official Credly Badge Verification URL</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ceoProfile.credlyBadgeUrl || ""}
                                  onChange={(e) => setCeoProfile({ ...ceoProfile, credlyBadgeUrl: e.target.value })}
                                  style={{ background: "#0e081f", border: "1px solid rgba(0, 237, 100, 0.3)", color: "#fff" }}
                                />
                              </div>
                              <div className="col-md-5">
                                <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Credly Badge Image Path</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ceoProfile.credlyImg || ""}
                                  onChange={(e) => setCeoProfile({ ...ceoProfile, credlyImg: e.target.value })}
                                  style={{ background: "#0e081f", border: "1px solid rgba(0, 237, 100, 0.3)", color: "#fff" }}
                                />
                              </div>

                              <div className="col-12">
                                <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>LinkedIn Certifications Directory URL</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ceoProfile.linkedinCertificationsUrl || ""}
                                  onChange={(e) => setCeoProfile({ ...ceoProfile, linkedinCertificationsUrl: e.target.value })}
                                  style={{ background: "#0e081f", border: "1px solid rgba(0, 119, 181, 0.3)", color: "#fff" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3. Social & Booking Channels */}
                        <div className="col-12">
                          <div style={{ background: "rgba(18, 12, 36, 0.6)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "16px", padding: "22px" }}>
                            <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                              <i className="bi bi-link-45deg"></i> Executive Social Profiles &amp; Booking Integrations
                            </h4>

                            <div className="row g-3">
                              <div className="col-md-3">
                                <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>LinkedIn Profile</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ceoProfile.socialLinks?.linkedin || ""}
                                  onChange={(e) => setCeoProfile({ ...ceoProfile, socialLinks: { ...ceoProfile.socialLinks, linkedin: e.target.value } })}
                                  style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                />
                              </div>
                              <div className="col-md-3">
                                <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>GitHub Profile</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ceoProfile.socialLinks?.github || ""}
                                  onChange={(e) => setCeoProfile({ ...ceoProfile, socialLinks: { ...ceoProfile.socialLinks, github: e.target.value } })}
                                  style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                />
                              </div>
                              <div className="col-md-3">
                                <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Instagram Profile</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ceoProfile.socialLinks?.instagram || ""}
                                  onChange={(e) => setCeoProfile({ ...ceoProfile, socialLinks: { ...ceoProfile.socialLinks, instagram: e.target.value } })}
                                  style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                />
                              </div>
                              <div className="col-md-3">
                                <label style={{ fontSize: "12px", color: "#00dfd8", marginBottom: "4px" }}>Cal.com 1-on-1 Strategy Call</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={ceoProfile.socialLinks?.cal || ""}
                                  onChange={(e) => setCeoProfile({ ...ceoProfile, socialLinks: { ...ceoProfile.socialLinks, cal: e.target.value } })}
                                  style={{ background: "#0e081f", border: "1px solid rgba(0, 223, 216, 0.4)", color: "#fff" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 4. Live Impact Metrics (4 Pods) */}
                        <div className="col-12">
                          <div style={{ background: "rgba(18, 12, 36, 0.6)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "16px", padding: "22px" }}>
                            <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                              <i className="bi bi-speedometer2"></i> Live Impact Metrics Pods (Homepage Counter)
                            </h4>

                            <div className="row g-3">
                              {(ceoProfile.metrics || []).map((m, idx) => (
                                <div key={idx} className="col-md-3">
                                  <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(121, 40, 202, 0.25)", borderRadius: "12px", padding: "14px" }}>
                                    <span style={{ fontSize: "11px", color: "#00dfd8", fontWeight: "700" }}>Metric Pod #{idx + 1}</span>
                                    <div className="mt-2 mb-2">
                                      <label style={{ fontSize: "11px", color: "#94a3b8" }}>Value (e.g. 150+)</label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={m.value || ""}
                                        onChange={(e) => {
                                          const next = [...ceoProfile.metrics];
                                          next[idx] = { ...next[idx], value: e.target.value };
                                          setCeoProfile({ ...ceoProfile, metrics: next });
                                        }}
                                        style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                      />
                                    </div>
                                    <div className="mb-2">
                                      <label style={{ fontSize: "11px", color: "#94a3b8" }}>Label</label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={m.label || ""}
                                        onChange={(e) => {
                                          const next = [...ceoProfile.metrics];
                                          next[idx] = { ...next[idx], label: e.target.value };
                                          setCeoProfile({ ...ceoProfile, metrics: next });
                                        }}
                                        style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ fontSize: "11px", color: "#94a3b8" }}>Subtext</label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={m.subtext || ""}
                                        onChange={(e) => {
                                          const next = [...ceoProfile.metrics];
                                          next[idx] = { ...next[idx], subtext: e.target.value };
                                          setCeoProfile({ ...ceoProfile, metrics: next });
                                        }}
                                        style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 5. Certifications & Badges Manager */}
                        <div className="col-12">
                          <div style={{ background: "rgba(18, 12, 36, 0.6)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "16px", padding: "22px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                                <i className="bi bi-award-fill"></i> Professional Certifications &amp; Licenses ({(ceoProfile.certifications || []).length})
                              </h4>

                              <button
                                type="button"
                                onClick={() => {
                                  const newCert = {
                                    title: "New Certified Credential",
                                    issuer: "Issuing Organization",
                                    issuedTo: ceoProfile.name || "Dhanesh Joshi",
                                    code: "CERT-ID-1234",
                                    verifyUrl: ceoProfile.linkedinCertificationsUrl || "https://www.linkedin.com/in/dhanesh-joshi/details/certifications/",
                                    color: "#00DFD8",
                                    badge: "Professional License",
                                    description: "Describe competencies and scope of this verified engineering credential."
                                  };
                                  setCeoProfile({
                                    ...ceoProfile,
                                    certifications: [...(ceoProfile.certifications || []), newCert]
                                  });
                                }}
                                style={{
                                  background: "rgba(0, 223, 216, 0.15)",
                                  border: "1px solid #00dfd8",
                                  color: "#00dfd8",
                                  padding: "6px 14px",
                                  borderRadius: "8px",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  cursor: "pointer"
                                }}
                              >
                                + Add Another Certification
                              </button>
                            </div>

                            <div className="d-flex flex-column gap-3">
                              {(ceoProfile.certifications || []).map((cert, cIdx) => (
                                <div key={cIdx} style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "16px" }}>
                                  <div className="row g-2 align-items-center">
                                    <div className="col-md-3">
                                      <label style={{ fontSize: "11px", color: "#94a3b8" }}>Title</label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={cert.title || ""}
                                        onChange={(e) => {
                                          const next = [...ceoProfile.certifications];
                                          next[cIdx] = { ...next[cIdx], title: e.target.value };
                                          setCeoProfile({ ...ceoProfile, certifications: next });
                                        }}
                                        style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                      />
                                    </div>
                                    <div className="col-md-2">
                                      <label style={{ fontSize: "11px", color: "#94a3b8" }}>Issuer</label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={cert.issuer || ""}
                                        onChange={(e) => {
                                          const next = [...ceoProfile.certifications];
                                          next[cIdx] = { ...next[cIdx], issuer: e.target.value };
                                          setCeoProfile({ ...ceoProfile, certifications: next });
                                        }}
                                        style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                      />
                                    </div>
                                    <div className="col-md-2">
                                      <label style={{ fontSize: "11px", color: "#94a3b8" }}>Code / ID</label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={cert.code || ""}
                                        onChange={(e) => {
                                          const next = [...ceoProfile.certifications];
                                          next[cIdx] = { ...next[cIdx], code: e.target.value };
                                          setCeoProfile({ ...ceoProfile, certifications: next });
                                        }}
                                        style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <label style={{ fontSize: "11px", color: "#94a3b8" }}>Verification URL</label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={cert.verifyUrl || ""}
                                        onChange={(e) => {
                                          const next = [...ceoProfile.certifications];
                                          next[cIdx] = { ...next[cIdx], verifyUrl: e.target.value };
                                          setCeoProfile({ ...ceoProfile, certifications: next });
                                        }}
                                        style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                                      />
                                    </div>
                                    <div className="col-md-1 text-end">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = ceoProfile.certifications.filter((_, i) => i !== cIdx);
                                          setCeoProfile({ ...ceoProfile, certifications: next });
                                        }}
                                        style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", borderRadius: "6px", padding: "4px 8px", fontSize: "11px", cursor: "pointer" }}
                                        title="Remove Certification"
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>
                                    <div className="col-12 mt-1">
                                      <label style={{ fontSize: "11px", color: "#94a3b8" }}>Credential Scope / Description</label>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={cert.description || ""}
                                        onChange={(e) => {
                                          const next = [...ceoProfile.certifications];
                                          next[cIdx] = { ...next[cIdx], description: e.target.value };
                                          setCeoProfile({ ...ceoProfile, certifications: next });
                                        }}
                                        style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.2)", color: "#cbd5e1" }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Save Trigger Button */}
                        <div className="col-12 text-end">
                          <button
                            type="submit"
                            disabled={saving}
                            style={{
                              background: "linear-gradient(135deg, #00DFD8 0%, #7928CA 100%)",
                              border: "none",
                              color: "#fff",
                              padding: "12px 36px",
                              borderRadius: "12px",
                              fontSize: "15px",
                              fontWeight: "800",
                              cursor: "pointer",
                              boxShadow: "0 8px 25px rgba(0, 223, 216, 0.4)"
                            }}
                          >
                            <i className="bi bi-cloud-arrow-up-fill me-2"></i>
                            <span>{saving ? "Updating MongoDB..." : "Save CEO & Founder Profile to MongoDB"}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* 9. TEAM CRUD */}
                {activeTab === "team" && (
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#fff" }}>Team Leaders &amp; Architects (Full CRUD)</h2>
                    <div className="row g-4 mb-4">
                      {team.map((m) => (
                        <div key={m._id || m.id} className="col-md-3">
                          <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", overflow: "hidden", textAlign: "center" }}>
                            <img src={m.image || "assets/img/home-4/experts-01.png"} alt={m.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                            <div style={{ padding: "16px" }}>
                              <h5 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", margin: "0 0 4px 0" }}>{m.name}</h5>
                              <span style={{ fontSize: "13px", color: "#00dfd8" }}>{m.designation}</span>
                              <div style={{ marginTop: "12px" }}>
                                <button onClick={() => deleteTeamMember(m._id || m.id)} style={{ background: "rgba(239, 68, 68, 0.15)", border: "none", color: "#ef4444", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", cursor: "pointer" }}>
                                  Remove Member
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={addTeamMember} style={{ background: "rgba(18, 12, 36, 0.5)", border: "1px dashed rgba(0, 223, 216, 0.4)", borderRadius: "14px", padding: "24px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", marginBottom: "16px" }}>+ Add Team Leader</h4>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <input type="text" placeholder="Name" required className="form-control" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-4">
                          <input type="text" placeholder="Designation" required className="form-control" value={newTeam.designation} onChange={(e) => setNewTeam({ ...newTeam, designation: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-4">
                          <input type="text" placeholder="Image Path" className="form-control" value={newTeam.image} onChange={(e) => setNewTeam({ ...newTeam, image: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <button type="submit" disabled={saving} style={{ background: "rgba(0, 223, 216, 0.2)", border: "1px solid #00dfd8", color: "#00dfd8", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                            Save Team Member to MongoDB
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* 10. NEWS & ARTICLES STUDIO */}
                {activeTab === "blogs" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                      <div>
                        <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "#fff" }}>News &amp; Articles Studio</h2>
                        <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Manage in-depth engineering articles, custom news releases, and live open-source IT news feeds.</p>
                      </div>

                      {/* Sub-tab Switcher */}
                      <div style={{ display: "flex", gap: "6px", background: "#0b0618", padding: "4px", borderRadius: "10px", border: "1px solid rgba(121, 40, 202, 0.3)" }}>
                        <button
                          type="button"
                          onClick={() => setBlogSubTab("articles")}
                          style={{
                            background: blogSubTab === "articles" ? "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)" : "transparent",
                            color: blogSubTab === "articles" ? "#fff" : "#94a3b8",
                            border: "none",
                            borderRadius: "7px",
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          <i className="bi bi-file-earmark-text me-1"></i> Technical Articles ({blogs.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setBlogSubTab("news")}
                          style={{
                            background: blogSubTab === "news" ? "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)" : "transparent",
                            color: blogSubTab === "news" ? "#fff" : "#94a3b8",
                            border: "none",
                            borderRadius: "7px",
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          <i className="bi bi-megaphone me-1"></i> Agency Newsroom ({news.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setBlogSubTab("liveStream")}
                          style={{
                            background: blogSubTab === "liveStream" ? "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)" : "transparent",
                            color: blogSubTab === "liveStream" ? "#fff" : "#94a3b8",
                            border: "none",
                            borderRadius: "7px",
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          <i className="bi bi-broadcast me-1 text-danger"></i> Live IT News API ({liveNewsStream.length})
                        </button>
                      </div>
                    </div>

                    {/* SUBTAB 1: TECHNICAL ARTICLES */}
                    {blogSubTab === "articles" && (
                      <div>
                        <div className="row g-4 mb-4">
                          {blogs.map((b) => (
                            <div key={b._id || b.id} className="col-md-4">
                              <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", overflow: "hidden" }}>
                                {b.image && (
                                  <img src={b.image || b.img} alt={b.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                                )}
                                <div style={{ padding: "16px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                                    <span style={{ fontSize: "11px", color: "#00dfd8", textTransform: "uppercase", fontWeight: "700" }}>{b.category} • {b.date}</span>
                                    {b.videoUrl && <i className="bi bi-play-circle-fill text-danger" title="Has video embed"></i>}
                                  </div>
                                  <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#fff", margin: "6px 0" }}>{b.title}</h5>
                                  <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
                                    {b.excerpt ? (b.excerpt.length > 90 ? b.excerpt.substring(0, 90) + "..." : b.excerpt) : "Technical article on cloud and AI architecture."}
                                  </p>
                                  {Array.isArray(b.tags) && b.tags.length > 0 && (
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }}>
                                      {b.tags.slice(0, 3).map((t, idx) => (
                                        <span key={idx} style={{ fontSize: "10px", background: "rgba(255,255,255,0.05)", color: "#cbd5e1", padding: "1px 6px", borderRadius: "8px" }}>
                                          #{t}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                                    <button onClick={() => setEditingItem({ type: 'blog', data: { ...b } })} style={{ background: "rgba(0, 223, 216, 0.15)", border: "1px solid rgba(0, 223, 216, 0.3)", color: "#00dfd8", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                                      <i className="bi bi-pencil me-1"></i> Edit
                                    </button>
                                    <button onClick={() => deleteBlogPost(b._id || b.id)} style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                                      <i className="bi bi-trash me-1"></i> Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={addBlogPost} style={{ background: "rgba(18, 12, 36, 0.5)", border: "1px dashed rgba(0, 223, 216, 0.4)", borderRadius: "14px", padding: "24px" }}>
                          <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", marginBottom: "16px" }}>+ Publish New Tech Article / Insight</h4>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Article Title</label>
                              <input type="text" placeholder="Title" required className="form-control" value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value, slug: newBlog.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-md-6">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>URL Slug</label>
                              <input type="text" placeholder="e.g. architecting-real-time-ai-agents" className="form-control" value={newBlog.slug} onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-md-4">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Category</label>
                              <input type="text" placeholder="Category (e.g. AI & Software, Cloud)" className="form-control" value={newBlog.category} onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-md-4">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Author Name</label>
                              <input type="text" placeholder="Author" className="form-control" value={newBlog.author} onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-md-4">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Estimated Read Time</label>
                              <input type="text" placeholder="e.g. 5 min read" className="form-control" value={newBlog.readTime} onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-12">
                              <ImageUploadInput
                                label="Featured Article Banner Image"
                                value={newBlog.image}
                                onChange={(url) => setNewBlog({ ...newBlog, image: url })}
                              />
                            </div>
                            <div className="col-12">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Optional Video Embed URL (YouTube or Vimeo)</label>
                              <input type="text" placeholder="https://www.youtube.com/watch?v=..." className="form-control" value={newBlog.videoUrl} onChange={(e) => setNewBlog({ ...newBlog, videoUrl: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-12">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Article Tags (comma-separated)</label>
                              <input type="text" placeholder="e.g. Next.js, AI, Architecture, DevOps" className="form-control" value={typeof newBlog.tags === 'string' ? newBlog.tags : Array.isArray(newBlog.tags) ? newBlog.tags.join(', ') : ''} onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-12">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Short Excerpt</label>
                              <textarea rows={2} placeholder="Brief summary displayed on blog listings" className="form-control" value={newBlog.excerpt} onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-12">
                              <RichTextEditor
                                label="Full Article Content (WYSIWYG / HTML)"
                                value={newBlog.content}
                                onChange={(html) => setNewBlog({ ...newBlog, content: html })}
                                placeholder="Write comprehensive article content with headings, lists, code, and images..."
                              />
                            </div>
                            <div className="col-12">
                              <button type="submit" disabled={saving} style={{ background: "rgba(0, 223, 216, 0.2)", border: "1px solid #00dfd8", color: "#00dfd8", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                                Publish Article to MongoDB Atlas
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* SUBTAB 2: AGENCY NEWSROOM */}
                    {blogSubTab === "news" && (
                      <div>
                        <div className="row g-4 mb-4">
                          {news.map((n) => (
                            <div key={n._id || n.id} className="col-md-4">
                              <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(0, 223, 216, 0.3)", borderRadius: "14px", overflow: "hidden" }}>
                                {n.image && (
                                  <img src={n.image} alt={n.title} style={{ width: "100%", height: "170px", objectFit: "cover" }} />
                                )}
                                <div style={{ padding: "16px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                    <span style={{ fontSize: "11px", color: "#a855f7", fontWeight: "700" }}>{n.category || "IT NEWS"}</span>
                                    <span style={{ fontSize: "10px", color: "#94a3b8" }}>{n.date}</span>
                                  </div>
                                  <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#fff", margin: "6px 0" }}>{n.title}</h5>
                                  <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>{n.excerpt || "News announcement from TechWithJoshi."}</p>
                                  <div style={{ fontSize: "11px", color: "#00dfd8", marginBottom: "10px" }}>
                                    <i className="bi bi-building me-1"></i> {n.source || "TechWithJoshi Newsroom"}
                                  </div>
                                  <div style={{ display: "flex", gap: "8px" }}>
                                    <button onClick={() => setEditingItem({ type: 'news', data: { ...n } })} style={{ background: "rgba(0, 223, 216, 0.15)", border: "1px solid rgba(0, 223, 216, 0.3)", color: "#00dfd8", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                                      <i className="bi bi-pencil me-1"></i> Edit
                                    </button>
                                    <button onClick={() => deleteNewsItem(n._id || n.id)} style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                                      <i className="bi bi-trash me-1"></i> Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={addNewsItem} style={{ background: "rgba(18, 12, 36, 0.5)", border: "1px dashed rgba(168, 85, 247, 0.4)", borderRadius: "14px", padding: "24px" }}>
                          <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#a855f7", marginBottom: "16px" }}>+ Publish New Agency News / IT Release</h4>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>News Title</label>
                              <input type="text" placeholder="Title" required className="form-control" value={newNewsItem.title} onChange={(e) => setNewNewsItem({ ...newNewsItem, title: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-md-6">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Category</label>
                              <input type="text" placeholder="e.g. CLOUD INFRASTRUCTURE, AI RELEASE, SECURITY" className="form-control" value={newNewsItem.category} onChange={(e) => setNewNewsItem({ ...newNewsItem, category: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-md-6">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Source Name</label>
                              <input type="text" placeholder="e.g. TechWithJoshi Newsroom, CNCF, Reuters Tech" className="form-control" value={newNewsItem.source} onChange={(e) => setNewNewsItem({ ...newNewsItem, source: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-md-6">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Source / Reference URL (Optional)</label>
                              <input type="text" placeholder="https://..." className="form-control" value={newNewsItem.url} onChange={(e) => setNewNewsItem({ ...newNewsItem, url: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-12">
                              <ImageUploadInput
                                label="Featured News Graphic"
                                value={newNewsItem.image}
                                onChange={(url) => setNewNewsItem({ ...newNewsItem, image: url })}
                              />
                            </div>
                            <div className="col-12">
                              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Short Summary Excerpt</label>
                              <textarea rows={2} placeholder="Quick teaser summary..." className="form-control" value={newNewsItem.excerpt} onChange={(e) => setNewNewsItem({ ...newNewsItem, excerpt: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                            </div>
                            <div className="col-12">
                              <RichTextEditor
                                label="Full News Announcement & Details"
                                value={newNewsItem.content}
                                onChange={(html) => setNewNewsItem({ ...newNewsItem, content: html })}
                              />
                            </div>
                            <div className="col-12">
                              <button type="submit" disabled={saving} style={{ background: "rgba(168, 85, 247, 0.2)", border: "1px solid #a855f7", color: "#a855f7", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                                Publish News to MongoDB Atlas
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* SUBTAB 3: LIVE IT NEWS API */}
                    {blogSubTab === "liveStream" && (
                      <div>
                        <div style={{ background: "rgba(0, 223, 216, 0.08)", border: "1px solid rgba(0, 223, 216, 0.25)", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <i className="bi bi-broadcast text-danger fs-4"></i>
                            <div>
                              <div style={{ fontWeight: "700", color: "#00dfd8", fontSize: "14px" }}>Open-Source Live IT News Feed (Real-Time Synchronized)</div>
                              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                                Real-time trending software &amp; AI news automatically streaming into the website from DEV.to and open tech APIs. You can import any story into your MongoDB Atlas database with 1 click to edit and customize.
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row g-4">
                          {liveNewsStream.map((item, idx) => (
                            <div key={item.id || idx} className="col-md-6 col-lg-4">
                              <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                  {item.image && (
                                    <div style={{ height: "160px", overflow: "hidden" }}>
                                      <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                  )}
                                  <div style={{ padding: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                      <span style={{ fontSize: "10px", background: "rgba(0, 223, 216, 0.15)", color: "#00dfd8", padding: "2px 8px", borderRadius: "10px", fontWeight: "700" }}>{item.category}</span>
                                      <span style={{ fontSize: "10px", color: "#94a3b8" }}>{item.date}</span>
                                    </div>
                                    <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#fff", margin: "8px 0" }}>{item.title}</h5>
                                    <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>{item.excerpt ? item.excerpt.substring(0, 110) + "..." : ""}</p>
                                    <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                                      <i className="bi bi-globe me-1"></i> {item.source}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ padding: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#00dfd8", textDecoration: "none" }}>
                                    Source Article <i className="bi bi-box-arrow-up-right small"></i>
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => importLiveNewsToDb(item)}
                                    disabled={saving}
                                    style={{ background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)", border: "none", color: "#fff", borderRadius: "6px", padding: "5px 12px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}
                                  >
                                    <i className="bi bi-download me-1"></i> 1-Click Import
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 11. INQUIRIES */}
                {activeTab === "inquiries" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <div>
                        <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "#fff" }}>Contact Inquiries &amp; Leads</h2>
                        <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Submissions received from /contact page</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => setInquiryFilter("all")} style={{ background: inquiryFilter === "all" ? "#7928ca" : "rgba(255, 255, 255, 0.05)", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
                          All ({inquiries.length})
                        </button>
                        <button onClick={() => setInquiryFilter("unread")} style={{ background: inquiryFilter === "unread" ? "#ef4444" : "rgba(255, 255, 255, 0.05)", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
                          Unread ({unreadCount})
                        </button>
                      </div>
                    </div>

                    <div className="row g-3">
                      {filteredInquiries.map((inq) => (
                        <div key={inq._id} className="col-12">
                          <div style={{ background: inq.status === "unread" ? "rgba(121, 40, 202, 0.12)" : "rgba(18, 12, 36, 0.6)", border: inq.status === "unread" ? "1px solid rgba(121, 40, 202, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <h4 style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "#fff" }}>{inq.name}</h4>
                                  {inq.company && inq.company !== "N/A" && <span style={{ fontSize: "12px", background: "rgba(0, 223, 216, 0.15)", color: "#00dfd8", padding: "2px 8px", borderRadius: "4px" }}>{inq.company}</span>}
                                  <span style={{ fontSize: "11px", background: inq.status === "unread" ? "#ef4444" : "#10b981", color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: "700" }}>{inq.status}</span>
                                </div>
                                <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
                                  <span><i className="bi bi-envelope me-1"></i> {inq.email}</span>
                                  <span style={{ margin: "0 8px" }}>•</span>
                                  <span><i className="bi bi-telephone me-1"></i> {inq.phone}</span>
                                  <span style={{ margin: "0 8px" }}>•</span>
                                  <span>{new Date(inq.createdAt).toLocaleString()}</span>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => toggleInquiryStatus(inq)} style={{ background: "rgba(255, 255, 255, 0.08)", border: "none", color: "#e2e8f0", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
                                  Mark {inq.status === "unread" ? "Read" : "Unread"}
                                </button>
                                <a href={`mailto:${inq.email}?subject=Re: Inquiry from TechWithJoshi`} style={{ background: "rgba(0, 223, 216, 0.15)", color: "#00dfd8", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", textDecoration: "none", fontWeight: "600" }}>
                                  Reply
                                </a>
                                <button onClick={() => deleteInquiry(inq._id)} style={{ background: "rgba(239, 68, 68, 0.15)", border: "none", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                            <div style={{ marginTop: "14px", background: "rgba(10, 5, 20, 0.5)", padding: "14px", borderRadius: "8px", fontSize: "14px", color: "#cbd5e1" }}>
                              {inq.message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 11.5 AI LEADS & CHATBOT SESSIONS */}
                {activeTab === "aiLeads" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "#fff" }}>
                            TechWithJoshi AI Qualified Leads &amp; Sessions
                          </h2>
                          <span style={{ background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)", color: "#fff", fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "10px" }}>
                            AI Assistant Engine Active
                          </span>
                        </div>
                        <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0 0" }}>
                          Real-time AI lead qualification, token-optimized MongoDB session transcripts, and direct WhatsApp connect
                        </p>
                      </div>

                      {/* Filter Buttons */}
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => setAiFilter("all")}
                          style={{
                            background: aiFilter === "all" ? "#7928ca" : "rgba(255, 255, 255, 0.05)",
                            color: "#fff",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          All ({aiSessions.length})
                        </button>
                        <button
                          onClick={() => setAiFilter("HOT")}
                          style={{
                            background: aiFilter === "HOT" ? "#ef4444" : "rgba(255, 255, 255, 0.05)",
                            color: "#fff",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          🔥 HOT ({aiSessions.filter((s) => s.leadScore === "HOT").length})
                        </button>
                        <button
                          onClick={() => setAiFilter("WARM")}
                          style={{
                            background: aiFilter === "WARM" ? "#f59e0b" : "rgba(255, 255, 255, 0.05)",
                            color: "#fff",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          🟡 WARM ({aiSessions.filter((s) => s.leadScore === "WARM").length})
                        </button>
                        <button
                          onClick={() => setAiFilter("COLD")}
                          style={{
                            background: aiFilter === "COLD" ? "#3b82f6" : "rgba(255, 255, 255, 0.05)",
                            color: "#fff",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          🔵 COLD ({aiSessions.filter((s) => s.leadScore === "COLD" || !s.leadScore).length})
                        </button>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="row g-3 mb-4">
                      <div className="col-md-3 col-6">
                        <div style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "12px", padding: "16px" }}>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Total AI Sessions</div>
                          <div style={{ fontSize: "24px", fontWeight: "800", color: "#00dfd8", marginTop: "4px" }}>{aiSessions.length}</div>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "12px", padding: "16px" }}>
                          <div style={{ fontSize: "12px", color: "#fca5a5" }}>🔥 HOT Leads</div>
                          <div style={{ fontSize: "24px", fontWeight: "800", color: "#ef4444", marginTop: "4px" }}>
                            {aiSessions.filter((s) => s.leadScore === "HOT").length}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.4)", borderRadius: "12px", padding: "16px" }}>
                          <div style={{ fontSize: "12px", color: "#fde68a" }}>🟡 WARM Leads</div>
                          <div style={{ fontSize: "24px", fontWeight: "800", color: "#f59e0b", marginTop: "4px" }}>
                            {aiSessions.filter((s) => s.leadScore === "WARM").length}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div style={{ background: "rgba(121, 40, 202, 0.15)", border: "1px solid rgba(121, 40, 202, 0.4)", borderRadius: "12px", padding: "16px" }}>
                          <div style={{ fontSize: "12px", color: "#d8b4fe" }}>Total AI Messages</div>
                          <div style={{ fontSize: "24px", fontWeight: "800", color: "#a855f7", marginTop: "4px" }}>
                            {aiSessions.reduce((acc, s) => acc + (s.messages?.length || 0), 0)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Sessions List */}
                    <div className="row g-3">
                      {aiSessions
                        .filter((s) => {
                          if (aiFilter === "all") return true;
                          if (aiFilter === "COLD") return s.leadScore === "COLD" || !s.leadScore;
                          return s.leadScore === aiFilter;
                        })
                        .map((session) => {
                          const lead = session.leadData || {};
                          const score = session.leadScore || lead.lead_score || "COLD";
                          const messageCount = session.messages?.length || 0;
                          const phoneClean = (lead.phone || "").replace(/[^0-9]/g, "");

                          return (
                            <div key={session._id || session.sessionId} className="col-12">
                              <div
                                style={{
                                  background:
                                    score === "HOT"
                                      ? "rgba(239, 68, 68, 0.08)"
                                      : score === "WARM"
                                      ? "rgba(245, 158, 11, 0.08)"
                                      : "rgba(18, 12, 36, 0.6)",
                                  border:
                                    score === "HOT"
                                      ? "1px solid rgba(239, 68, 68, 0.4)"
                                      : score === "WARM"
                                      ? "1px solid rgba(245, 158, 11, 0.4)"
                                      : "1px solid rgba(121, 40, 202, 0.25)",
                                  borderRadius: "14px",
                                  padding: "20px",
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                                  <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          fontWeight: "800",
                                          padding: "3px 10px",
                                          borderRadius: "6px",
                                          color: "#ffffff",
                                          background:
                                            score === "HOT"
                                              ? "linear-gradient(135deg, #ef4444, #f97316)"
                                              : score === "WARM"
                                              ? "linear-gradient(135deg, #f59e0b, #d97706)"
                                              : "linear-gradient(135deg, #3b82f6, #6366f1)",
                                        }}
                                      >
                                        {score === "HOT" ? "🔥 HOT LEAD" : score === "WARM" ? "🟡 WARM LEAD" : "🔵 EXPLORING"}
                                      </span>

                                      <h4 style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "#fff" }}>
                                        {lead.name || "Anonymous Website Visitor"}
                                      </h4>

                                      {lead.company && lead.company !== "N/A" && (
                                        <span style={{ fontSize: "12px", background: "rgba(0, 223, 216, 0.15)", color: "#00dfd8", padding: "2px 8px", borderRadius: "4px" }}>
                                          {lead.company}
                                        </span>
                                      )}

                                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                                        Session: {session.sessionId}
                                      </span>
                                    </div>

                                    {/* Contact Details */}
                                    <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "6px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                      {lead.email && (
                                        <span>
                                          <i className="bi bi-envelope me-1 text-info"></i> {lead.email}
                                        </span>
                                      )}
                                      {lead.phone && (
                                        <span>
                                          <i className="bi bi-telephone me-1 text-success"></i> {lead.phone}
                                        </span>
                                      )}
                                      <span>
                                        <i className="bi bi-chat-left-dots me-1 text-primary"></i> {messageCount} messages
                                      </span>
                                      <span>
                                        <i className="bi bi-clock me-1"></i> {new Date(session.updatedAt || session.createdAt).toLocaleString()}
                                      </span>
                                    </div>

                                    {/* Project Summary */}
                                    {(lead.project_type || lead.requirement || lead.timeline) && (
                                      <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        {lead.project_type && (
                                          <span style={{ fontSize: "12px", background: "rgba(121, 40, 202, 0.25)", color: "#c084fc", padding: "2px 8px", borderRadius: "4px" }}>
                                            Type: {lead.project_type}
                                          </span>
                                        )}
                                        {lead.timeline && (
                                          <span style={{ fontSize: "12px", background: "rgba(59, 130, 246, 0.2)", color: "#93c5fd", padding: "2px 8px", borderRadius: "4px" }}>
                                            Timeline: {lead.timeline}
                                          </span>
                                        )}
                                        {lead.budget && (
                                          <span style={{ fontSize: "12px", background: "rgba(16, 185, 129, 0.2)", color: "#6ee7b7", padding: "2px 8px", borderRadius: "4px" }}>
                                            Budget: {lead.budget}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedSessionTranscript(session)}
                                      style={{
                                        background: "linear-gradient(135deg, rgba(121, 40, 202, 0.4), rgba(0, 223, 216, 0.3))",
                                        border: "1px solid rgba(0, 223, 216, 0.5)",
                                        color: "#00dfd8",
                                        padding: "6px 14px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                      }}
                                    >
                                      <i className="bi bi-chat-text"></i>
                                      <span>View Transcript</span>
                                    </button>

                                    {phoneClean && (
                                      <a
                                        href={`https://wa.me/${phoneClean}?text=${encodeURIComponent("Hi " + (lead.name || "") + ", this is Dhanesh from TechWithJoshi. I saw your inquiry about " + (lead.project_type || "software development") + ".")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          background: "#25d366",
                                          color: "#fff",
                                          padding: "6px 12px",
                                          borderRadius: "6px",
                                          fontSize: "12px",
                                          fontWeight: "700",
                                          textDecoration: "none",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "6px",
                                        }}
                                      >
                                        <i className="fab fa-whatsapp"></i>
                                        <span>WhatsApp</span>
                                      </a>
                                    )}

                                    {lead.email && (
                                      <a
                                        href={`mailto:${lead.email}?subject=TechWithJoshi Project Discussion`}
                                        style={{
                                          background: "rgba(0, 223, 216, 0.15)",
                                          color: "#00dfd8",
                                          padding: "6px 12px",
                                          borderRadius: "6px",
                                          fontSize: "12px",
                                          fontWeight: "600",
                                          textDecoration: "none",
                                        }}
                                      >
                                        Email
                                      </a>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => deleteAiSession(session.sessionId || session._id)}
                                      style={{
                                        background: "rgba(239, 68, 68, 0.15)",
                                        border: "none",
                                        color: "#ef4444",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>

                                {/* Last User Message / Requirement Preview */}
                                {lead.requirement ? (
                                  <div style={{ marginTop: "12px", background: "rgba(10, 5, 20, 0.6)", borderLeft: "3px solid #00dfd8", padding: "10px 14px", borderRadius: "0 8px 8px 0", fontSize: "13px", color: "#e2e8f0" }}>
                                    <strong style={{ color: "#00dfd8" }}>Requirement: </strong>
                                    {lead.requirement}
                                  </div>
                                ) : (
                                  session.messages && session.messages.length > 0 && (
                                    <div style={{ marginTop: "12px", background: "rgba(10, 5, 20, 0.5)", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", color: "#cbd5e1" }}>
                                      <strong style={{ color: "#94a3b8" }}>Latest message: </strong>
                                      {session.messages[session.messages.length - 1].content.substring(0, 160)}...
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}

                      {aiSessions.length === 0 && (
                        <div className="col-12 text-center py-5" style={{ color: "#94a3b8" }}>
                          <i className="bi bi-robot" style={{ fontSize: "48px", color: "#7928ca" }}></i>
                          <h4 style={{ color: "#fff", marginTop: "12px" }}>No AI Chatbot Sessions Yet</h4>
                          <p>Visitors who chat with the TechWithJoshi AI widget will appear here in real-time with automated lead qualification scores.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 12. GLOBAL SETTINGS & SEO */}
                {activeTab === "settings" && (
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#fff" }}>Global Settings &amp; SEO</h2>
                    <form onSubmit={saveSettings} style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", padding: "28px" }}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Agency Brand Name</label>
                          <input type="text" className="form-control" value={settings.siteName || "TechWithJoshi"} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Phone Number</label>
                          <input type="text" className="form-control" value={settings.phone || "+91 7623897036"} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Primary Email</label>
                          <input type="email" className="form-control" value={settings.emailPrimary || "work@techwithjoshi.in"} onChange={(e) => setSettings({ ...settings, emailPrimary: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Secondary Email</label>
                          <input type="email" className="form-control" value={settings.emailSecondary || "dhaneshjoshi1234@gmail.com"} onChange={(e) => setSettings({ ...settings, emailSecondary: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Dahod Physical Office Address</label>
                          <input type="text" className="form-control" value={settings.address || "Shanoo Digital Photo Studio, Government Polytechnic, College Road, Dahod, Usarvan Part, Gujarat 389151"} onChange={(e) => setSettings({ ...settings, address: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Cal.com Link</label>
                          <input type="text" className="form-control" value={settings.calLink || "https://cal.com/dhanesh-joshi/30min"} onChange={(e) => setSettings({ ...settings, calLink: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>WhatsApp URL</label>
                          <input type="text" className="form-control" value={settings.whatsappLink || "https://wa.me/917623897036"} onChange={(e) => setSettings({ ...settings, whatsappLink: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                      </div>
                      <div style={{ marginTop: "24px" }}>
                        <button type="submit" disabled={saving} style={{ background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>
                          Save Global Settings
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 13. ADMIN PROFILE & AUTH */}
                {activeTab === "profile" && (
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#fff" }}>Admin Profile &amp; Security Credentials</h2>
                    <form onSubmit={updateProfile} style={{ background: "rgba(18, 12, 36, 0.7)", border: "1px solid rgba(121, 40, 202, 0.3)", borderRadius: "14px", padding: "28px" }}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Admin Name</label>
                          <input type="text" required className="form-control" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Admin Email</label>
                          <input type="email" required className="form-control" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-12" style={{ marginTop: "24px" }}>
                          <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#00dfd8", borderBottom: "1px solid rgba(121, 40, 202, 0.3)", paddingBottom: "8px" }}>
                            Change Admin Password (Optional)
                          </h4>
                        </div>
                        <div className="col-md-4">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Current Password</label>
                          <input type="password" placeholder="••••••••" className="form-control" value={profileForm.currentPassword} onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-4">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>New Password</label>
                          <input type="password" placeholder="••••••••" className="form-control" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                        <div className="col-md-4">
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>Confirm New Password</label>
                          <input type="password" placeholder="••••••••" className="form-control" value={profileForm.confirmPassword} onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })} style={{ background: "#0e081f", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }} />
                        </div>
                      </div>
                      <div style={{ marginTop: "24px" }}>
                        <button type="submit" disabled={saving} style={{ background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>
                          Save Profile &amp; Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Full CRUD Edit Modal for Testimonials, Projects, Blogs */}
        {editingItem && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "#0f0821",
                border: "1px solid rgba(0, 223, 216, 0.4)",
                borderRadius: "16px",
                padding: "28px",
                width: "100%",
                maxWidth: "850px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: 0, textTransform: "capitalize" }}>
                  Edit {editingItem.type === "caseStudy" ? "Enterprise Case Study" : editingItem.type}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <form onSubmit={handleUpdateItem}>
                {editingItem.type === "testimonial" && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Client Name</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={editingItem.data.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.designation || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, designation: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Company</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.company || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, company: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Rating</label>
                      <select
                        className="form-control"
                        value={editingItem.data.rating || 5}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, rating: parseInt(e.target.value) } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      >
                        <option value={5}>5 Stars ★★★★★</option>
                        <option value={4}>4 Stars ★★★★</option>
                        <option value={3}>3 Stars ★★★</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Review Quote</label>
                      <textarea
                        rows={3}
                        required
                        className="form-control"
                        value={editingItem.data.review || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, review: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                  </div>
                )}

                {editingItem.type === "service" && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Title</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={editingItem.data.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>URL Slug</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={editingItem.data.slug || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, slug: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.category || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Bootstrap Icon</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.icon || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, icon: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <ImageUploadInput
                        label="Service Cover Graphic"
                        value={editingItem.data.image}
                        onChange={(url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, image: url } })}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Summary Description</label>
                      <textarea
                        rows={2}
                        className="form-control"
                        value={editingItem.data.description || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Features (comma-separated or list)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={typeof editingItem.data.features === "string" ? editingItem.data.features : Array.isArray(editingItem.data.features) ? editingItem.data.features.join(", ") : ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, features: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <RichTextEditor
                        label="Full Service Scope & Architecture Details"
                        value={editingItem.data.content || editingItem.data.details || ""}
                        onChange={(html) => setEditingItem({ ...editingItem, data: { ...editingItem.data, content: html } })}
                      />
                    </div>
                  </div>
                )}

                {editingItem.type === "project" && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Title</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={editingItem.data.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.category || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Client</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.client || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, client: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Project Link</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.link || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, link: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <ImageUploadInput
                        label="Project Preview Screenshot"
                        value={editingItem.data.image}
                        onChange={(url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, image: url } })}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Executive Summary</label>
                      <textarea
                        rows={2}
                        className="form-control"
                        value={editingItem.data.description || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Deliverables</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.deliverables || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, deliverables: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <RichTextEditor
                        label="Project Architecture & Engineering Deep-Dive"
                        value={editingItem.data.content || ""}
                        onChange={(html) => setEditingItem({ ...editingItem, data: { ...editingItem.data, content: html } })}
                      />
                    </div>
                  </div>
                )}

                {editingItem.type === "caseStudy" && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Case Study Title</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={editingItem.data.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>URL Slug</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={editingItem.data.slug || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, slug: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.category || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Client / Organization</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.client || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, client: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <ImageUploadInput
                        label="Featured Case Study Hero Graphic"
                        value={editingItem.data.image}
                        onChange={(url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, image: url } })}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Video Embed URL (Optional YouTube or Vimeo)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.videoUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, videoUrl: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Challenge</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={editingItem.data.challenge || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, challenge: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Engineered Solution</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={editingItem.data.solution || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, solution: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Technology Stack Tags (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={typeof editingItem.data.tags === "string" ? editingItem.data.tags : Array.isArray(editingItem.data.tags) ? editingItem.data.tags.join(", ") : ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tags: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <RichTextEditor
                        label="Full Case Study Story & Architecture Breakdown"
                        value={editingItem.data.content || ""}
                        onChange={(html) => setEditingItem({ ...editingItem, data: { ...editingItem.data, content: html } })}
                      />
                    </div>
                  </div>
                )}

                {editingItem.type === "blog" && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Article Title</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={editingItem.data.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>URL Slug</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.slug || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, slug: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.category || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Author</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.author || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, author: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Read Time</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.readTime || "5 min read"}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, readTime: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <ImageUploadInput
                        label="Featured Article Banner Image"
                        value={editingItem.data.image || editingItem.data.img}
                        onChange={(url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, image: url, img: url } })}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Video Embed URL (Optional YouTube or Vimeo)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.videoUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, videoUrl: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Tags (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={typeof editingItem.data.tags === "string" ? editingItem.data.tags : Array.isArray(editingItem.data.tags) ? editingItem.data.tags.join(", ") : ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tags: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Short Excerpt</label>
                      <textarea
                        rows={2}
                        className="form-control"
                        value={editingItem.data.excerpt || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, excerpt: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <RichTextEditor
                        label="Full Blog Article Content (WYSIWYG / HTML)"
                        value={editingItem.data.content || editingItem.data.details || ""}
                        onChange={(html) => setEditingItem({ ...editingItem, data: { ...editingItem.data, content: html } })}
                      />
                    </div>
                  </div>
                )}

                {editingItem.type === "news" && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>News Title</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={editingItem.data.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.category || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Source Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.source || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, source: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Source / Reference URL</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingItem.data.url || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, url: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <ImageUploadInput
                        label="Featured News Graphic"
                        value={editingItem.data.image}
                        onChange={(url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, image: url } })}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Short Summary Excerpt</label>
                      <textarea
                        rows={2}
                        className="form-control"
                        value={editingItem.data.excerpt || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, excerpt: e.target.value } })}
                        style={{ background: "#160d2e", border: "1px solid rgba(121, 40, 202, 0.3)", color: "#fff" }}
                      />
                    </div>
                    <div className="col-12">
                      <RichTextEditor
                        label="Full News Announcement & Content"
                        value={editingItem.data.content || ""}
                        onChange={(html) => setEditingItem({ ...editingItem, data: { ...editingItem.data, content: html } })}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    style={{ background: "rgba(255, 255, 255, 0.08)", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "8px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ background: "linear-gradient(135deg, #7928ca 0%, #00dfd8 100%)", color: "#fff", border: "none", padding: "8px 22px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
                  >
                    {saving ? "Saving..." : "Save Changes to MongoDB"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI Conversation Transcript Modal */}
        {selectedSessionTranscript && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "680px",
                maxHeight: "85vh",
                background: "#0e081f",
                border: "1px solid rgba(121, 40, 202, 0.5)",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.8)",
              }}
            >
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(121, 40, 202, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>
                    AI Conversation Transcript
                  </h4>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Session: {selectedSessionTranscript.sessionId} • Score: {selectedSessionTranscript.leadScore || "COLD"}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSessionTranscript(null)}
                  style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {(selectedSessionTranscript.messages || []).map((m, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      background: m.role === "user" ? "linear-gradient(135deg, #7928ca 0%, #6610f2 100%)" : "rgba(255, 255, 255, 0.05)",
                      border: m.role === "user" ? "none" : "1px solid rgba(121, 40, 202, 0.3)",
                      color: "#fff",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "4px" }}>
                      {m.role === "user" ? "Visitor" : "TechWithJoshi AI"}
                    </div>
                    {m.content?.split(/(\*\*.*?\*\*)/g).map((p, pIdx) => {
                      if (p.startsWith("**") && p.endsWith("**")) {
                        return (
                          <strong key={pIdx} style={{ color: "#00dfd8", fontWeight: "700" }}>
                            {p.slice(2, -2)}
                          </strong>
                        );
                      }
                      return p;
                    })}
                  </div>
                ))}
              </div>

              <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(121, 40, 202, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {selectedSessionTranscript.leadData?.phone && (
                  <a
                    href={`https://wa.me/${selectedSessionTranscript.leadData.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi " + (selectedSessionTranscript.leadData.name || "") + ", this is Dhanesh from TechWithJoshi.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: "#25d366", color: "#fff", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", textDecoration: "none", fontWeight: "700" }}
                  >
                    <i className="fab fa-whatsapp me-1"></i> Open in WhatsApp
                  </a>
                )}
                <button
                  onClick={() => setSelectedSessionTranscript(null)}
                  style={{ background: "#7928ca", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginLeft: "auto" }}
                >
                  Close Transcript
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
