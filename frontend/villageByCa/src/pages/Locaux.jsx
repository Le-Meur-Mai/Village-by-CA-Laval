import '../styles/page.css';
import '../styles/LocationCard.css';
import '../styles/Locaux.css';
import video from "../assets/videoVillageByCa.png";

import LocationCard from '../components/LocationCard.jsx';
import Header from '../components/Header.jsx';
import LazyYouTube from '../components/LazyYoutube.jsx';
import PresentationPage from '../components/PresentationPage.jsx';
import PreFooter from '../components/PreFooter.jsx';
import Footer from '../components/Footer.jsx';

import { useEffect, useState } from 'react';

const Locaux = () => {
    /* On créer un useState qui va contenir toutes nos partenaires*/
    const [locations, setLocations] = useState([]);

    // On va récupérer les partenaires après le chargement de la page
    useEffect (() => {
            const fetchLocations = async () => {
                const result = await fetch('http://localhost:3000/locations');
                /* On convertit la promesse en json*/
                const jsonResult = await result.json()
                setLocations(jsonResult);
                }
                /* On appelle la fonction */
                fetchLocations();
    }, []);
        
    return (
        <div className='page'>
            <Header />
            <main>
                <PresentationPage 
                    title='Nos Bureaux' 
                    text="Nos startups s’épanouissent dans nos locaux, où elles peuvent pleinement 
                    se développer et créer un réseau. C’est un cadre idéal pour rassembler et développer 
                    votre startup." />
                <h2 className='section-title-left'>Les Locaux:</h2>
                <div className='youtube-video-container'>
                    <LazyYouTube videoId="7MEqwSoohi8" />
                </div>
                <h2 className='section-title-right'>Location de salles/bureaux:</h2>
                <div className="locations-container">
                    {locations.map(location => (
                                <LocationCard 
                                key={location.id}
                                title={location.title}
                                price={location.price}
                                size={location.size}
                                picture={location.picture}
                                link={`http://localhost:5173/locations/${location.id}`}
                                />
                    ))}
                </div>
            </main>
            <PreFooter 
                title="Vous voulez louer une de nos salles ?" 
                text="Contactez-nous pour découvrir nos offres !"
                buttontext="Contactez-nous" />
            <Footer />
        </div>
    )
}

export default Locaux;