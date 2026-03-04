import '../styles/page.css'

import Header from '../components/Header.jsx';
import PresentationPage from '../components/PresentationPage.jsx';
import StartupPopup from '../components/StartupPopUp.jsx';
import PreFooter from '../components/PreFooter.jsx';
import Footer from '../components/Footer.jsx';
import { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import Tag from '../components/Tag.jsx';


const Startups = () => {
    /* On créer un useState qui va contenir toutes nos Startups et nos types*/
    const [startups, setStartups] = useState([]);
    const [types, setTypes] = useState([])
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState(null);
    // Pour le filtrage
    const [selectedType, setSelectedType] = useState(null);
    const [showAlumni, setShowAlumni] = useState(false);

    /* On va chercher toutes nos startups dans la base de données lors
    du premier chargement de la page */
    useEffect (() => {
        const fetchStartupsAndTypes = async () => {
            const result = await fetch('http://localhost:3000/startups');
            /* On convertit la promesse en json*/
            const jsonResult = await result.json()
            setStartups(jsonResult.startUps);
            setTypes(jsonResult.types); 
            }
            /* On appelle la fonction */
            fetchStartupsAndTypes();
        }, []);

    // Fonction pour ouvrir le popup
    const openPopup = async (id) => {
        const res = await fetch(`http://localhost:3000/startups/${id}`);
        const data = await res.json();
        setPopupData(data);
        setShowPopup(true);
    };

    // Fonction pour filtrer les startups
    const filteredStartups = startups.filter(startup => {
        if (selectedType && !startup.types.some(t => t.name === selectedType.name)) {
            return false;
        }
        if (showAlumni && !startup.isAlumni) {
            return false;
        }
        return true;
    });

    return (
        <div className='page'>
            <Header />
            <main>
                <PresentationPage 
                    title='Startups' 
                    text='Chaque année, nous accompagnons des dizaines de startups dans leur croissance 
                    et leurs ambitions. Entre mentorat, mise en réseau et soutien stratégique, nous créons 
                    les conditions idéales pour accélérer leurs projets. Cette dynamique collective fait émerger 
                    des innovations qui transforment durablement nos territoires.' />
                <div className="filters">
                    <Tag 
                        name="Alumni"
                        color="88d783"
                        active={showAlumni}
                        onClick={() => setShowAlumni(!showAlumni)}
                    />
                    {types.map(type => (
                        <Tag 
                            key={type.id}
                            name={type.name}
                            color={type.color}
                            active={selectedType?.name === type.name}
                            // Interrupteur, désactive un filtre ou le réactive
                            onClick={() => setSelectedType(
                                selectedType?.name === type.name ? null : type
                            )}
                        />
                    ))}
                </div>
                {/* On parcourt l'objet avec map, on assigne un id pour identifier chaque startups*/}
                {filteredStartups.map(startup => (
                    <Card 
                        key={startup.id}
                        name={startup.name}
                        description={startup.description}
                        logo={startup.logo}
                        color={startup.types[0]?.color}
                        onClick={() => openPopup(startup.id)}
                    />
                ))}
                {/*Pour activer le pop-up*/}
                {showPopup && (
                    <StartupPopup 
                        data={popupData}
                        onClose={() => setShowPopup(false)}
                    />
                )}
            </main>
            <PreFooter 
                title="Envie de vous faire accompagner ?" 
                text="Contactez-nous maintenant et explorons ensemble tout le potentiel de votre entreprise !"
                buttontext="Contactez-nous" />
            <Footer />
        </div>
    )
}

export default Startups;
