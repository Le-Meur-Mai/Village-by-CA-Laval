import { useState, useEffect } from "react";
import "../styles/StartupCarrousel.css";

export default function StartupCarrousel({ startups }) {
  // État qui indique si on est sur mobile (largeur <= 600px)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  // Met à jour isMobile si l'utilisateur redimensionne la fenêtre
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    // Quand le composant disparaît de la page, on arrête d'écouter le resize
    // pour éviter des mises à jour sur un composant qui n'existe plus
    return () => window.removeEventListener("resize", handleResize);
  }, []); // [] = s'exécute une seule fois au montage

  // Évite une division par zéro si startups est vide ou pas encore chargé
  if (!startups.length) return null;

  // Dimensions adaptées selon le device (doivent correspondre exactement au CSS)
  const gap = isMobile ? 24 : 48;        // 1.5rem sur mobile, 3rem sur desktop
  const logoWidth = isMobile ? 100 : 150; // taille des logos en px

  // Largeur d'un set complet de logos
  // Ex: 3 logos × (150px + 48px) = 594px
  const setWidth = startups.length * (logoWidth + gap);

  // Math.ceil arrondit toujours à l'entier supérieur
  // Ex: Math.ceil(2.1) = 3, Math.ceil(2.9) = 3
  // On s'en sert pour être sûr d'avoir assez de logos pour couvrir l'écran,
  // même si la division ne tombe pas juste. Le +1 ajoute une marge de sécurité.
  const windowWidth = window.innerWidth;
  const repeatCount = Math.ceil((windowWidth * 2) / setWidth) + 1;

  // Crée un tableau plat de logos répétés, avec des clés uniques pour React
  // Ex: repeatCount=4, startups=[A,B,C] → [0-A, 0-B, 0-C, 1-A, 1-B, 1-C, ...]
  const repeated = Array.from({ length: repeatCount }, (_, i) =>
    startups.map((startup) => ({ ...startup, _key: `${i}-${startup.id}` }))
  ).flat();

  return (
    <div className="carousel-window">
      {/*
        --set-width est une variable CSS personnalisée (custom property).
        On la définit ici en JS car sa valeur dépend du nombre de logos,
        qu'on ne connaît qu'au runtime.
        Elle est ensuite lue dans le CSS comme ceci :
          transform: translateX(calc(-1 * var(--set-width)))
        Ce qui donne par exemple : translateX(-594px)
        L'animation défile exactement d'un set, puis repart de zéro
        sans saut visible car la position finale = position initiale visuellement.
      */}
      <div
        className="carousel-track"
        style={{ "--set-width": `${setWidth}px` }}
      >
        {repeated.map((startup) => (
          <img
            key={startup._key}
            src={startup.logo.replace(
              "/upload/",
              // Transforme l'URL Cloudinary pour optimiser : largeur 150px,
              // résolution adaptée à l'écran (dpr_auto), format et qualité auto
              "/upload/w_150,dpr_auto,f_auto,q_auto/"
            )}
            alt="logo start-up"
            className="carousel-logo"
          />
        ))}
      </div>
    </div>
  );
}