import '../../styles/page.css';
import '../../styles/PresentationPage.css';
import '../../styles/AdminPartners.css';

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PresentationPage from '../../components/PresentationPage';
import Card from '../../components/Card.jsx';
import PartnerPopUp from '../../components/PartnerPopUp.jsx';
import PartnerCreatePopUp from '../../components/PartnerCreationPopUp.jsx';

import { useNavigate} from "react-router-dom";
import { useEffect, useState } from 'react';

const AdminPartners = () => {
    const navigate = useNavigate();
    /* On créer un useState qui va contenir toutes nos partenaires*/
    const [partners, setPartners] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState(null);
    const [showCreatePopup, setShowCreatePopup] = useState(false);

    
    // On va récupérer les partenaires après le chargement de la page
    useEffect (() => {
        const fetchPartners = async () => {
            try {
                const result = await fetch('http://localhost:3000/admin/partenaires', {
                    credentials: "include",
                });
                if (!result.ok) {
                    throw new Error('Admin non connecté.');
                }
                /* On convertit la promesse en json*/
                const jsonResult = await result.json()
                setPartners(jsonResult);
                } catch (error) {
                    navigate('/login');
                }
                /* On appelle la fonction */
            }
        fetchPartners();
    }, []);

    // Fonction pour chercher les info de la popup
    const openPopup = async (id) => {
        const res = await fetch(`http://localhost:3000/admin/partenaires/${id}`, {
            credentials: "include"
        });
        const data = await res.json();
        setPopupData(data);
        setShowPopup(true);
    };
    
    const experts = partners.filter(partner => (partner.financialAid > 0.00));
    const classics = partners.filter(partner => (partner.financialAid === 0.00));
    return (
        <div className="page">
            <Header />
            <main>
                <PresentationPage 
                    title="Partenaires" 
                    text="" />

                <h2 className='section-title-left'>Partenaires Experts:</h2>
                <button className="button-to-create"onClick={() => setShowCreatePopup(true)}>+</button>

                {/*Quand la popUp de création est activée */}
                {showCreatePopup && (
                    <PartnerCreatePopUp
                        onClose={() => setShowCreatePopup(false)}
                        onCreate={(newPartner) => setPartners(prev => [...prev, newPartner])}
                    />
                )}
                <div className="presentation-page">
                    <div className='item-align'>
                        {/* On parcourt l'objet avec map, on assigne un id pour identifier chaque partenaires*/}
                        {experts.map(partner => (
                            <Card 
                                key={partner.id}
                                name={partner.name}
                                description={partner.description}
                                logo={partner.logo}
                                onClick={() => openPopup(partner.id)}
                            />
                        ))}
                    </div>
                </div>
                <h2 className='section-title-right'>Partenaires:</h2>
                <div className="presentation-page">
                    <div className='item-align'>
                        {classics.map(partner => (
                            <Card 
                                key={partner.id}
                                name={partner.name}
                                description={partner.description}
                                logo={partner.logo}
                                onClick={() => openPopup(partner.id)}
                            />
                        ))}
                    </div>
                </div>
                {/*Pour activer le pop-up*/}
                    {showPopup && (
                        <PartnerPopUp
                            partner={popupData}
                            onClose={() => setShowPopup(false)}
                            onUpdate={(updater) => {
                                // updater représente la fonction passée en argument dans partnerPopUp
                                setPartners(updater);  // met à jour la liste des cartes
                                // met à jour aussi la popup avec les nouvelles données
                                setPopupData(prev => ({
                                    ...prev,
                                    ...updater(partners).find(p => p.id === popupData.id)
                                }));
                            }}
                            // On remonte le DELETE au composant parent
                            onDelete={(id) => setPartners(prev => prev.filter(p => p.id !== id))}
                        />
                    )}
            </main>
            <Footer />
        </div>
    )
}

export default AdminPartners;
