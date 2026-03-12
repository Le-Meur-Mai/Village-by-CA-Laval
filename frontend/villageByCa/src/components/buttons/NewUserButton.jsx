import { useState } from 'react';
import '../../styles/Button.css'
import "../../styles/QuoteCard.css";

const NewUserButton = ({onUpdate = null}) => {
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
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
            // Utilise la route API correspondante
            const response = await fetch(`http://localhost:3000/admin/users`, {
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

            onUpdate(prev => [...prev, data.user]);

            setResponseType("success");
            setResponseMessage(data.message || "L'utilisateur' a été créé !");
            setFormData({ name: '', email: '', password: ''});

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
                    <button onClick={() => setIsEditing(true)} className="button">Ajouter un Utilisateur</button>
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
                    Email :
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    </label>

                    <label>
                    Mot de passe :
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
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

export default NewUserButton;