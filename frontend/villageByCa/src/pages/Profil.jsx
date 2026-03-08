import '../styles/page.css';

import { useEffect, useState } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import PresentationPage from '../components/PresentationPage';

const Profil = () => {

    const [userInfo, setUserInfo] = useState(null);

        const fecthProfil = async () => {

        try {
            const response = await fetch('http://localhost:3000/auth/profil', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json'},
                credentials: "include"
            })

            if (!response.ok) {
                console.error("Erreur HTTP :", response.status);
                return;
            }
            
            const profilData = await response.json();
            setUserInfo(profilData);
            
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fecthProfil();
    }, []);

    return (
        <div className='page'>
            <Header />
            <main>
                <PresentationPage title='Bonjour machin' text='' />
                <p>Page Profil !</p>
                { JSON.stringify(userInfo, null, 2) }
            </main>
            <Footer />
            
        </div>

    )
}

export default Profil;