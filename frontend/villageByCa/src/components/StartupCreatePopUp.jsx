import { useState } from 'react';
import StartupForm from './StartupForm.jsx';

import "../styles/StartupCreatePopUp.css";

const StartupCreatePopUp = ({ onClose, onCreate, types, users }) => {
    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = async (fd, updatedData) => {
        try {
            const response = await fetch("http://localhost:3000/admin/startups", {
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
            onCreate(data.startUpCreated); // on remonte la nouvelle startup au parent
            onClose();
        } catch (error) {
            setResponseType("error");
            setResponseMessage("Impossible de contacter le serveur.");
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-startup-card" onClick={(e) => e.stopPropagation()}>
                <h2>Nouvelle Startup</h2>
                <StartupForm
                allTypes={types}
                allUsers={users}
                onSubmit={handleSubmit}
                onCancel={onClose}
                required={true}/>
                {responseMessage && (
                    <p className={`response-message ${responseType}`}>{responseMessage}</p>
                )}
            </div>
        </div>
    );
};

export default StartupCreatePopUp;
