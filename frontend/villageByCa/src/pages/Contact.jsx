import '../styles/page.css';
import '../styles/Contact.css';
import '../styles/Button.css';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import PresentationPage from '../components/PresentationPage.jsx';
import { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [responseMessage, setResponseMessage] = useState("");
    const [responseType, setResponseType] = useState(""); // "success" ou "error"

    const handleChange = (field) => {
        setFormData({ 
            ...formData, 
            [field.target.name]: field.target.value 
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setResponseType("error");
                setResponseMessage(data.message || "Une erreur est survenue.");
                return;
            }

            setResponseType("success");
            setResponseMessage(data.message || "Message envoyé !");
            
        } catch (error) {
            console.error(error);
            setResponseType("error");
            setResponseMessage("Impossible de contacter le serveur.");
        }
    };

    return (
        <div className='page'>
            <Header />

            <main>
                <PresentationPage 
                    title="Contact" 
                    text="" />
                <div className="contact-container">
                    <h2>Contactez-nous</h2>

                    <form onSubmit={handleSubmit} className="contact-form">

                        <label htmlFor="name">Nom</label>
                        <input
                            id="name"
                            type="text" 
                            name="name"
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email" 
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="subject">Sujet</label>
                        <select
                            id="subject"
                            name="subject" 
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Veuillez renseigner un champ</option>
                            <option value="Conseils pour vous orienter dans l'écosystème mayenais">
                                Conseils pour vous orienter dans l'écosystème mayenais
                            </option>
                            <option value="Réservation de salle">Réservation de salle</option>
                            <option value="Je veux rejoindre le Village By CA">
                                Je veux rejoindre le Village By CA
                            </option>
                            <option value="Je veux devenir partenaire du Village By CA">
                                Je veux devenir partenaire du Village By CA
                            </option>
                            <option value="Contact pour un événement">Contact pour un événement</option>
                            <option value="Autre">Autre</option>
                        </select>

                        <label htmlFor="message" >Message</label>
                        <textarea
                            id="message"
                            name="message" 
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />

                        <button className='button' type="submit">Envoyer</button>
                    </form>

                    {responseMessage && (
                        <p className={`response-message ${responseType}`}>
                            {responseMessage}
                        </p>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;