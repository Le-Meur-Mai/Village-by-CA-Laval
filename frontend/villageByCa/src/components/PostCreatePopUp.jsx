import { useState } from 'react';
import PostForm from './PostForm.jsx';

const PostCreatePopUp = ({ onClose, onCreate }) => {
    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = async (fd, updatedData) => {
        try {
            const response = await fetch("http://localhost:3000/admin/articles", {
                method: "POST",
                credentials: "include",
                body: fd
            });

            const data = await response.json();

            if (!response.ok) {
                setResponseType("error");
                setResponseMessage(data.message || "Une erreur est survenue.");
                return;
            }
            onCreate(data.newPost); // on remonte le nouveau partenaire au parent
            onClose();
        } catch (error) {
            setResponseType("error");
            setResponseMessage("Impossible de contacter le serveur.");
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-post-card" onClick={(e) => e.stopPropagation()}>
                <h2>Nouveau post</h2>
                <PostForm onSubmit={handleSubmit} onCancel={onClose} required={true}/>
                {responseMessage && (
                    <p className={`response-message ${responseType}`}>{responseMessage}</p>
                )}
            </div>
        </div>
    );
};

export default PostCreatePopUp;