// Importation du CSS spécifique à ce composant
import "../styles/QuoteCard.css";

// Logo par défaut si aucun logo de startup n'est fourni
import logoVillageByCa from "../assets/logo_village_by_ca.png";

// Contexte d'authentification pour savoir si l'utilisateur est connecté
import { useAuth } from "../contexts/AuthContext";

import { useState } from "react";

const QuoteCard = ({
  id = null,
  logo = logoVillageByCa,   // Logo affiché, par défaut celui de Village by CA
  name = "Village by CA",   // Nom de la startup
  firstName = "Prénom",
  lastName = "Nom",
  description = "",
  canBeModified = false,    // Affiche le bouton "Modifier" uniquement si true
  onUpdate = null           // Callback pour mettre à jour la liste parente après modification
}) => {

  // auth = utilisateur connecté (ou null), loading = état de chargement de l'auth
  const { auth, loading } = useAuth();

  // Bascule entre le mode lecture et le mode édition
  const [isEditing, setIsEditing] = useState(false);

  // Données du formulaire, initialisées avec les props reçues
  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    description: description || ""
  });

  // Gestion du retour d'API : "success" | "error" | null
  const [responseType, setResponseType] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  // Met à jour dynamiquement le champ correspondant dans formData
  // grâce à [e.target.name]
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
      let response = '';
      // Envoi d'une requête PATCH pour modifier uniquement les champs modifiés
      if(!loading && auth && auth.isAdmin) {
          response = await fetch(`http://localhost:3000/admin/citations/${id}`, {
          method: 'PATCH',
          credentials: "include",  // Envoie les cookies de session pour l'authentification
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
          response = await fetch(`http://localhost:3000/auth/profil/citations/${id}`, {
          method: 'PATCH',
          credentials: "include",  // Envoie les cookies de session pour l'authentification
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const data = await response.json();

      // Si le serveur retourne une erreur HTTP (4xx, 5xx)
      if (!response.ok) {
        setResponseType("error");
        setResponseMessage(data.message || "Une erreur est survenue.");
        return; // On arrête ici sans fermer le formulaire
      }

      // On modifie l'état local sans re-fetcher toute la liste.
      // onUpdate accepte deux formes selon le parent :
      //   - un tableau (ex: page AdminQuotes)
      //   - un objet avec une clé "quotes" (ex: page profil utilisateur)
      onUpdate(prev => {
        if (Array.isArray(prev)) {
          // Cas tableau : on remplace la citation modifiée par ses nouvelles valeurs
          return prev.map(quote => quote.id === id ? { ...quote, ...formData } : quote);
        }
        // Cas objet : on met à jour uniquement le tableau quotes imbriqué
        return {
          ...prev,
          quotes: prev.quotes.map(quote => quote.id === id ? { ...quote, ...formData } : quote)
        };
      });

      setResponseType("success");
      setResponseMessage(data.message || "La citation a été mise à jour !");

    } catch (error) {
      // Erreur réseau ou autre exception inattendue
      console.error(error);
      setResponseType("error");
      setResponseMessage("Une erreur est survenue.");
    }

    // Repasse en mode lecture dans tous les cas (succès ou erreur)
    setIsEditing(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      let response = '';
      // Envoi d'une requête DELETE pour supprimer la citation
      if(!loading && auth && auth.isAdmin) {
          response = await fetch(`http://localhost:3000/admin/citations/${id}`, {
          method: 'DELETE',
          credentials: "include",  // Envoie les cookies de session pour l'authentification
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
          response = await fetch(`http://localhost:3000/auth/profil/citations/${id}`, {
          method: 'DELETE',
          credentials: "include",  // Envoie les cookies de session pour l'authentification
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const data = await response.json();

      // Si le serveur retourne une erreur HTTP (4xx, 5xx)
      if (!response.ok) {
        setResponseType("error");
        setResponseMessage(data.message || "Une erreur est survenue.");
        return; // On arrête ici sans fermer le formulaire
      }

      // On retire la citation supprimée de la liste parente
      onUpdate(prev => {
          if (Array.isArray(prev)) {
              return prev.filter(quote => quote.id !== id);
          }
          return {
              ...prev,
              quotes: prev.quotes.filter(quote => quote.id !== id)
          };
      });

      setResponseType("success");
      setResponseMessage(data.message || "La citation a bien été supprimé");

    } catch (error) {
      // Erreur réseau ou autre exception inattendue
      console.error(error);
      setResponseType("error");
      setResponseMessage("Une erreur est survenue.");
    }

    // Repasse en mode lecture dans tous les cas (succès ou erreur)
    setIsEditing(false);
  
  }


  return (
    <div className="quote-component">

      {/* MODE LECTURE : affiché quand isEditing est false */}
      {!isEditing && (
        <div className="quote-card">
          <div>
            <div className="quote-header">
              <div className="quote-logo">
                <img src={logo} alt={name} />
              </div>
              <div className="quote-person">
                <p className="quote-name">{firstName} {lastName}</p>
                <p className="quote-startup">{name}</p>
              </div>
            </div>

            <p className="quote-description">{description}</p>

            {/* Le bouton "Modifier" n'est visible que si :
                - canBeModified est true (prop passée par le parent)
                - l'auth n'est pas en cours de chargement
                - l'utilisateur est bien authentifié */}
            {canBeModified && !loading && (
              auth
                ? <button onClick={() => setIsEditing(true)}>Modifier</button>
                : null
            )}
          </div>

          {/* Message de retour après une tentative de modification */}
          {responseMessage && (
            <p className={`response-message ${responseType}`}>
              {responseMessage}
            </p>
          )}
        </div>
      )}

      {/* MODE ÉDITION : affiché quand isEditing est true */}
      {isEditing && (
        <div className="quote-card-form">
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
            <button onClick={handleDelete}>Supprimer</button>
            {/* Annuler ne soumet pas le formulaire et repasse en mode lecture */}
            <button type="button" onClick={() => setIsEditing(false)}>
              Annuler
            </button>

          </form>
        </div>
      )}

    </div>
  );
};

export default QuoteCard;