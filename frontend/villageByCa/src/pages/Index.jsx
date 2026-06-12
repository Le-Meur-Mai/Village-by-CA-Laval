import '../styles/page.css';


import amandine from '../assets/Amandine.avif';
import ibrahima from '../assets/Ibrahima Barry.avif';
import events from '../assets/Events.png';
import startup_icon from '../assets/startup_icon.webp';
import entreprise_icon from '../assets/entreprise_icon.webp';

import CardFlip from '../components/CardFlip.jsx'
import PostCard from '../components/PostCard.jsx';
import QuoteCard from '../components/QuoteCard.jsx';
import Button from '../components/buttons/button.jsx';
import StartupCarrousel from '../components/StartupCarrousel.jsx';
import Header from '../components/Header.jsx';
import HeroSection from '../components/HeroSection.jsx';
import PreFooter from '../components/PreFooter.jsx';
import Footer from '../components/Footer.jsx';
import CardStaff from '../components/CardStaff.jsx';
import { useEffect, useState } from 'react';

const Index = () => {
    const [startups, setStartups] = useState([]);
    const [posts, setPosts] = useState([]);
    const [quotes, setQuotes] = useState([]);

    useEffect (() => {
            const fetchStartupsPostsAndQuotes = async () => {
                const result = await fetch('http://localhost:3000/');
                /* On convertit la promesse en json*/
                const jsonResult = await result.json()
                setStartups(jsonResult.startUps);
                setPosts(jsonResult.posts);
                setQuotes(jsonResult.quotes);
                }
                /* On appelle la fonction */
                fetchStartupsPostsAndQuotes();
            }, []);
    return (
        <div className='page'>
            <Header />
            <main>
                <HeroSection />
                <h2 className='title-h2-center'>Le Village by CA de Laval</h2> 
                <h3 className='section-title-left'>Coopérer pour Innover</h3>
                <p className='paragraph-center'>Le Village by CA de Laval est un écosystème dynamique dédié à l’accompagnement des startups 
                    en phase de croissance. Cet espace favorise les rencontres entre jeunes entreprises, experts 
                    et partenaires pour accélérer l’innovation sur le territoire. Les startups y trouvent un soutien 
                    personnalisé, allant du mentorat à l’accès à un réseau solide d’acteurs économiques. Le Village 
                    crée ainsi un environnement propice au développement, à l’expérimentation et à la réussite 
                    entrepreneuriale.</p>
                <div className='index-cards-container'>
                    <CardFlip titleFront='Startups' titleBack="Notre programme d'accompagnement" icon={startup_icon} altText="Illustration de la carte Startups">
                        <div>
                            <p>Le Village vous propose un accompagnement adapté au besoin de votre entreprise.</p>
                            <p><strong>Financement</strong>, <strong>Développement</strong>, <strong>Structuration</strong> ou 
                            <strong>Visibilité</strong>, nous intervenons à chaque étape de votre parcours.</p>
                        </div>
                    </CardFlip>
                    <CardFlip titleFront='Entreprise' titleBack="Nos services professionnels" icon={entreprise_icon} altText="Illustration de la carte Entreprise">
                        <div>
                            <p>Besoin d'aide pour développer votre activité ?</p>
                            <p><strong>Location de salles</strong>, <strong>Visibilité</strong>, <strong>Organisation d'évènement</strong>, 
                            nous permettons à votre entreprise de gagner sur tout les tableaux !</p>
                        </div>
                    </CardFlip>
                </div>
                <h3 className='section-title-right'>Rencontrez l'équipe</h3>
                <div className='card-staff-section'>
                    <CardStaff
                    name="Amandine Chemin"
                    image={amandine}
                    job="Maire du Village by CA"/>
                    <CardStaff
                    name="Ibrahima Barry"
                    image={ibrahima}
                    job="Assistant au Maire du Village by CA"/>
                </div>
                <h3 className='section-title-left'>Nous les accompagnons</h3>
                <StartupCarrousel
                startups={startups}/>
                <div className='quote-align'>
                    {quotes.map(quote => (
                        <QuoteCard
                        key={quote.id}
                        logo={quote.startUp?.logo}
                        name={quote.startUp?.name}
                        firstName={quote.firstName}
                        lastName={quote.lastName}
                        description={quote.description}/>
                    ))}
                </div>
                <div className="paragraph-center">
                    <Button 
                    text="En savoir plus"
                    path="http://localhost:5173/startups"/>
                </div>
                <h3 className='section-title-right'>Agenda</h3>
                <h3 className='section-title-left'>Actualités</h3>
                <div className='quote-align'>
                    {posts.map(post => (
                        <PostCard
                        key={post.id}
                        post={post}
                        text='Lire'
                        path={`/agenda/${post.id}`}/>
                    ))}
                </div>
                <div className="paragraph-center button-with-margin-bottom">
                    <Button
                    text="Voir plus d'articles"
                    path="http://localhost:5173/agenda"/>
                </div>
            </main>
            <PreFooter 
                title="Envie de vous faire accompagner ?" 
                text="Contactez-nous maintenant et explorons ensemble tout le potentiel de votre entreprise !"
                buttontext="Contactez-nous" />
            <Footer />
        </div>
    )
}

export default Index;