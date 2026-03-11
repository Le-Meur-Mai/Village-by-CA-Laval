import "../styles/QuoteCard.css";
import logoVillageByCa from "../assets/logo_village_by_ca.png";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const QuoteCard = ({
  id = null,
  logo = logoVillageByCa, 
  name = "Village by CA", 
  firstName = "Prénom", 
  lastName = "Nom", 
  description = "", 
  canBeModified = false,
  onUpdate = null}) => {

  const {auth, loading} = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      firstName: firstName || "",
      lastName: lastName || "",
      description: description || ""
  });

  const [responseType, setResponseType] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSumbit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(`http://localhost:3000/auth/profil/citations/${id}`, {
        method: 'PATCH',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if(!response.ok) {
        setResponseType("error");
        setResponseMessage(data.message || "Une erreur est survenue.");
        return;
      }

      onUpdate(prev => ({
        ...prev,
        quotes: prev.quotes.map(quote => {
          return quote.id === id ? {...quote, ...formData} : quote
        })
      }));

      setResponseType("success");
      setResponseMessage(data.message || "La citation a été mise à jour !");

    } catch (error) {
      console.error(error);
      setResponseType("error");
      setResponseMessage(data.message || "Une erreur est survenue.");
    }

    setIsEditing(false);

  }


  return (
    <div className="quote-component">
      {!isEditing && (
        <div className="quote-card">
          <div>
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
    
            {canBeModified &&
              !loading && (
                auth
                  ? <button onClick={() => setIsEditing(true)}>Modifier</button>
                  : null
            )}
          </div>
          {responseMessage && (
            <p className={`response-message ${responseType}`}>
                {responseMessage}
            </p>
        )}
        </div>
      )}
  
        {isEditing && (
          <div className="quote-card-form">
              <form onSubmit={handleSumbit} className="quote-edit-form">
                <label>
                  Prénom : 
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </label>
  
                <label>
                  Nom : 
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </label>
  
                <label>
                  Citation : 
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                  />
                </label>
  
                <button type="submit">Enregistrer</button>
                {/* Annuler ne soumet pas le formulaire et repasse en mode lecture */}
                <button type="button" onClick={() => setIsEditing(false)}>
                    Annuler
                </button>
              </form>
  
          </div>
        )}
    </div>
  );
}

export default QuoteCard;
