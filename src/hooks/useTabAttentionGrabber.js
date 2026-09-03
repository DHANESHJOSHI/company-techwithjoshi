import { useEffect, useRef } from "react";

const ATTENTION_TITLES = [
  "⚡ Don't Leave! Let's Build Your Project 🚀",
  "👋 Still Here? Dhanesh & Team Are Waiting!",
  "💡 Free Architecture & AI Consultation Inside!",
  "💬 (1) New Message from TechWithJoshi AI Specialist",
  "🔥 We Miss You! Come Back to TechWithJoshi 👋",
];

export default function useTabAttentionGrabber() {
  const originalTitleRef = useRef("");
  const intervalRef = useRef(null);
  const welcomeTimeoutRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    originalTitleRef.current = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away to another tab
        if (welcomeTimeoutRef.current) clearTimeout(welcomeTimeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Record title if not already one of the attention messages
        if (!ATTENTION_TITLES.includes(document.title) && !document.title.includes("Welcome Back")) {
          originalTitleRef.current = document.title;
        }

        let titleIndex = 0;
        document.title = ATTENTION_TITLES[0];

        intervalRef.current = setInterval(() => {
          titleIndex = (titleIndex + 1) % ATTENTION_TITLES.length;
          document.title = ATTENTION_TITLES[titleIndex];
        }, 1600);
      } else {
        // User switched back to this tab!
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Show a brief welcoming confirmation before restoring original
        document.title = "✨ Welcome Back! | TechWithJoshi";

        welcomeTimeoutRef.current = setTimeout(() => {
          document.title =
            originalTitleRef.current ||
            "TechWithJoshi - Enterprise Software Agency, AI & Cloud Solutions";
        }, 1800);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (welcomeTimeoutRef.current) clearTimeout(welcomeTimeoutRef.current);
    };
  }, []);
}
