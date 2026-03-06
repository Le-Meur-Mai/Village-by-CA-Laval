import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// useLocation donne accès à l’objet location de React Router, qui contient notamment pathname (l’URL actuelle)

export default function ScrollToTop() {
  const { pathname } = useLocation();

  // A chaque fois que le path change, l'effet pour remonter en haut de la fenêtre se déclenche
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
