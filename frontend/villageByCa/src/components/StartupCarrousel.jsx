import { useState, useEffect } from "react";
import "../styles/StartupCarrousel.css";

export default function StartupCarrousel({ startups }) {
  // Si la liste est vide, on n'affiche rien
  if (!startups.length) return null;

  // Largeur d’un logo, version mobile gérée par le CSS
  const logoWidth = 150;

  // Espace horizontal entre deux logos (desktop)
  const gap = 48;

  // Largeur totale d’un "set" complet de logos
  // Exemple : 5 logos → 5 × (150 + 48)
  const setWidth = startups.length * (logoWidth + gap);

  // Nombre de répétitions nécessaires pour remplir l’écran
  // On double la largeur de l’écran pour être sûr que l’animation soit fluide
  // +1 pour éviter tout vide à la fin
  const repeatCount = Math.ceil((window.innerWidth * 2) / setWidth) + 1;

  // On crée un tableau contenant les logos répétés plusieurs fois
  // Chaque logo reçoit une clé unique pour React
  const repeated = Array.from({ length: repeatCount }, (_, i) =>
    startups.map((startup) => ({ ...startup, _key: `${i}-${startup.id}` }))
  ).flat();

  return (
    <div className="carousel-window">
      {/* 
        On passe la largeur d’un set au CSS via une variable.
        L’animation utilise cette valeur pour savoir de combien
        elle doit faire défiler les logos avant de recommencer.
      */}
      <div className="carousel-track" style={{ "--set-width": `${setWidth}px` }}>
        {repeated.map((startup) => (
          <img
            key={startup._key}
            src={startup.logo.replace(
              "/upload/",
              // Optimisation Cloudinary : largeur fixe, qualité auto, format auto
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
