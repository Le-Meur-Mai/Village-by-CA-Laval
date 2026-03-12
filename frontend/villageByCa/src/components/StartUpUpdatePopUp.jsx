import "../styles/StartupPopUp.css";
import '../styles/StartUpInfoProfil.css';
import "../styles/PopUpPartnerCard.css";
import "../styles/StartUpUpdatePopUp.css";
import { useState, useEffect } from 'react';
import StartupForm from './StartupForm.jsx';

const StartupPopUp = ({ startup, types, users, onClose, onUpdate, onDelete }) => {
    // Bascule entre le mode lecture et le mode édition
    const [isEditing, setIsEditing] = useState(false);

    // Mise en place d'un valeur qui va confirmer le DELETE 
    const [confirmDelete, setConfirmDelete] = useState(false);
    
    // Valeurs des champs texte du formulaire
    const [formData, setFormData] = useState({
        name: startup?.name || "",
        website: startup?.website || "",
        isAlumni: startup?.isAlumni ?? false,
        description: startup?.description || "",
        userId: startup?.user?.id || "",
        types: startup?.types || []  
    });
    
    // Fichier image sélectionnée par l'utilisateur (pas encore envoyée au serveur)
    const [logoFile, setLogoFile] = useState(null);
    const [descriptionPictureFile, setDescriptionPictureFile] = useState(null);
    
    // URLs des images affichées (object URL local pendant la sélection, URL serveur après sauvegarde)
    // Gérées localement pour éviter de dépendre du parent et ne pas avoir à recharger la page
    const [previewLogo, setPreviewLogo] = useState(startup?.logo || "");
    const [previewDescriptionPicture, setPreviewDescriptionPicture] = useState(startup?.descriptionPicture || "");
    
    // Message de retour après soumission du formulaire ("success" ou "error")
    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    
    // Resynchronise formData si le parent met à jour `partner`,
    // mais seulement quand on n'est pas en train d'éditer (pour ne pas écraser la saisie en cours)
    useEffect(() => {
        if (startup && !isEditing) {
            setFormData({
                name: startup.name || "",
                isAlumni: startup.isAlumni ?? false,
                website: startup.website || "",
                description: startup.description || "",
                userId: startup.user?.id || "",
                types: startup.types || []
            });
        }
    }, [startup]);

    // Fonction pour gérer le Delete du partenaire:
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/admin/startups/${startup.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                setResponseType("error");
                setResponseMessage("Erreur lors de la suppression.");
                return;
            }

            onDelete(startup.id); // on remonte l'id au parent
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
            const response = await fetch(`http://localhost:3000/admin/startups/${startup.id}`, {
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
            
            // Le serveur renvoie les nouvelles URLs si elles été modifiées.
            // Sinon on conserve les previews actuelles.
            const newLogo = data.updatedStartUp?.logo ?? previewLogo;
            const newDescriptionPicture = data.updatedStartUp.descriptionPicture ?? previewDescriptionPicture;

            
            // Mise à jour des previews locales avec les URLs définitives du serveur
            // → l'image s'affiche correctement sans rechargement de page
            setPreviewLogo(newLogo);
            setPreviewDescriptionPicture(newDescriptionPicture);

            // updatedData peut contenir les nouveaux types renvoyés par le serveur
            const newTypes = data.updatedStartUp?.types ?? formData.types;
            setFormData(prev => ({ ...prev, ...updatedData, types: newTypes }));
            
            // On vide le fichier sélectionné, il a été envoyé
            setLogoFile(null);
            setDescriptionPictureFile(null);
            
            // On remonte les nouvelles données au composant parent pour garder son state à jour
            onUpdate(prev => prev.map(
                startupElement => startupElement.id === startup.id 
                    ? {...startupElement, ...updatedData, logo: newLogo, descriptionPicture: newDescriptionPicture, types: newTypes}
                    : startupElement
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

    // Nom du propriétaire actuel pour l'affichage en mode lecture
    const currentOwnerName = users?.find(u => u.id === formData.userId)?.name
        || startup.user?.name
        || formData.userId;
    
    if (!startup) {
        return null;
    }
    return (
        // On rend le fond plus foncé et si l'utilisateur clique dessus (donc en dehors), ça ferme le pop-up
        <div className="popup-overlay" onClick={onClose}>
            {/*Si on clique dans la carte ça ne va pas la fermer car stopPropagation
            empêche l'évenement de remonter jusqu'à le on click de l'overlay qui fermerait le pop-up*/}
            <div className="popup-startup-card-popup-details" onClick={(e) => e.stopPropagation()}>
                {/* ── Mode lecture ── */}
                {!isEditing && (
                    <>
                        {/* Images gérées via les previews locales pour refléter les dernières modifications */}
                        <img src={previewLogo} alt="logo" className="popup-startup-logo" />

                        <div>
                            <p><strong>Nom :</strong> {formData.name || startup.name}</p>
                            <p><strong>Site :</strong> {formData.website || startup.website}</p>
                            <p><strong>Alumni :</strong> {formData.isAlumni || startup.isAlumni ? "Oui" : "Non"}</p>
                            <p><strong>Propriétaire :</strong> {currentOwnerName}</p>
                            <div className='startup-type-form-popup'>
                                <strong>Types :</strong>
                                {formData.types.length > 0 ? (
                                    formData.types.map(type => (
                                        <span
                                            key={type.id}
                                            style={{
                                                backgroundColor: `#${type.color}`
                                            }}
                                            className="startup-type-span-popup"
                                        >
                                            {type.name}
                                            </span>
                                    ))
                                ) : (
                                    <span>Aucun type</span>
                                )}
                            </div>
                            <img src={previewDescriptionPicture} alt="descriptionPicture" className="popup-startup-decriptionPicture" />
                            <p><strong>Description : </strong>{formData.description || startup.description}</p>
                        </div>

                        <button onClick={() => setIsEditing(true)}>
                            Modifier
                        </button>
                        {!confirmDelete ? (
                            <button onClick={() => setConfirmDelete(true)}>Supprimer</button>
                        ) : (
                            <div className="sureButton">
                                <p>Voulez-vous vraiment supprimer <strong>{startup.name}</strong> ?</p>
                                <button onClick={handleDelete}>Confirmer</button>
                                <button onClick={() => setConfirmDelete(false)}>Annuler</button>
                            </div>
                        )}
                    </>
                )}

                {/* ── Mode édition ── */}
                    {isEditing && (
                        <StartupForm
                            initialData={{...startup, logo: previewLogo}}
                            allTypes={types}
                            allUsers={users}
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

export default StartupPopUp;
