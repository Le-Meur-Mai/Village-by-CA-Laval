import '../styles/page.css'

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useEffect, useState } from 'react';

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
            {/* On parcourt l'objet avec map, on assigne un id pour identifier chaque startups*/}
            {startups.map(startup => (
                <p key={ startup.id }>{ startup.name }</p>
            ))}
            <Footer />
        </div>
    )
}

export default Startups;