import '../styles/page.css';
import '../styles/AdminWelcomePage.css'

import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import PresentationPage from '../components/PresentationPage.jsx';

import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext.jsx';

const AdminWelcomePage = () => {
    const navigate = useNavigate();

    const { auth, loading } = useAuth();
    if (!loading) {
        if (!auth || !auth.isAdmin) {
            navigate('/login');
        }
    }

    return (
        <div className='page'>
            <Header/>
            <main>
                <PresentationPage
                title="Que voulez-vous faire aujourd'hui ?"
                text=""/>
                <Link to='/admin/utilisateurs' className='section-admin-title-left'><h2>Gestion des utilisateurs</h2></Link>
                <Link to='/admin/startups' className='section-admin-title-left'><h2>Gestion des startups</h2></Link>
                <Link to='/admin/partenaires' className='section-admin-title-left'><h2>Gestion des partenaires</h2></Link>
                <Link to='/admin/evenements' className='section-admin-title-left'><h2>Gestion des évènements</h2></Link>
                <Link to='/admin/locations' className='section-admin-title-left'><h2>Gestion des locations</h2></Link>
                <Link to='/admin/citations' className='section-admin-title-left'><h2>Gestion des citations</h2></Link>
                <Link to='/admin/types' className='section-admin-title-left'><h2>Gestion des types</h2></Link>
                <Link to='/admin/posts' className='section-admin-title-left'><h2>Gestion des posts</h2></Link>
                <Link to='/admin/profil' className='section-admin-title-left'><h2>Profil Administrateur</h2></Link>
            </main>
           <Footer/>
        </div>
    )
}

export default AdminWelcomePage;
