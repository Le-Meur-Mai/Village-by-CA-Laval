import '../styles/page.css'
import '../styles/PresentationPage.css'
// Importation des composants
import Header from '../components/Header.jsx';
import PresentationPage from '../components/PresentationPage.jsx';
import PreFooter from '../components/PreFooter.jsx';
import Footer from '../components/Footer.jsx';
import Card from '../components/Card.jsx';

import { useEffect, useState } from 'react';

const Partenaires = () => {
    /* On créer un useState qui va contenir toutes nos partenaires*/
    const [partners, setPartners] = useState([]);

    // On va récupérer les partenaires après le chargement de la page
    useEffect (() => {
            const fetchPartners = async () => {
                const result = await fetch('http://localhost:3000/partenaires');
                /* On convertit la promesse en json*/
                const jsonResult = await result.json()
                setPartners(jsonResult);
                }
                /* On appelle la fonction */
                fetchPartners();
    }, []);

    const experts = partners.filter(partner => (partner.financialAid > 0.00));
    const classics = partners.filter(partner => (partner.financialAid === 0.00))

    return (
        <div className='page'>
            <Header />
            <main>
                <PresentationPage 
                    title="Partenaires" 
                    text="Nos entreprises ambassadrices sont toujours en quête d'innovation 
                    et c'est pourquoi elles ont choisi le Village by CA. Elles soutiennent et 
                    rendent possible l'aventure Village pour 10 à 15 porteurs de projets chaque année, 
                    en subventionnant près de 70% du coût de cet accompagnement à la structuration." />
                <h2 className='section-title-left'>Partenaires Experts:</h2>
                <div className="presentation-page">
                    {/* On parcourt l'objet avec map, on assigne un id pour identifier chaque partenaires*/}
                    {experts.map(partner => (
                        <Card 
                        key={partner.id}
                        name={partner.name}
                        description={partner.description}
                        logo={partner.logo}
                        color="CCF2B1"
                        onClick={() => window.open(partner.website, "_blank", "noopener,noreferrer")}
                        />
                    ))}
                </div>
                <h2 className='section-title-right'>Partenaires:</h2>
                <div className="presentation-page">
                    {classics.map(partner => (
                        <Card 
                        key={partner.id}
                        name={partner.name}
                        description={partner.description}
                        logo={partner.logo}
                        color="CCF2B1"
                        onClick={() => window.open(partner.website, "_blank", "noopener,noreferrer")}
                        />
                    ))}
                </div>
            </main>
            <PreFooter
                title="Vous voulez devenir un de nos partenaires" 
                text="Contactez-nous dès maintenant !"
                buttontext="Contactez-nous" />
            <Footer />
        </div>
    )
}

export default Partenaires;