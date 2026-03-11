import { useState } from 'react';
import '../../styles/Button.css'
import "../../styles/QuoteCard.css";

const NewQuoteButton = ({onUpdate = null}) => {

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        description: '',
        userId: ''
    })

    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handleSumbit = async (e) => {
    // Empêche le rechargement de la page à la soumission du formulaire
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/auth/profil/`, {
        method: 'POST',
        credentials: "include",  // Envoie les cookies de session pour l'authentification
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // Si le serveur retourne une erreur HTTP (4xx, 5xx)
      if (!response.ok) {
        setResponseType("error");
        setResponseMessage(data.message || "Une erreur est survenue.");
        return; // On arrête ici sans fermer le formulaire
      }

      const newQuote = data.quote;

      onUpdate(prev => {
        if (Array.isArray(prev)) {
          // Cas tableau : on remplace la citation modifiée par ses nouvelles valeurs
          return [...prev, newQuote];
        }
        // Cas objet : on met à jour uniquement le tableau quotes imbriqué
        return {
          ...prev,
          quotes: [...prev.quotes, newQuote]
        };
      });

      setResponseType("success");
      setResponseMessage(data.message || "La citation a été créé !");
      setFormData({ firstName: '', lastName: '', description: '', userId: '' });

    } catch (error) {
      // Erreur réseau ou autre exception inattendue
      console.error(error);
      setResponseType("error");
      setResponseMessage("Une erreur est survenue.");
    }

    setIsEditing(false);
}

    return (
        <div>
            {!isEditing && (
                <div>
                    <button onClick={() => setIsEditing(true)} className="button">Écrire une citation</button>
                </div>
            )}

            {/* MODE ÉDITION : affiché quand isEditing est true */}
            {isEditing && (
                <div className="quote-component">
                <form onSubmit={handleSumbit} className="quote-edit-form">

                    <label>
                    Prénom :
                    <input
                        type="text"
                        name="firstName"         // Correspond à la clé dans formData
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
                )
            }
            {responseMessage && (
                <p className={`response-message ${responseType}`}>
                    {responseMessage}
                </p>
            )}
        </div>
    )
}

export default NewQuoteButton;