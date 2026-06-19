import React, { useState, useEffect } from "react";
import "../styles/EventPopUp.css";

export default function EventFormPopUp({ event, onClose }) {

  // Fonction pour afficher seulement l'année, le mois et le jour
  const toInputDate = (val) => {
    if (!val) return "";
    return val.slice(0, 10); // "2025-06-10T00:00:00.000Z" → "2025-06-10"
  };

  const isEditing = Boolean(event?.id); // true = mise à jour, false = création

  const [errorMessage, setErrorMessage] = useState("");


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
        const err = await res.json();
        setErrorMessage(err);
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

        <label htmlFor="title">Titre</label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="color">Couleur</label>
        <input
          id="color"
          name="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        {errorMessage && (
          <p className="event-pop-up-error">{errorMessage?.message}</p>
        )}

        <button className="event-pop-up-submit" onClick={handleSubmit}>
          {isEditing ? "Enregistrer" : "Créer"}
        </button>
      </div>
    </div>
  );
}
