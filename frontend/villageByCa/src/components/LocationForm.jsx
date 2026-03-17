// Pour le bouton de delete des images
import "../styles/LocationForm.css";

// Pour le css du formulaire de base
import "../styles/UserInfoProfil.css";

import { useState } from 'react';
const LocationForm = ({ initialData = {}, onSubmit, onCancel, required = false }) => {
    const [formData, setFormData] = useState({
        title: initialData.title || "",
        description: initialData.description || "",
        // ?? -> Ne remplace la valeur que si c'est null ou undefined
        price: initialData.price ?? "",
        size: initialData.size ?? ""
    });
    // Nouvelles images selectionnées
    const [newPicturesFiles, setNewPicturesFiles] = useState([]);
    // Anciennes images
    const [picturesFiles, setPicturesFiles] = useState(initialData.pictures || []);
    // Preview des nouvelles images URL temporaire
    const [previewPictures, setPreviewPictures] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePicturesChange = (e) => {
        const files = Array.from(e.target.files); // Convertit FileList en tableau
        setNewPicturesFiles(prev => [...prev, ...files]);

        // Génère les previews pour les nouvelles images
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewPictures(prev => [...prev, ...newPreviews]);
    };

    /* `filter` parcourt chaque élément du tableau avec deux paramètres :
        - `_` → la valeur de l'élément (le fichier/l'URL) — on n'en a pas besoin ici, donc on met `_` par convention pour dire "je l'ignore"
        - `i` → l'index de l'élément
        `i !== index` garde tous les éléments **sauf** celui à l'index qu'on veut supprimer.
    */

    const removeNewPicture = (index) => {
        setNewPicturesFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewPictures(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingPicture = (pictureId) => {
        setPicturesFiles(prev => prev.filter(p => p.id !== pictureId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("title", formData.title);
        fd.append("description", formData.description);
        fd.append("price", formData.price);
        fd.append("size", formData.size);
        // Ajoute chaque fichier image séparément
        newPicturesFiles.forEach(file => fd.append("newPictures", file));

        // Envoie les IDs des images existantes à conserver
        fd.append("pictures", JSON.stringify(picturesFiles.map(p => p.id)));

        onSubmit(fd, formData);
    };

    return (
        <form onSubmit={handleSubmit} className="edit-form">
            <label>
                Nom :
                <input type="text" name="title" value={formData.title} onChange={handleChange} required={required}/>
            </label>
            <label>
                Prix :
                <input type="text" name="price" value={formData.price} onChange={handleChange} required={required}/>
            </label>
            <label>
                Espace :
                <input type="text" name="size" value={formData.size} onChange={handleChange} required={required}/>
            </label>
             <label>
                Images :
                {/*On met 'multiple' pour gérer plusieurs images en même temps.*/}
                <input type="file" accept="image/*" multiple onChange={handlePicturesChange} required={required}/>
            </label>

                {/* Images existantes (BDD) */}
                {picturesFiles.length > 0 && (
                    <div className="pictures-location-preview">
                        {picturesFiles.map(picture => (
                            <div key={picture.id} className="preview-item">
                                <button type="button" className="delete-location-pictures-button" onClick={() => removeExistingPicture(picture.id)}>✕</button>
                                <img src={picture.secureUrl} alt="existing" className="preview-img" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Nouvelles images (pas encore envoyées) */}
                {previewPictures.length > 0 && (
                    <div className="pictures-preview">
                        {previewPictures.map((src, index) => (
                            <div key={index} className="preview-item">
                                <button type="button" className="delete-location-pictures-button" onClick={() => removeNewPicture(index)}>✕</button>
                                <img src={src} alt={`preview-${index}`} className="preview-img" />
                            </div>
                        ))}
                    </div>
                )}
            <label>
                Description :
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required={required}/>
            </label>
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onCancel}>Annuler</button>
        </form>
    );
};

export default LocationForm;
