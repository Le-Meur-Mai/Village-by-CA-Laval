import { useState } from 'react';
import LocationForm from './LocationForm.jsx';

const LocationCreatePopUp = ({ onClose, onCreate }) => {
    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = async (fd, updatedData) => {
        try {
            const response = await fetch("http://localhost:3000/admin/locations", {
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
            data.newLocation.picture = data.newLocation.pictures?.[0]?.secureUrl;
            onCreate(data.newLocation); // on remonte la nouvelle location au parent
            onClose();
        } catch (error) {
            setResponseType("error");
            setResponseMessage("Impossible de contacter le serveur.");
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-location-card" onClick={(e) => e.stopPropagation()}>
                <h2>Nouvelle location</h2>
                <LocationForm onSubmit={handleSubmit} onCancel={onClose} required={true}/>
                {responseMessage && (
                    <p className={`response-message ${responseType}`}>{responseMessage}</p>
                )}
            </div>
        </div>
    );
};

export default LocationCreatePopUp;