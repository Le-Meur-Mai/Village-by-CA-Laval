import '../styles/page.css'
import '../styles/Connexion.css'

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from '../components/Header.jsx';
import PresentationPage from '../components/PresentationPage.jsx'
import Footer from '../components/Footer.jsx';

const Connexion = () => {
    const [connexionForm, setConnexionForm] = useState({
        email: "",
        password: ""
    });

    const [responseType, setResponseType] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // empêche le rechargement de la page

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                credentials: "include", // Pour enregistrer les cookies crss-origin
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(connexionForm)
            });

            const data = await response.json();

            if (!response.ok) {
                setResponseType("error");
                setResponseMessage(data.message || "Une erreur est survenue.");
                return;
            }

            setResponseType("success");
            setResponseMessage(data.message || "Connexion réussie !");

            if (data) {
                navigate("/admin");
            } else {
                navigate("/profil")
            }
            
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
                <PresentationPage title='Connexion' text=''/>
                <div className='login-section'>
                    <div className='login-left-section'>
                        <form onSubmit={ handleSubmit }>
                            <label htmlFor="email">Email : </label>
                            <input 
                                id='email' 
                                type="email"
                                value={connexionForm.email}
                                onChange={(e) => setConnexionForm({
                                    ...connexionForm,
                                    email: e.target.value
                                })}
                                required
                            />
                            
                            <label htmlFor="password">Mot de passe : </label>
                            <input 
                                id='password' 
                                type="password"
                                value={connexionForm.password}
                                onChange={(e) => setConnexionForm({
                                    ...connexionForm,
                                    password: e.target.value
                                })}
                                required
                            />

                            <button type='submit'>Se connecter</button>
                        </form>

                        {responseMessage && (
                            <p className={`response-message ${responseType}`}>
                                {responseMessage}
                            </p>
                        )}
                    </div>
                    <div className='login-right-section'>
                        <h5>Heureux de vous revoir !</h5>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Connexion;