import '../styles/page.css';
import '../styles/AdminWelcomePage.css'

import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import PresentationPage from '../components/PresentationPage.jsx';

const AdminWelcomePage = () => {
    return (
        <div className='page'>
            <Header/>
           <PresentationPage
           title="Bonjour Amandine"
           text="Que voulez-vous faire aujourd'hui ?"/>
           <h2 className='section-admin-title-left'>Gestion des utilisateurs</h2>
           <h2 className='section-admin-title-left'>Gestion des startups</h2>
           <h2 className='section-admin-title-left'>Gestion des partenaires</h2>
           <h2 className='section-admin-title-left'>Gestion des posts</h2>
           <h2 className='section-admin-title-left'>Gestion des startups</h2>
           <h2 className='section-admin-title-left'>Gestion des citations</h2>
           <h2 className='section-admin-title-left'>Gestion des types</h2>
           <h2 className='section-admin-title-left'>Profil administrateur</h2>
           <Footer/>
        </div>
    )
}

export default AdminWelcomePage;
