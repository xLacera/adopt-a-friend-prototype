import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Sube al inicio en cada cambio de ruta. Si la URL incluye un hash (#seccion),
// respeta ese ancla en lugar de forzar el top.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
