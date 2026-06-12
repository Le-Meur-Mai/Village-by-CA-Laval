import { useState } from "react";
import "../styles/PicturesLocation.css";

export default function ImageCarousel({ pictures }) {
  const [index, setIndex] = useState(0);

  //  utilise la valeur la plus récente de index, et que l'on appelle i.
  // Gère les updates rapprochées pour ne pas prendre un index périmé.
  const prev = () => {
    setIndex((i) => (i === 0 ? pictures.length - 1 : i - 1));
  };

  const next = () => {
    setIndex((i) => (i === pictures.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="carousel-location">
      <button className="arrow left" onClick={prev}>❮</button>

      <img
        src={pictures[index].secureUrl.replace('/upload/', '/upload/w_600,dpr_auto,f_auto,q_auto/')}
        alt={`photo-${index}`}
        className="carousel-location-image"
      />

      <button className="arrow right" onClick={next}>❯</button>
    </div>
  );
}
