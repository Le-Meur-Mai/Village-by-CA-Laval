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
    
    // Message de retour après soumission du formulaire ("success" ou "error")
    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

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
            const newLogo = data.updatedStartUp?.logo;
            const newDescriptionPicture = data.updatedStartUp.descriptionPicture;

            // updatedData peut contenir les nouveaux types renvoyés par le serveur
            const newTypes = data.updatedStartUp?.types;
            
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
    const currentOwnerName = users?.find(u => u.id === startup.userId)?.name
        || startup.user?.name
        || "Inconnu";
    
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
                        <img src={startup.logo} alt="logo" className="popup-startup-logo" />

                        <div>
                            <p><strong>Nom :</strong> {startup.name}</p>
                            <p><strong>Site :</strong> {startup.website}</p>
                            <p><strong>Alumni :</strong> {startup.isAlumni ? "Oui" : "Non"}</p>
                            <p><strong>Propriétaire :</strong> {currentOwnerName}</p>
                            <div className='startup-type-form-popup'>
                                <strong>Types :</strong>
                                {startup.types.length > 0 ? (
                                    startup.types.map(type => (
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
                            <img src={startup.descriptionPicture} alt="descriptionPicture" className="popup-startup-decriptionPicture" />
                            <p><strong>Description : </strong>{startup.description}</p>
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
                            initialData={startup}
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
