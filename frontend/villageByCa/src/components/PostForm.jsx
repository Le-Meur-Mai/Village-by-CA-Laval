import { useState } from 'react';

import '../styles/PostForm.css';
import '../styles/StartupForm.css';
const PostForm = ({ initialData = {}, onSubmit, onCancel, required = false }) => {
    const [formData, setFormData] = useState({
        title: initialData.title || "",
        description: initialData.description || ""
    });
    const [pictureFile, setPictureFile] = useState(null);
    const [previewPicture, setPreviewPicture] = useState(initialData.picture || "");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("title", formData.title);
        fd.append("description", formData.description);
        if (pictureFile) fd.append("picture", pictureFile);
        onSubmit(fd, formData); // on remonte le FormData au parent
    };

    return (
        <form onSubmit={handleSubmit} className="edit-form-post">
            <label>
                Titre :
                <input type="text" name="title" value={formData.title} onChange={handleChange} required={required}/>
            </label>
            <label>
                Image :
                <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    setPictureFile(file);
                    setPreviewPicture(URL.createObjectURL(file));
                }} />
                {previewPicture && <img src={previewPicture} alt="preview" className="preview-img" />}
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

export default PostForm;
