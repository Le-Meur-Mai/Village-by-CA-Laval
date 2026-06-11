import '../styles/page.css';

import events from "../assets/Events.png";

import PresentationPage from '../components/PresentationPage.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import PreFooter from '../components/PreFooter.jsx';
import PostCard from '../components/PostCard.jsx';
import Calendars from '../components/Calendars.jsx';

import { useEffect, useState } from 'react';

const Agenda = () => {
    const [posts, setPosts] = useState([]);
    const [events, setEvents] = useState([]);
    useEffect (() => {
                const fetchStartupsPostsAndEvents = async () => {
                    const result = await fetch('http://localhost:3000/agenda');
                    /* On convertit la promesse en json*/
                    const jsonResult = await result.json()
                    setPosts(jsonResult.posts);
                    setEvents(jsonResult.events);
                    }
                    /* On appelle la fonction */
                    fetchStartupsPostsAndEvents();
                }, []);
    return (
        <div className='page'>
            <Header />
            <main>
                <PresentationPage 
                    title="Agenda" 
                    text="Le Village by Ca participe à de nombreux évenements et propose
                    des ateliers personnalisés pour accompagner chaque startup, afin de faciliter leur évolution." />
                <h2 className='section-title-left'>Calendrier</h2>
                <Calendars events={events}/>
                <h2 className='section-title-right'>Actualités du Village</h2>

                <div className='quote-align'>
                    {posts.map(post => (
                        <PostCard
                        key={post.id}
                        post={post}
                        text={'Lire'}
                        path={`/agenda/${post.id}`}/>
                    ))}
                </div>
            </main>
            <PreFooter
            title="Envie de participer à un évenement ?"
            text="Contactez-nous !"
            buttontext="Nous contacter"/>
            <Footer />
        </div>
    )
}

export default Agenda;