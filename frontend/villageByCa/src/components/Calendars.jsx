import React from "react";
// Importation du calendrier
import FullCalendar from "@fullcalendar/react";
// Importation du plugin pour afficher le calendrier en grille
import dayGridPlugin from "@fullcalendar/daygrid";
// Importation du plugin pour rendre les cases de chaque jour clickables
import interactionPlugin from "@fullcalendar/interaction";
// Importation du plugin pour que Full Calendar soit en français
import frLocale from "@fullcalendar/core/locales/fr";
// On import le composant Pop-up d'évènement
import EventPopUp from "./EventPopUp.jsx";
import EventFormPopUp from "./EventFormPopUp.jsx";
import "../styles/Calendars.css"
import { useState } from "react";

export default function ThreeCalendars({ events, admin = false }) {

  // On passe en mode édition
  const [editingEvent, setEditingEvent] = useState(null);

  // On passe toutes les infos de l'évenement qui est sélectionné
  const [selectedEvent, setSelectedEvent] = useState(null);

  // On change le calendrier en fonction du mois sélectionné
  const [activeMonth, setActiveMonth] = useState(0);

  // Fonction pour récupérer la date de début du calendrier en format Date
  const getMonthDate = (offset) => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + offset, 1);
  };

  // Fonction pour récupérer les mois actuels en string
  const getMonthLabel = (offset) => {
  const date = getMonthDate(offset);
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
};


  // Full calendar passe un objet info qui a plus que les propriétés de l'objet event de base
  const handleEventClick = async (info) => {
    try {
      const id = info.event.id;
  
      const res = await fetch(`http://localhost:3000/agenda/event/${id}`);
      const event = await res.json();
  
      setSelectedEvent(event);
    } catch (error) {
      console.log(error);
    }
  };

  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    locales: [frLocale],
    locale: "fr",
    firstDay: 1,
    headerToolbar: {
      left: "",
      center: "title",
      right: ""
    },
    events,
    displayEventTime:false, // ← retire l’heure
    eventInteractive: false, // Rend les events en <div> au lieu de <a>
    /* FullCalendar met par défaut des <a></a> pour les éléments du calendrier
    sauf que l'on a pas de vrais liens qui mènent vers d'autres pages et le SEO
    du navigateur n'aime pas ça. Info c'est un objet que renvoie fullCalendar
    quand un évènement est cliqué ou rendu avec bcp d'infos.*/
    // On empêche de reload toute la page quand on clique sur un évènement car on ne change pas de page
    eventClick: (info) => {
      info.jsEvent.preventDefault();
      handleEventClick(info);
    },
    // On garde les évènements clickables en enlevant href, car ça ne mène pas vers une autre page
    // eventDidMount fonction de callback qui permet de modifier l'élément rendu par fullCalendar
    eventDidMount: (info) => {
      // Garde le curseur cliquable
      info.el.style.cursor = "pointer";
  },
    height: "auto",
  };

  return (
    <>
        <div className="calendar-buttons">
            {[0, 1, 2].map((offset) => (
            <button
                key={offset}
                onClick={() => setActiveMonth(offset)}
                className={`month-btn ${activeMonth === offset ? "active" : ""}`}
            >
                {getMonthLabel(offset)}
            </button>
            ))}
        </div>
        {/* Bouton créer (admin uniquement) */}
        {admin && (
          <button className="create-btn" 
          onClick={() => setEditingEvent({ id: null, title: "", date: "", description: "", color: "#000000" })}
          >
            + Créer un événement
          </button>
        )}
        <div className="calendar-container">
        {/* On met key pour forcer REACT à rerender le composant de fullCalendar, pour pouvoir changer de mois */}
        <FullCalendar key={activeMonth} {...calendarOptions} initialDate={getMonthDate(activeMonth)} />
        </div>

        {/* Pop-up */}
        <EventPopUp
          event={selectedEvent}
          admin={admin}
          onClose={() => setSelectedEvent(null)}
          setEditingEvent={setEditingEvent}
        />



        {/* Pop-up formulaire admin */}
        {admin && editingEvent && (
          <EventFormPopUp
            key={editingEvent?.id || "new"}
            event={editingEvent}
            onClose={() => setEditingEvent(null)}
          />
        )}
    </>
  );
}
