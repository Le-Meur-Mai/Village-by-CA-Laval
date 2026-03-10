import '../styles/StartUpInfoProfil.css';
import { useState, useEffect } from 'react';

// Affiche les infos d'une start-up et permet de les modifier.
// Props :
//   - startup  : objet contenant les données de la start-up (nom, site, images, types...)
//   - onUpdate : fonction pour remonter les modifications au composant parent
const StartUpInfoProfil = ({ startup, onUpdate }) => {

    // Bascule entre le mode lecture et le mode édition
    const [isEditing, setIsEditing] = useState(false);

    // Valeurs des champs texte du formulaire
    const [formData, setFormData] = useState({
        name: startup?.name || "",
        website: startup?.website || "",
        description: startup?.description || "",
    });

    // Fichiers image sélectionnés par l'utilisateur (pas encore envoyés au serveur)
    const [logoFile, setLogoFile] = useState(null);
    const [descFile, setDescFile] = useState(null);

    // URLs des images affichées (object URL local pendant la sélection, URL serveur après sauvegarde)
    // Gérées localement pour éviter de dépendre du parent et ne pas avoir à recharger la page
    const [previewLogo, setPreviewLogo] = useState(startup?.logo || "");
    const [previewDesc, setPreviewDesc] = useState(startup?.descriptionPicture || "");

    // Message de retour après soumission du formulaire ("success" ou "error")
    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    // Resynchronise formData si le parent met à jour `startup`,
    // mais seulement quand on n'est pas en train d'éditer (pour ne pas écraser la saisie en cours)
    useEffect(() => {
        if (startup && !isEditing) {
            setFormData({
                name: startup.name || "",
                website: startup.website || "",
                description: startup.description || "",
            });
        }
    }, [startup]);

    // Cas où aucune start-up n'est associée au compte
    if (!startup) {
        return (
            <div className="startup-card">
                <h2>Ma Start-up</h2>
                <p>Aucune start-up enregistrée.</p>
            </div>
        );
    }

    // Met à jour formData dynamiquement selon le champ modifié (name, website, description)
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Soumission du formulaire : envoie les données au serveur puis met à jour l'affichage
    const handleSubmit = async (e) => {
        e.preventDefault();

        // On utilise FormData pour pouvoir envoyer à la fois du texte et des fichiers
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("website", formData.website);
        fd.append("description", formData.description);

        // On n'ajoute les images que si l'utilisateur en a sélectionné de nouvelles
        if (logoFile) fd.append("logo", logoFile);
        if (descFile) fd.append("descriptionPicture", descFile);

        try {
            const response = await fetch(`http://localhost:3000/auth/profil/startup/${startup.id}`, {
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

            // Le serveur renvoie les nouvelles URLs des images si elles ont été modifiées.
            // Sinon on conserve les previews actuelles.
            const newLogo = data.updatedStartup?.logo ?? previewLogo;
            const newDescPicture = data.updatedStartup?.descriptionPicture ?? previewDesc;

            // Mise à jour des previews locales avec les URLs définitives du serveur
            // → l'image s'affiche correctement sans rechargement de page
            setPreviewLogo(newLogo);
            setPreviewDesc(newDescPicture);

            // On vide les fichiers sélectionnés, ils ont été envoyés
            setLogoFile(null);
            setDescFile(null);

            // On remonte les nouvelles données au composant parent pour garder son state à jour
            onUpdate(prev => ({
                ...prev,
                startUp: {
                    ...prev.startUp,
                    ...formData,
                    logo: newLogo,
                    descriptionPicture: newDescPicture
                }
            }));

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

    return (
        <div className="startup-card">

            <h2><strong>Ma Start-up</strong></h2>

            {/* ── Mode lecture ── */}
            {!isEditing && (
                <>
                    {/* Images gérées via les previews locales pour refléter les dernières modifications */}
                    <img src={previewLogo} alt="logo" className="startup-logo" />
                    <img src={previewDesc} alt="Description" className="startup-description-img" />

                    <div className="startup-card-info">
                        <p><strong>Nom :</strong> {formData.name || startup.name}</p>
                        <p><strong>Site :</strong> {formData.website || startup.website}</p>

                        {/* Les types sont en lecture seule, non modifiables depuis ce formulaire */}
                        <p><strong>Type :</strong></p>
                        <div className="tags">
                            {startup.types.map(type => (
                                <span key={type.id}>{type.name}</span>
                            ))}
                        </div>

                        <p>{formData.description || startup.description}</p>
                    </div>

                    <button onClick={() => setIsEditing(true)}>
                        Modifier
                    </button>
                </>
            )}

            {/* ── Mode édition ── */}
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
                        Site web :
                        <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Logo :
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setLogoFile(file);
                                // Prévisualisation immédiate via une URL temporaire locale
                                setPreviewLogo(URL.createObjectURL(file));
                            }}
                        />
                        <img
                            src={previewLogo}
                            alt="logo"
                            className="preview-img"
                        />
                    </label>

                    <label>
                        Image de description :
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setDescFile(file);
                                // Prévisualisation immédiate via une URL temporaire locale
                                setPreviewDesc(URL.createObjectURL(file));
                            }}
                        />
                        <img
                            src={previewDesc}
                            alt="Description"
                            className="preview-img"
                        />
                    </label>

                    <label>
                        Description :
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                        />
                    </label>

                    <button type="submit">Enregistrer</button>
                    {/* Annuler ne soumet pas le formulaire et repasse en mode lecture */}
                    <button type="button" onClick={() => setIsEditing(false)}>
                        Annuler
                    </button>
                </form>
            )}

            {/* Message de retour affiché après soumission (succès ou erreur) */}
            {responseMessage && (
                <p className={`response-message ${responseType}`}>
                    {responseMessage}
                </p>
            )}

        </div>
    );
};

export default StartUpInfoProfil;
