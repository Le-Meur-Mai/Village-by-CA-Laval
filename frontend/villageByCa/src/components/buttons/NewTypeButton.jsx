import { useState } from 'react';

import '../../styles/Button.css'
import "../../styles/QuoteCard.css";

const NewTypeButton = ({onUpdate = null}) => {
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        color: '#000000'
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
        e.preventDefault();

        try {
            // Utilise la route API correspondante
            const response = await fetch(`http://localhost:3000/admin/types`, {
                method: 'POST',
                credentials: "include",  // Envoie les cookies de session pour l'authentification
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setResponseType("error");
                setResponseMessage(data.message || "Une erreur est survenue.");
                return; // On arrête ici sans fermer le formulaire
            }

            onUpdate(prev => [...prev, data.type]);

            setResponseType("success");
            setResponseMessage(data.message || "Le nouveau type a été créé !");
            setFormData({ name: '', color: '#000000'});


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
                    <button onClick={() => setIsEditing(true)} className="button">Ajouter un Type</button>
                </div>
            )}

            {/* MODE ÉDITION : affiché quand isEditing est true */}
            {isEditing && (
                <div className="quote-component">
                    <form onSubmit={handleSumbit} className="quote-edit-form">

                        <label>
                        Nom :
                        <input
                            type="text"
                            name="name"         // Correspond à la clé dans formData
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        </label>

                        <label>
                            Couleur :
                            {/* 
                                Conteneur relatif : sert de "ancre" pour positionner 
                                l'input en absolu par-dessus le carré coloré.
                                La taille fixe (32x32) délimite la zone cliquable.
                            */}
                            <div style={{ position: 'relative', display: 'inline-block', width: '32px', height: '32px' }}>
                                
                                {/* 
                                    Le carré visible : c'est juste un div décoratif.
                                    Sa backgroundColor reflète formData.color en temps réel.
                                    Il ne fait rien tout seul, c'est l'input en dessous qui gère le clic.
                                */}
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '4px',
                                    backgroundColor: formData.color, // se met à jour à chaque changement
                                    border: '1px solid #ccc',
                                }} />

                                {/* 
                                    L'input color invisible : superposé exactement sur le carré (top:0, left:0, 100%x100%).
                                    opacity:0 le rend transparent mais il reste cliquable.
                                    Quand on clique sur la zone, c'est lui qui reçoit le clic → ouvre le color picker natif.
                                    onChange met à jour formData.color → le carré au-dessus change de couleur.
                                */}
                                <input
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        position: 'absolute', // sort du flux normal pour se superposer
                                        top: 0, left: 0,      // aligné exactement sur le carré
                                        width: '100%', height: '100%', // couvre toute la zone du conteneur
                                        opacity: 0,           // invisible mais interactif
                                        cursor: 'pointer',    // indique que c'est cliquable
                                    }}
                                />
                            </div>
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

export default NewTypeButton;