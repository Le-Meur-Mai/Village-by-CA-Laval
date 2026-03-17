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
    
    // Valeurs des champs texte du formulaire
    const [formData, setFormData] = useState({
        title: post?.title || "",
        description: post?.description || ""
    });
    
    // Fichier image sélectionné par l'utilisateur (pas encore envoyée au serveur)
    const [pictureFile, setPictureFile] = useState(null);
    
    // URLs des images affichées (object URL local pendant la sélection, URL serveur après sauvegarde)
    // Gérées localement pour éviter de dépendre du parent et ne pas avoir à recharger la page
    const [previewPicture, setPreviewPicture] = useState(post?.picture || "");
    
    // Message de retour après soumission du formulaire ("success" ou "error")
    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    
    // Resynchronise formData si le parent met à jour `partner`,
    // mais seulement quand on n'est pas en train d'éditer (pour ne pas écraser la saisie en cours)
    useEffect(() => {
        if (post && !isEditing) {
            setFormData({
                title: post.title || "",
                description: post.description || ""
            });
        }
    }, [post]);

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
    
    // Met à jour formData dynamiquement selon le champ modifié (name, website, description)
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
            const newPicture = data.updatedPost?.picture ?? previewPicture;
            
            // Mise à jour des previews locales avec les URLs définitives du serveur
            // → l'image s'affiche correctement sans rechargement de page
            setPreviewPicture(newPicture);
            
            // On vide le fichier sélectionné, il a été envoyé
            setPictureFile(null);
            
            // On remonte les nouvelles données au composant parent pour garder son state à jour
            onUpdate(prev => prev.map(
                postElement => postElement.id === post.id 
                    ? {...postElement, ...updatedData, picture: newPicture}  // ← updatedData au lieu de formData
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
                        <img src={previewPicture || villageByCa} alt="image de l'article" className="popup-post-picture" />

                        <div>
                            <p><strong>Titre :</strong> {formData.title || post.title}</p>
                            <div className="post-popup-description">
                                <p>{formData.description || post.description}</p>
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
                            initialData={{...post, picture: previewPicture}}
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
