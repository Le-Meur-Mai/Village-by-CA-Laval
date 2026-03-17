import '../../styles/page.css';
import '../../styles/PresentationPage.css';
import '../../styles/AdminPartners.css';

import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import PresentationPage from '../../components/PresentationPage.jsx';
import Card from '../../components/Card.jsx';
import StartupUpdatePopUp from '../../components/StartUpUpdatePopUp.jsx';
import StartupCreatePopUp from '../../components/StartupCreatePopUp.jsx';

import { useNavigate} from "react-router-dom";
import { useEffect, useState } from 'react';

const AdminStartups = () => {
    const navigate = useNavigate();
    /* On créer un useState qui va contenir toutes nos startups*/
    const [startups, setStartups] = useState([]);
    const [types, setTypes] = useState([]);
    const [users, setUsers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState(null);
    const [showCreatePopup, setShowCreatePopup] = useState(false);

    
    // On va récupérer les startups après le chargement de la page
    useEffect (() => {
        const fetchStartups = async () => {
            try {
                const result = await fetch('http://localhost:3000/admin/startups', {
                    credentials: "include",
                });
                if (!result.ok) {
                    throw new Error('Admin non connecté.');
                }
                /* On convertit la promesse en json*/
                const data = await result.json();
                setTypes(data.types);
                setUsers(data.users);
                setStartups(data.startUps);
                } catch (error) {
                    navigate('/login');
                }
                /* On appelle la fonction */
            }
        fetchStartups();
    }, []);

    // Fonction pour chercher les info de la popup
    const openPopup = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/admin/startups/${id}`, {
                credentials: "include"
            });
            if (!res.ok) {
                    throw new Error('Admin non connecté.');
            }
            const data = await res.json();
            setPopupData(data);
            setShowPopup(true);

        } catch (error) {
            navigate('/admin/startups');
        }
    };
    
    return (
        <div className="page">
            <Header />
            <main>
                <PresentationPage 
                    title="Startups" 
                    text="" />

                <button className="button-to-create" onClick={() => setShowCreatePopup(true)}>+</button>

                {/*Quand la popUp de création est activée */}
                {showCreatePopup && (
                    <StartupCreatePopUp
                        onClose={() => setShowCreatePopup(false)}
                        onCreate={(newStartup) => setStartups(prev => [...prev, newStartup])}
                        types={types}
                        users={users}
                    />
                )}
                <div className="presentation-page">
                    <div className='item-align'>
                        {/* On parcourt l'objet avec map, on assigne un id pour identifier chaque startups*/}
                        {startups.map(startup => (
                            <Card 
                                key={startup.id}
                                name={startup.name}
                                description={startup.description}
                                logo={startup.logo}
                                color={startup.types[0]?.color}
                                onClick={() => openPopup(startup.id)}
                            />
                        ))}
                    </div>
                </div>
                {/*Pour activer le pop-up*/}
                    {showPopup && (
                        <StartupUpdatePopUp
                            startup={popupData}
                            types={types}
                            users={users}
                            onClose={() => setShowPopup(false)}
                            onUpdate={(updater) => {
                                // updater représente la fonction passée en argument dans partnerPopUp
                                setStartups(updater);  // met à jour la liste des cartes
                                // met à jour aussi la popup avec les nouvelles données
                                setPopupData(prev => ({
                                    ...prev,
                                    ...updater(startups).find(s => s.id === popupData.id)
                                }));
                            }}
                            // On remonte le DELETE au composant parent
                            onDelete={(id) => setStartups(prev => prev.filter(s => s.id !== id))}
                        />
                    )}
            </main>
            <Footer />
        </div>
    )
}

export default AdminStartups;
