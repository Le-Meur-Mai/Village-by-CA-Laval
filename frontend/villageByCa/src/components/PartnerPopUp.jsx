import "../styles/StartupPopUp.css";
import '../styles/StartUpInfoProfil.css';
import "../styles/PopUpPartnerCard.css";
import { useState, useEffect } from 'react';
import PartnerForm from './PartnerForm.jsx';

const PartnerPopUp = ({ partner, onClose, onUpdate, onDelete }) => {
    
    // Bascule entre le mode lecture et le mode édition
    const [isEditing, setIsEditing] = useState(false);

    // Mise en place d'un valeur qui va confirmer le DELETE 
    const [confirmDelete, setConfirmDelete] = useState(false);
    
    // Valeurs des champs texte du formulaire
    const [formData, setFormData] = useState({
        name: partner?.name || "",
        website: partner?.website || "",
        description: partner?.description || "",
        financialAid: partner?.financialAid || ""
    });
    
    // Fichier image sélectionnéé par l'utilisateur (pas encore envoyée au serveur)
    const [logoFile, setLogoFile] = useState(null);
    
    // URLs des images affichées (object URL local pendant la sélection, URL serveur après sauvegarde)
    // Gérées localement pour éviter de dépendre du parent et ne pas avoir à recharger la page
    const [previewLogo, setPreviewLogo] = useState(partner?.logo || "");
    
    // Message de retour après soumission du formulaire ("success" ou "error")
    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    
    // Resynchronise formData si le parent met à jour `partner`,
    // mais seulement quand on n'est pas en train d'éditer (pour ne pas écraser la saisie en cours)
    useEffect(() => {
        if (partner && !isEditing) {
            setFormData({
                name: partner.name || "",
                website: partner.website || "",
                description: partner.description || "",
                financialAid: partner.financialAid || ""
            });
        }
    }, [partner]);

    // Fonction pour gérer le Delete du partenaire:
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/admin/partenaires/${partner.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                setResponseType("error");
                setResponseMessage("Erreur lors de la suppression.");
                return;
            }

            onDelete(partner.id); // on remonte l'id au parent
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
            const response = await fetch(`http://localhost:3000/admin/partenaires/${partner.id}`, {
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
            const newLogo = data.updatedPartner?.logo ?? previewLogo;
            
            // Mise à jour des previews locales avec les URLs définitives du serveur
            // → l'image s'affiche correctement sans rechargement de page
            setPreviewLogo(newLogo);
            
            // On vide le fichier sélectionné, il a été envoyé
            setLogoFile(null);
            
            // On remonte les nouvelles données au composant parent pour garder son state à jour
            onUpdate(prev => prev.map(
                partnerElement => partnerElement.id === partner.id 
                    ? {...partnerElement, ...updatedData, logo: newLogo}  // ← updatedData au lieu de formData
                    : partnerElement
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
    
    if (!partner) {
        return null;
    }
    return (
        // On rend le fond plus foncé et si l'utilisateur clique dessus (donc en dehors), ça ferme le pop-up
        <div className="popup-overlay" onClick={onClose}>
            {/*Si on clique dans la carte ça ne va pas la fermer car stopPropagation
            empêche l'évenement de remonter jusqu'à le on click de l'overlay qui fermerait le pop-up*/}
            <div className="popup-partner-card" onClick={(e) => e.stopPropagation()}>
                {/* ── Mode lecture ── */}
                {!isEditing && (
                    <>
                        {/* Images gérées via les previews locales pour refléter les dernières modifications */}
                        <img src={previewLogo} alt="logo" className="popup-partner-logo" />

                        <div>
                            <p><strong>Nom :</strong> {formData.name || partner.name}</p>
                            <p><strong>Site :</strong> {formData.website || partner.website}</p>
                            <p><strong>Aide financière :</strong> {formData.financialAid || partner.financialAid}</p>
                            <p>{formData.description || partner.description}</p>
                        </div>

                        <button onClick={() => setIsEditing(true)}>
                            Modifier
                        </button>
                        {!confirmDelete ? (
                            <button onClick={() => setConfirmDelete(true)}>Supprimer</button>
                        ) : (
                            <div className="sureButton">
                                <p>Voulez-vous vraiment supprimer <strong>{partner.name}</strong> ?</p>
                                <button onClick={handleDelete}>Confirmer</button>
                                <button onClick={() => setConfirmDelete(false)}>Annuler</button>
                            </div>
                        )}
                    </>
                )}

                {/* ── Mode édition ── */}
                    {isEditing && (
                        <PartnerForm
                            initialData={{...partner, logo: previewLogo}}
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

export default PartnerPopUp;
