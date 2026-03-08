import "../styles/LocationInfo.css";
import Button from "./buttons/button";

/* span conteneur pour une ligne au lieu de div */
export default function LocationInfo({price=0.0, size=0, description="La salle n'existe pas ou n'a pas été trouvée" }) {
    return (
        <div className="location-info">
            <div className="location-meta">
                <p className="price">Prix : {price} €</p>
                <p className="size">Taille : {size} m²</p>
            </div>
            <div className="horizontal-line-location-details"></div>
            <p className="description">{description}</p>
            <Button
            text="Je réserve !"
            path="http://localhost:5173/contact"/>
        </div>
  );
}
