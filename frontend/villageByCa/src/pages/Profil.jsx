import '../styles/page.css';
import '../styles/Profil.css';

import { useEffect, useState } from 'react';

import Header from '../components/Header';
import PresentationPage from '../components/PresentationPage';
import StartUpInfoProfil from '../components/StartUpInfoProfil';
import Footer from '../components/Footer';

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

    if (!userInfo) {
        return <div className="page">Chargement...</div>;
    }

    return (
        <div className='page'>
            <Header />
            <main>
                <PresentationPage title={`Bonjour ${userInfo.user.name}`} text='' />
                <div className='profil-userInfo'>
                    <div>
                        { userInfo.user.name }
                        { userInfo.user.email }
                    </div>
                    <div>
                        <StartUpInfoProfil startup={ userInfo.startUp } />
                    </div>
                </div>
                { JSON.stringify(userInfo, null, 2) }
            </main>
            <Footer />   
        </div>
    )
}

export default Profil;