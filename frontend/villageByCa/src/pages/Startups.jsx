import '../styles/page.css'

import Header from '../components/Header.jsx';
import PresentationPage from '../components/PresentationPage.jsx';
import PreFooter from '../components/PreFooter.jsx';
import Footer from '../components/Footer.jsx';
import { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import Tag from '../components/Tag.jsx';

const Startups = () => {
    /* On créer un useState qui va contenir toutes nos Startups */
    const [startups, setStartups] = useState([]);

    /* On va chercher toutes nos startups dans la base de données lors
    du premier chargement de la page */
    useEffect (() => {
        const fetchStartups = async () => {
            const result = await fetch('http://localhost:3000/admin/users');
            /* On convertit la promesse en json*/
            const jsonResult = await result.json()
            setStartups(jsonResult);
            }
            /* On appelle la fonction */
            fetchStartups();
        }, []);

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
                {/* On parcourt l'objet avec map, on assigne un id pour identifier chaque startups*/}
                {startups.map(startup => (
                    <p key={ startup.id }>{ startup.name }</p>
                ))}
                <Tag />
                <Card />
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