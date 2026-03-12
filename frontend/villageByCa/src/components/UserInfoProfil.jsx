import { useAuth } from '../contexts/AuthContext';
import '../styles/UserInfoProfil.css';

import { useState } from 'react';

const UserInfoProfil = ( {user, onUpdate} ) => {

    const { auth, loading } = useAuth();

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
            let response = '';
            if(!loading && auth && auth.isAdmin) {
                    response = await fetch(`http://localhost:3000/admin/users/${user.id}`, {
                    method: 'PATCH',
                    credentials: "include", // Pour enregistrer les cookies crss-origin
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
            } else {
                    response = await fetch('http://localhost:3000/auth/profil', {
                    method: 'PATCH',
                    credentials: "include", // Pour enregistrer les cookies crss-origin
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }

            const data = await response.json();

            if (!response.ok) {
                setResponseType("error");
                setResponseMessage(data.message || "Une erreur est survenue.");
                return;
            }

            // Met à jour le props du parent avec les modifications
            onUpdate(prev => {
                if (Array.isArray(prev)) {
                // Cas tableau : on remplace l'utilisateur modifié par ses nouvelles valeurs
                return prev.map(prevUser => prevUser.id === user.id ? { ...prevUser, ...formData } : prevUser);
                }
                // Cas objet : on met à jour uniquement le tableau utilisateur imbriqué
                return {
                ...prev,
                user: { ...prev.user, ...formData }
                };
            });
            setResponseType("success");
            setResponseMessage(data.message || "Mise à jour réussie !");
            
        } catch (error) {
            console.error(error);
            setResponseType("error");
            setResponseMessage("Impossible de contacter le serveur.");
        }

        setIsEditing(false);
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/admin/users/${user.id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const data = await response.json();

            // Si le serveur retourne une erreur HTTP (4xx, 5xx)
            if (!response.ok) {
                setResponseType("error");
                setResponseMessage(data.message || "Une erreur est survenue.");
                return; // On arrête ici sans fermer le formulaire
            }

            // On retire l'utilisateur supprimé de la liste parente
            onUpdate(prev => prev.filter(prevUser => prevUser.id !== user.id));

            setResponseType("success");
            setResponseMessage(data.message || "La citation a bien été supprimé");

        } catch (error) {
            console.error(error);
            setResponseType("error");
            setResponseMessage("Impossible de contacter le serveur.");  
        }

        setIsEditing(false);

    }


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
                    {!loading && auth && auth.isAdmin && (
                        <button onClick={handleDelete}>Supprimer</button>
                    )}
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
