import { isValidElement, useState } from 'react';
import '../styles/Tag.css';

const Tag = ({id=null, name = "Tag", color = "CCF2B1", active=true, onClick, canBeDeleted = false, onUpdate=null }) => {

    const [isEditing, setIsEditing] = useState(false);

    // Données du formulaire, initialisées avec les props reçues
    const [formData, setFormData] = useState({
        id: id || "",
        name: name || "",
        color: color || ""
    });

    // Gestion du retour d'API : "success" | "error" | null
    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handleSumbit = async (e) => {
        e.preventDefault()

        try {
            // Enlève le # devant le code hexadecimal
            const payload = {
                ...formData,
                color: formData.color.replace('#', '') // retire le #
            };
            const response = await fetch(`http://localhost:3000/admin/types/${id}`, {
                method: 'PATCH',
                credentials: 'include', // Envoie les cookies de session pour l'authentification
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            // Si le serveur retourne une erreur HTTP (4xx, 5xx)
            if (!response.ok) {
                setResponseType("error");
                setResponseMessage(data.message || "Une erreur est survenue.");
                return; // On arrête ici sans fermer le formulaire
            }

            onUpdate(prev => 
                prev.map(type => type.id === id ? { ...type, ...payload } : type)
            );

            setResponseType("success");
            setResponseMessage(data.message || "Le type a été mis à jour !");

        } catch (error) {
            console.log(error);
        }

        setIsEditing(false);
    }

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/admin/types/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            // Si le serveur retourne une erreur HTTP (4xx, 5xx)
            if (!response.ok) {
                return; // On arrête ici sans fermer le formulaire
            }
            onUpdate(prev => 
                prev.filter(type => type.id !== id)
            );
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={isEditing ? "full-tag" : ""}>
            <div className='tag'>
                <button
                    onClick={canBeDeleted ? () => setIsEditing(!isEditing) : onClick}
                    className={active ? "tag-active" : "tag-inactive"}
                    style={{ backgroundColor: `#${color}` }}
                >
                    {name}
                </button>
                {isEditing && (
                    <div className="quote-component">
                        <form onSubmit={handleSumbit} className="quote-edit-form">

                            <label>
                            Nom :
                            <input
                                type="text"
                                name="name"  // Correspond à la clé dans formData
                                autoComplete="name"
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
                                    autoComplete="off"
                                    value={ formData.color }
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
                            <button onClick={handleDelete}>Supprimer</button>
                            {/* Annuler ne soumet pas le formulaire et repasse en mode lecture */}
                            <button type="button" onClick={() => setIsEditing(false)}>
                                Annuler
                            </button>
                        </form>

                    </div>
                )}
            {/* Message de retour après une tentative de modification */}
            {responseMessage && (
                <p className={`response-message ${responseType}`}>
                {responseMessage}
                </p>
            )}
            </div>
        </div>
    );
};

export default Tag;
