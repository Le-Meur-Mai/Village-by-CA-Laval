import '../../styles/page.css';
import '../../styles/LocationCard.css';

import LocationCard from '../../components/LocationCard.jsx';
import Header from '../../components/Header.jsx';
import PresentationPage from '../../components/PresentationPage.jsx';
import Footer from '../../components/Footer.jsx';
import LocationCreatePopUp from '../../components/LocationCreatePopUp.jsx';
import LocationPopUp from '../../components/LocationPopUp.jsx';

import { useNavigate} from "react-router-dom";
import { useEffect, useState } from 'react';

const AdminLocations = () => {
    const navigate = useNavigate();
    /* On créer un useState qui va contenir toutes nos locations*/
    const [locations, setLocations] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState(null);
    const [showCreatePopup, setShowCreatePopup] = useState(false);


    // On va récupérer les partenaires après le chargement de la page
   useEffect (() => {
        const fetchLocations = async () => {
            try {
                const result = await fetch('http://localhost:3000/admin/locations', {
                    credentials: "include",
                });
                if (!result.ok) {
                    throw new Error('Admin non connecté.');
                }
                /* On convertit la promesse en json*/
                const jsonResult = await result.json()
                setLocations(jsonResult);
                } catch (error) {
                    navigate('/login');
                }
                /* On appelle la fonction */
            }
        fetchLocations();
    }, []);

    // Fonction pour chercher les info de la popup
    const openPopup = async (id) => {
        const res = await fetch(`http://localhost:3000/admin/locations/${id}`, {
            credentials: "include"
        });
        const data = await res.json();
        setPopupData(data);
        setShowPopup(true);
    };
        
    return (
        <div className='page'>
            <Header />
            <main>
                <PresentationPage 
                    title='Locations de salles' 
                    text="" 
                />

                <button className="button-to-create"onClick={() => setShowCreatePopup(true)}>+</button>
                {/*Quand la popUp de création est activée */}
                {showCreatePopup && (
                    <LocationCreatePopUp
                        onClose={() => setShowCreatePopup(false)}
                        onCreate={(newLocation) => setLocations(prev => [...prev, newLocation])}
                    />
                )}

                <div className="locations-container">
                    {locations.map(location => (
                                <LocationCard 
                                key={location.id}
                                id={location.id}
                                title={location.title}
                                price={location.price}
                                size={location.size}
                                picture={location.picture}
                                link={`/admin/locations`}
                                onClick={() => openPopup(location.id)}
                                />
                    ))}
                </div>
                {/*Pour activer le pop-up*/}
                    {showPopup && (
                        <LocationPopUp
                            location={popupData}
                            onClose={() => setShowPopup(false)}
                            onUpdate={(updater) => {
                                setLocations(prev => {
                                    const next = updater(prev);
                                    // On en profite pour mettre à jour popupData avec la valeur fraîche
                                    const updatedPopup = next.find(l => l.id === popupData.id);
                                    if (updatedPopup) setPopupData(updatedPopup);
                                    return next;
                                });
                            }}
                            // On remonte le DELETE au composant parent
                            onDelete={(id) => setLocations(prev => prev.filter(l => l.id !== id))}
                        />
                    )}
            </main>
            <Footer />
        </div>
    )
}

export default AdminLocations;
