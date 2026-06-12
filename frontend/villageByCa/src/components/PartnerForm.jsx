import { useState } from 'react';
const PartnerForm = ({ initialData = {}, onSubmit, onCancel, required = false }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        website: initialData.website || "",
        description: initialData.description || "",
        // ?? -> Ne remplace la valeur que si c'est null ou undefined
        financialAid: initialData.financialAid ?? ""
    });
    const [logoFile, setLogoFile] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(initialData.logo || "");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("website", formData.website);
        fd.append("description", formData.description);
        fd.append("financialAid", formData.financialAid);
        if (logoFile) fd.append("logo", logoFile);
        onSubmit(fd, formData); // on remonte le FormData au parent
    };

    return (
        <form onSubmit={handleSubmit} className="edit-form">
            <label>
                Nom :
                <input type="text" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required={required}/>
            </label>
            <label>
                Site web :
                <input type="text" name="website" value={formData.website} onChange={handleChange} required={required}/>
            </label>
            <label>
                Aide financière :
                <input type="text" name="financialAid" value={formData.financialAid} onChange={handleChange} required={required}/>
            </label>
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
                Description :
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required={required}/>
            </label>
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onCancel}>Annuler</button>
        </form>
    );
};

export default PartnerForm;
