import "../styles/StartupPopUp.css";
import '../styles/StartUpInfoProfil.css';
import "../styles/PopUpPartnerCard.css";
import "../styles/PicturesLocation.css";
import "../styles/LocationPopUp.css"
import { useState } from 'react';
import LocationForm from './LocationForm.jsx';

const LocationPopUp = ({ location, onClose, onUpdate, onDelete }) => {
    
    // Bascule entre le mode lecture et le mode édition
    const [isEditing, setIsEditing] = useState(false);

    // Mise en place d'un valeur qui va confirmer le DELETE 
    const [confirmDelete, setConfirmDelete] = useState(false);
    
    // Message de retour après soumission du formulaire ("success" ou "error")
    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    // Pour l'index de l'image pour le carrousel
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? location.pictures.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === location.pictures.length - 1 ? 0 : prev + 1));
    };

    // Fonction pour gérer le Delete de la location:
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/admin/locations/${location.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                setResponseType("error");
                setResponseMessage("Erreur lors de la suppression.");
                return;
            }

            onDelete(location.id); // on remonte l'id au parent
            onClose();            // on ferme la popup
        } catch (error) {
            setResponseType("error");
            setResponseMessage("Impossible de contacter le serveur.");
        }
    };
    
    // Soumission du formulaire : envoie les données au serveur puis met à jour l'affichage
    const handleSubmit = async (fd, updatedData) => {

        try {
            const response = await fetch(`http://localhost:3000/admin/locations/${location.id}`, {
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
            const updatedPictures = data.updatedLocation?.pictures ?? location.pictures;
 
            // On remonte les nouvelles données au composant parent pour garder son state à jour
            onUpdate(prev => prev.map(
                locationElement => locationElement.id === location.id 
                    ? {...locationElement, ...updatedData, pictures: updatedPictures}  // ← updatedData au lieu de formData
                    : locationElement
            ));
            
            setResponseType("success");
            setResponseMessage(data.message || "Mise à jour réussie !");
        } catch (error) {
            // Erreur réseau ou serveur injoignable
            setResponseType("error");
            setResponseMessage("Impossible de contacter le serveur.");
        }
        
        // On repasse en mode lecture dans tous les cas
        setIsEditing(false);
    };
    
    if (!location) {
        return null;
    }
    return (
        // On rend le fond plus foncé et si l'utilisateur clique dessus (donc en dehors), ça ferme le pop-up
        <div className="popup-overlay" onClick={onClose}>
            {/*Si on clique dans la carte ça ne va pas la fermer car stopPropagation
            empêche l'évenement de remonter jusqu'à le on click de l'overlay qui fermerait le pop-up*/}
            <div className="popup-location-card" onClick={(e) => e.stopPropagation()}>
                {/* ── Mode lecture ── */}
                {!isEditing && (
                    <>
                        {/* Images gérées via les previews locales pour refléter les dernières modifications */}
                        <div className="carousel-location">
                            <button className="arrow left" onClick={prevImage}>‹</button>

                            <img
                                src={location.pictures[currentIndex].secureUrl}
                                alt="location"
                                className="carousel-location-image"
                            />

                            <button className="arrow right" onClick={nextImage}>›</button>
                        </div>

                        <div>
                            <p><strong>Titre :</strong> {location.title}</p>
                            <p><strong>Prix :</strong> {location.price} €/J</p>
                            <p><strong>Espace :</strong> {location.size} M²</p>
                            <p>{location.description}</p>
                        </div>

                        <button onClick={() => setIsEditing(true)}>
                            Modifier
                        </button>
                        {!confirmDelete ? (
                            <button onClick={() => setConfirmDelete(true)}>Supprimer</button>
                        ) : (
                            <div className="sureButton">
                                <p>Voulez-vous vraiment supprimer <strong>{location.title}</strong> ?</p>
                                <button onClick={handleDelete}>Confirmer</button>
                                <button onClick={() => setConfirmDelete(false)}>Annuler</button>
                            </div>
                        )}
                    </>
                )}

                {/* ── Mode édition ── */}
                    {isEditing && (
                        <LocationForm
                            initialData={location}
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

export default LocationPopUp;
