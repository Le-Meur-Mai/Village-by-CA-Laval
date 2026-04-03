import '../styles/StartupForm.css';
import { useState } from 'react';

const StartupForm = ({ initialData = {}, allTypes = [], allUsers = [], onSubmit, onCancel, required = false }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        website: initialData.website || "",
        isAlumni: initialData.isAlumni ?? false,
        description: initialData.description || "",
        userId: initialData.userId || initialData.user?.id || "",
        types: initialData.types || []
    });
    const [logoFile, setLogoFile] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(initialData.logo || "");
    const [descriptionPictureFile, setDescriptionPictureFile] = useState(null);
    const [previewDescriptionPicture, setPreviewDescriptionPicture] = useState(initialData.descriptionPicture || "");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handler séparé pour le isAlumni
    const handleCheckbox = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    // Ajoute un type s'il n'est pas déjà dans la liste
    const handleAddType = (type) => {
        if (formData.types.find(t => t.id === type.id)) return;
        setFormData(prev => ({ ...prev, types: [...prev.types, type] }));
    };

    // Supprime un type de la liste
    const handleRemoveType = (typeId) => {
        setFormData(prev => ({
            ...prev,
            types: prev.types.filter(t => t.id !== typeId)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("website", formData.website);
        fd.append("isAlumni", formData.isAlumni);
        fd.append("description", formData.description);
        fd.append("userId", formData.userId);
        fd.append("types", JSON.stringify(formData.types.map(t => t.id)));
        if (logoFile) fd.append("logo", logoFile);
        if (descriptionPictureFile) fd.append("descriptionPicture", descriptionPictureFile)
        onSubmit(fd, formData); // on remonte le FormData au parent
    };

    // Nom du propriétaire actuel pour l'affichage par défaut du select
    const currentUserId = formData.userId;

    // Garde les users sans startup + le propriétaire actuel (update)
    const availableUsers = allUsers.filter(u => !u.startUp || u.id === currentUserId);

    return (
        <form onSubmit={handleSubmit} className="edit-form-startup">
            <label>
                Nom :
                <input type="text" name="name" value={formData.name} onChange={handleChange} required={required}/>
            </label>
            <label>
                Site web :
                <input type="text" name="website" value={formData.website} onChange={handleChange}/>
            </label>
            <label>
                Alumni :
                <input
                    type="checkbox"
                    name="isAlumni"
                    checked={formData.isAlumni}
                    onChange={handleCheckbox}
                />
            </label>
            <label>
                Propriétaire :
                 <select name="userId" value={formData.userId} onChange={handleChange} required={required}>
                    {availableUsers.length > 0 ? (
                        availableUsers.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                                {user.id === currentUserId ? " (actuel)" : ""}
                            </option>
                        ))
                    ) : (
                        <option disabled value="">Aucun utilisateur disponible</option>
                    )}
                </select>
            </label>
            {/* Types affichés comme badges supprimables */}
            <div>
                <strong>Types :</strong>
                <div className='startup-type-form'>
                    {formData.types.length > 0 ? (
                        formData.types.map(type => (
                            <span
                                className='startup-type-span'
                                key={type.id}
                                style={{
                                    backgroundColor: `${type.color}`
                                }}
                            >
                                {type.name}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveType(type.id)}
                                    className='startup-type-button-delete'
                                >×</button>
                            </span>
                        ))
                    ) : (
                        <span>Aucun type</span>
                    )}
                </div>
            </div>
            {/* Types disponibles à ajouter — on masque ceux déjà sélectionnés */}
            <div>
                <strong>Ajouter un type :</strong>
                <div className='startup-type-adding'>
                    {allTypes
                        .filter(type => !formData.types.find(t => t.id === type.id))
                        .map(type => (
                            <span
                                key={type.id}
                                onClick={() => handleAddType(type)}
                                style={{
                                    backgroundColor: `${type.color}` || '#ccc',
                                }}
                                className='startup-type-span-adding'
                            >
                                + {type.name}
                            </span>
                        ))
                    }
                    {allTypes.filter(type => !formData.types.find(t => t.id === type.id)).length === 0 && (
                        <span className='startup-allTypes-put'>Tous les types sont déjà ajoutés</span>
                    )}
                </div>
            </div>

            <label>
                Logo :
                <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    setLogoFile(file);
                    setPreviewLogo(URL.createObjectURL(file));
                }} />
                {previewLogo && <img src={previewLogo} alt="preview" className="preview-img" />}
            </label>
            <label>
                Image d'illustration :
                <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    setDescriptionPictureFile(file);
                    setPreviewDescriptionPicture(URL.createObjectURL(file));
                }} />
                {previewDescriptionPicture && <img src={previewDescriptionPicture} alt="preview" className="preview-img" />}
            </label>
            <label>
                Description :
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4"/>
            </label>
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onCancel}>Annuler</button>
        </form>
    );
};

export default StartupForm;
