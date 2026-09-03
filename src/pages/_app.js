import { useEffect, useState } from "react";
import useMagneticHover from "@/hooks/useMagneticHover";
import useTabAttentionGrabber from "@/hooks/useTabAttentionGrabber";
import Script from "next/script";

import "../../public/assets/css/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../public/assets/css/bootstrap.min.css";
import "../../public/assets/css/boxicons.min.css";
import "../../public/assets/css/swiper-bundle.min.css";
import "../../public/assets/css/preloader.css";
import "../../public/assets/css/animate.min.css";
import "../../public/assets/css/style2.css";
import "@/styles/theme-custom.css";
import "node_modules/react-modal-video/css/modal-video.css";
import Preloader from "@/components/common/Preloader";
import FloatingWidgets from "@/components/common/FloatingWidgets";

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("twj_has_preloaded")) {
        setLoading(true);
        return;
      }
    } catch (e) {}

    const timer = setTimeout(() => {
      setLoading(true);
      try {
        sessionStorage.setItem("twj_has_preloaded", "true");
      } catch (e) {}
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  useMagneticHover();
  useTabAttentionGrabber();
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  return (
    <>
      {loading ? (
        <>
          <Component {...pageProps} />
          <FloatingWidgets />
          <Script id="wow" src="/js/wow.min.js" strategy="afterInteractive"></Script>
          <Script
            id="initWow"
            strategy="lazyOnload"
          >{`if (typeof WOW !== 'undefined') { try { new WOW().init(); } catch (e) {} }`}</Script>
        </>
      ) : (
        <Preloader />
      )}
    </>
  );
}
