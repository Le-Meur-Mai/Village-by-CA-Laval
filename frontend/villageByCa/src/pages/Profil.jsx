import '../styles/page.css';
import '../styles/Profil.css';

import { useEffect, useState } from 'react';

import Header from '../components/Header';
import PresentationPage from '../components/PresentationPage';
import UserInfoProfil from '../components/UserInfoProfil';
import StartUpInfoProfil from '../components/StartUpInfoProfil';
import QuoteCard from '../components/QuoteCard';
import Footer from '../components/Footer';
import NewQuoteButton from '../components/buttons/NewQuoteButton';

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
                            <UserInfoProfil user={userInfo.user} onUpdate={setUserInfo} />
                            <StartUpInfoProfil startup={userInfo.startUp} onUpdate={setUserInfo} />
                        </div>
                    </div>
                    <div className='profil-quotes'>
                        <h1>Mes Citations</h1>
                        <NewQuoteButton user={userInfo.user} onUpdate={setUserInfo}/>
                        <div className='quote-align'>
                            {userInfo.quotes.map((quote) => (
                                <QuoteCard 
                                    key={quote.id}
                                    id={quote.id}
                                    logo={quote.logo} 
                                    name={quote.startUp} 
                                    firstName={quote.firstName}
                                    lastName={quote.lastName}
                                    description={quote.description}
                                    canBeModified={true}
                                    onUpdate={setUserInfo}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />   
        </div>
    )
}

export default Profil;