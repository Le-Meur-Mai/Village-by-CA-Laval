import "../styles/StartupPopUp.css";
import '../styles/StartUpInfoProfil.css';
import "../styles/PopUpPartnerCard.css";
import "../styles/PostPopUp.css";
import villageByCa from '../assets/logo_village_by_ca.png';
import { useState, useEffect } from 'react';
import PostForm from './PostForm.jsx';

const PostPopUp = ({ post, onClose, onUpdate, onDelete }) => {
    
    // Bascule entre le mode lecture et le mode édition
    const [isEditing, setIsEditing] = useState(false);

    // Mise en place d'un valeur qui va confirmer le DELETE 
    const [confirmDelete, setConfirmDelete] = useState(false);
    
    // Message de retour après soumission du formulaire ("success" ou "error")
    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    // Fonction pour gérer le Delete du partenaire:
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/admin/articles/${post.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                setResponseType("error");
                setResponseMessage("Erreur lors de la suppression.");
                return;
            }

            onDelete(post.id); // on remonte l'id au parent
            onClose();            // on ferme la popup
        } catch (error) {
            setResponseType("error");
            setResponseMessage("Impossible de contacter le serveur.");
        }
    };
    
    // Soumission du formulaire : envoie les données au serveur puis met à jour l'affichage
    const handleSubmit = async (fd, updatedData) => {

        try {
            const response = await fetch(`http://localhost:3000/admin/articles/${post.id}`, {
                method: "PATCH",
                credentials: "include", // envoie le cookie de session
                body: fd
            });
            
            const data = await response.json();
            
            // Erreur côté serveur (validation, droits, etc.)
            if (!response.ok) {
                setResponseType("error");
                setResponseMessage(data.message || "Une erreur est survenue.");
                return;
            }
            
            // Le serveur renvoie les nouvelles URLs du logo si il a été modifié.
            // Sinon on conserve les previews actuelles.
            const newPicture = data.updatedPost?.picture.secureUrl ?? previewPicture;

            // On remonte les nouvelles données au composant parent pour garder son state à jour
            onUpdate(prev => prev.map(
                postElement => postElement.id === post.id 
                    ? {...postElement, ...updatedData, picture: newPicture}
                    : postElement
            ));
            
            setResponseType("success");
            setResponseMessage(data.message || "Mise à jour réussie !");
        } catch (error) {
            // Erreur réseau ou serveur injoignable
            console.error(error);
            setResponseType("error");
            setResponseMessage("Impossible de contacter le serveur.");
        }
        
        // On repasse en mode lecture dans tous les cas
        setIsEditing(false);
    };
    
    if (!post) {
        return null;
    }
    return (
        // On rend le fond plus foncé et si l'utilisateur clique dessus (donc en dehors), ça ferme le pop-up
        <div className="popup-overlay" onClick={onClose}>
            {/*Si on clique dans la carte ça ne va pas la fermer car stopPropagation
            empêche l'évenement de remonter jusqu'à le on click de l'overlay qui fermerait le pop-up*/}
            <div className="popup-post-card" onClick={(e) => e.stopPropagation()}>
                {/* ── Mode lecture ── */}
                {!isEditing && (
                    <>
                        {/* Images gérées via les previews locales pour refléter les dernières modifications */}
                        <img src={post.picture || villageByCa} alt="image de l'article" className="popup-post-picture" />

                        <div>
                            <p><strong>Titre :</strong> {post.title}</p>
                            <div className="post-popup-description">
                                <p>{post.description}</p>
                            </div>
                        </div>

                        <button onClick={() => setIsEditing(true)}>
                            Modifier
                        </button>
                        {!confirmDelete ? (
                            <button onClick={() => setConfirmDelete(true)}>Supprimer</button>
                        ) : (
                            <div className="sureButton">
                                <p>Voulez-vous vraiment supprimer <strong>{post.title}</strong> ?</p>
                                <button onClick={handleDelete}>Confirmer</button>
                                <button onClick={() => setConfirmDelete(false)}>Annuler</button>
                            </div>
                        )}
                    </>
                )}

                {/* ── Mode édition ── */}
                    {isEditing && (
                        <PostForm
                            initialData={post}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsEditing(false)}
                            required={false}
                        />
                    )}

                {/* Message de retour affiché après soumission (succès ou erreur) */}
                {responseMessage && (
                    <p className={`response-message ${responseType}`}>
                        {responseMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PostPopUp;
