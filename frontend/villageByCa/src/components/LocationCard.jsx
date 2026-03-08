import "../styles/LocationCard.css";
import heroImage from "../assets/HeroImage.png";
import { Link } from 'react-router-dom';

export default function LocationCard({ title="Salle", price=0.00, size=0, picture=[heroImage], id="" }) {
  return (
    <Link to={`http://localhost:5173/locations/${id}`} className="location-card__link">
        <div className="location-card">
            <img
                src={picture}
                alt={title}
                className="location-card__image"
            />

        <div className="location-card__content">
            <h3 className="location-card__title">{title}</h3>

            <p className="location-card__price">Prix: {price} €</p>

            <p className="location-card__space">Espace: {size} M²</p>
        </div>
        </div>
    </Link>
  );
}
