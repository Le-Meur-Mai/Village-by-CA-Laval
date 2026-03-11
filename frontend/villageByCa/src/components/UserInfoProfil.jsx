import '../styles/UserInfoProfil.css';

import { useState } from 'react';

const UserInfoProfil = ( {user, onUpdate} ) => {

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || ""
    });

    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    if (!user) {
        return (
            <div className="user-card">
                <h2>Mon profil</h2>
                <p>Utilisateur non trouvé</p>
            </div>
        )
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/auth/profil', {
                method: 'PATCH',
                credentials: "include", // Pour enregistrer les cookies crss-origin
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setResponseType("error");
                setResponseMessage(data.message || "Une erreur est survenue.");
                return;
            }

            // Met à jour le props du parent avec les modifications, seulement pour les données utilisateur
            onUpdate(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    ...formData
                }
            }));
            setResponseType("success");
            setResponseMessage(data.message || "Mise à jour réussie !");
            
        } catch (error) {
            console.error(error);
            setResponseType("error");
            setResponseMessage("Impossible de contacter le serveur.");
        }

        setIsEditing(false);
    };


    return (
        <div className="user-card">
    
            <h2><strong>Mon Profil</strong></h2>

            {!isEditing && (
                <>
                    <div className='user-card-info'>
                        <p><strong>Nom :</strong> {user.name}</p>
                        <p><strong>Email :</strong> {user.email}</p>
                    </div>

                    <button onClick={() => setIsEditing(true)}>
                        Modifier
                    </button>
                </>
            )}

            {isEditing && (
                <form onSubmit={handleSubmit} className="edit-form">
                    <label>
                        Nom :
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Email :
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </label>

                    <button type="submit">Enregistrer</button>
                    <button type="button" onClick={() => setIsEditing(false)}>
                        Annuler
                    </button>
                </form>
            )}
        
            {responseMessage && (
                <p className={`response-message ${responseType}`}>
                    {responseMessage}
                </p>
            )}

        </div>
    )
}

export default UserInfoProfil;
