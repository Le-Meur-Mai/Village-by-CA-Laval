import React, { useState, useEffect } from "react";
import "../styles/EventPopUp.css";

export default function EventFormPopUp({ event, onClose }) {

    // Fonction utilitaire à mettre en haut du composant
    const toInputDate = (val) => {
    if (!val) return "";
    return val.slice(0, 10); // "2025-06-10T00:00:00.000Z" → "2025-06-10"
    };

  const isEditing = Boolean(event?.id); // true = mise à jour, false = création

  const [title, setTitle] = useState(event.title || "");
  const [date, setDate] = useState(toInputDate(event?.date || ""));
  const [description, setDescription] = useState(event.description || "");
  const [color, setColor] = useState(event.color || "#000000");

  // Si l'événement change (ex : on clique sur un autre), on met à jour les champs
  useEffect(() => {
    setTitle(event.title || "");
    setDate(toInputDate(event.date || ""));
    setDescription(event.description || "");
    setColor(event.color || "#000000");
  }, [event]);

  const handleSubmit = async () => {
    try {
      const url = isEditing
        ? `http://localhost:3000/admin/evenements/${event.id}`
        : `http://localhost:3000/admin/evenements`;

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          description,
          color
        })
      });

      if (!res.ok) {
      const err = await res.text();
        console.error("Erreur serveur :", res.status, err);
        return; // ← on ne ferme pas la popup si ça a échoué
        }

      onClose();
      window.location.reload();

    } catch (error) {
      console.error("Erreur création/mise à jour :", error);
    }
  };

  if (event === null) return null; // null = fermé

  return (
    <div className="event-pop-up-overlay" onClick={onClose}>
      
      <button className="event-pop-up-close" onClick={onClose}>✕</button>

      <div className="event-pop-up-box" onClick={(e) => e.stopPropagation()}>
        
        <h2 className="event-pop-up-title">
          {isEditing ? "Modifier l’événement" : "Créer un événement"}
        </h2>

        <label>Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Couleur</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <button className="event-pop-up-submit" onClick={handleSubmit}>
          {isEditing ? "Enregistrer" : "Créer"}
        </button>
      </div>
    </div>
  );
}
