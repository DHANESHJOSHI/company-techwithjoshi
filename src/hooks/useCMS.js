import { useState, useEffect } from "react";

export function useCMS(sectionKey) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCMS() {
      try {
        const url = sectionKey ? `/api/cms?section=${sectionKey}` : `/api/cms`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setData(json);
          }
        }
      } catch (err) {
        console.error(`Error loading CMS section '${sectionKey}':`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCMS();
    return () => {
      isMounted = false;
    };
  }, [sectionKey]);

  return { data, loading };
}
