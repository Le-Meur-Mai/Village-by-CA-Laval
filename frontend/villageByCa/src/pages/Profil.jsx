import '../styles/page.css';
import '../styles/Profil.css';

import { useEffect, useState } from 'react';

import Header from '../components/Header';
import PresentationPage from '../components/PresentationPage';
import UserInfoProfil from '../components/UserInfoProfil';
import StartUpInfoProfil from '../components/StartUpInfoProfil';
import QuoteCard from '../components/QuoteCard';
import Button from '../components/buttons/button';
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
                <div className='profil-all-info'>
                    <div className='profil-userInfo'>
                        <h1>Mes Informations</h1>
                        <div className='profil-userInfo-cards-container'>
                            <UserInfoProfil user={ userInfo.user } />
                            <StartUpInfoProfil startup={ userInfo.startUp } />
                        </div>
                        <Button text='Modifier' path='/profil/update'/>
                    </div>
                    <div className='profil-quotes'>
                        <h2><strong>Mes Citations</strong></h2>
                        <div className='profil-quote-container'>
                            {userInfo.quotes.map((quote) => (
                                <QuoteCard 
                                    logo={quote.logo} 
                                    name={quote.startUp} 
                                    firstName={quote.firstName}
                                    lastName={quote.lastName}
                                    description={quote.description}
                                />
                            ))}
                        </div>
                        <Button text='Modifier'/>
                    </div>
                </div>
                <hr />
                { JSON.stringify(userInfo, null, 2) }
            </main>
            <Footer />   
        </div>
    )
}

export default Profil;