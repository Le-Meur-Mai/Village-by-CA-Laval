import "../styles/QuoteCard.css";
import logoVillageByCa from "../assets/logo_village_by_ca.png";

export default function QuoteCard({logo= logoVillageByCa, name="Village by CA", firstName="Prénom", lastName="Nom", description=""}) {
  return (
    <div className="quote-card">
      <div className="quote-header">
        <div className="quote-logo">
          <img src={logo} alt={name} />
        </div>

        <div className="quote-person">
          <p className="quote-name">
            {firstName} {lastName}
          </p>
          <p className="quote-startup">{name}</p>
        </div>
      </div>

      <p className="quote-description">{description}</p>
    </div>
  );
}
