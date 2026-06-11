import React from "react";
import "../styles/EventPopUp.css";

export default function EventPopUp ({ event, onClose, admin=false, setEditingEvent }) {
  // Mettre la date au format jj/mm/aaaa
  if (!event) return null;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR");
  };

  // SUPPRESSION
  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3000/admin/evenements/${event.id}`, {
        method: "DELETE",
        credentials: "include"
      });

      onClose(); 
      window.location.reload();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  // PASSAGE EN MODE ÉDITION (déclenché ici)
  const handleEdit = () => {
    setEditingEvent(event); // on dit au parent : “ouvre le formulaire avec cet event”
    onClose();
  };



  return (
    <div className="event-pop-up-overlay" onClick={onClose}>
      {/* Croix */}
      <button className="event-pop-up-close" onClick={onClose}>✕</button>

      <div className="event-pop-up-box" style={{ border: `3px solid ${event.color}` }} onClick={(e) => e.stopPropagation()}>
        
        {/* Couleur */}
        <div
          className="event-pop-up-color"
          style={{ backgroundColor: event.color }}
        ></div>

        {/* Titre */}
        <h2 className="event-pop-up-title">{event.title}</h2>

        {/* Date */}
        <p className="event-pop-up-date">{formatDate(event.date)}</p>

        {/* Description */}
        <p className="event-pop-up-description">{event.description}</p>

        {/*Boutons admin*/}
        {admin && (
          <div className="event-pop-up-admin-buttons">
            <button className="event-pop-up-edit" onClick={handleEdit}>
              Modifier
            </button>

            <button className="event-pop-up-delete" onClick={handleDelete}>
              Supprimer
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
