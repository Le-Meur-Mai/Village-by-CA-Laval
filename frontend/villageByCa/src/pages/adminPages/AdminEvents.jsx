import '../../styles/page.css'

import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import Calendars from "../../components/Calendars.jsx"
import PresentationPage from '../../components/PresentationPage';
import { useEffect, useState } from 'react';
import { useNavigate} from "react-router-dom";
import {useAuth} from '../../contexts/AuthContext.jsx';

const AdminEvents = () => {
    const navigate = useNavigate();

    const { auth, loading } = useAuth();
    if (!loading) {
        if (!auth || !auth.isAdmin) {
            navigate('/login');
        }
    }

    const [allEvents, setAllEvents] = useState([]);

    useEffect (() => {
        const fetchAllEvents = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/evenements', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Admin non connecté.');
                }
                
                const eventsData = await response.json();
    
                setAllEvents(eventsData);
    
            } catch (error) {
                console.error(error);
                navigate('/login');
            }
        }

        fetchAllEvents();

    }, [])

    // Pour éviter qu'il accède a auth.isAdmin s'il n'a pas fini de charger
    if (loading || !auth) {
        return (null);
    }

    return (
        <div className="page">
            <Header />
            <main>
                <PresentationPage title='Gestion des évènements' text=''/>
                <Calendars events={allEvents} admin={auth.isAdmin}/>
            </main>
            <Footer />
        </div>
    )
}

export default AdminEvents;
