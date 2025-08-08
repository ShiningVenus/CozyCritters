import { useEffect } from "react";

export function useServiceWorker() {
  useEffect(() => {
 bekn8k-codex/refactor-app-for-modular-design
    if ("serviceWorker" in navigator) {
      const onLoad = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("🐾 SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("🐾 SW registration failed: ", registrationError);
          });
      };

      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
=======
    if (!("serviceWorker" in navigator)) return;
    if (!import.meta.env.PROD) return;

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("🐾 SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.error("🐾 SW registration failed: ", registrationError);
        });
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
 main
  }, []);
}
