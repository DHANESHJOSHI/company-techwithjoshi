import { useState, useEffect } from "react";

const DEFAULT_SETTINGS = {
  siteName: "TechWithJoshi",
  phone: "+91 7623897036",
  whatsappLink: "https://wa.me/917623897036",
  emailPrimary: "work@techwithjoshi.in",
  emailSecondary: "dhaneshjoshi1234@gmail.com",
  address: "Shanoo Digital Photo Studio, Government Polytechnic, College Road, Dahod, Usarvan Part, Gujarat 389151",
  linkedin: "https://www.linkedin.com/in/dhanesh-joshi/",
  instagram: "https://www.instagram.com/its_dhanesh_joshi_/",
  calLink: "https://cal.com/dhanesh-joshi/30min",
  copyright: "© 2026 TechWithJoshi. All Rights Reserved.",
  siteTagline: "Engineering Next-Gen AI & Enterprise Software Systems"
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && typeof data === "object") {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error("Error loading site settings:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading };
}
