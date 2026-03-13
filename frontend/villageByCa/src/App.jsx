import './App.css'
import { Routes, Route } from "react-router-dom";
// Pour que la fenêtre remonte en haut de la page
import ScrollToTop from "./components/ScrollToTop";


import Index from './pages/Index.jsx'
import Startups from './pages/Startups.jsx';
import Partenaires from './pages/Partenaires.jsx';
import Agenda from './pages/Agenda.jsx';
import ArticleDetails from './pages/ArticleDetails.jsx';
import Contact from './pages/Contact.jsx';
import Locaux from './pages/Locaux.jsx';
import LocationsDetails from './pages/LocationsDetails.jsx'
import Connexion from './pages/Connexion.jsx';
import Profil from './pages/Profil.jsx';
import AdminWelcomePage from './pages/AdminWelcomePage.jsx';
import AdminUsers from './pages/adminPages/AdminUsers.jsx';
import AdminStartups from './pages/adminPages/AdminStartups.jsx';
import AdminPartners from './pages/adminPages/AdminPartners.jsx';
import AdminPosts from './pages/adminPages/AdminPosts.jsx';
import AdminQuotes from './pages/adminPages/AdminQuotes.jsx';
import AdminTags from './pages/adminPages/AdminTags.jsx';

const App = () => {
  return (
    // on met <> Pour avoir un seul élément parent qui n'a pas d'incidence sur le code
    <>

      <ScrollToTop />

      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/startups' element={<Startups />} />
        <Route path='/partenaires' element={<Partenaires />} />
        <Route path='/agenda' element={<Agenda />} />
        <Route path='/agenda/:id' element={<ArticleDetails/>}/>
        <Route path='/locations' element={<Locaux />} />
        <Route path='/locations/:id' element={<LocationsDetails/>}/>
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Connexion />} />
        <Route path='/profil' element={<Profil />} />
        <Route path='/admin' element={<AdminWelcomePage />} />
        <Route path='/admin/utilisateurs' element={<AdminUsers />} />
        <Route path='/admin/startups' element={<AdminStartups />} />
        <Route path='/admin/partenaires' element={<AdminPartners />} />
        <Route path='/admin/posts' element={<AdminPosts />} />
        <Route path='/admin/citations' element={<AdminQuotes />} />
        <Route path='/admin/types' element={<AdminTags />} />
        <Route path='/admin/profil' element={<Profil />} />
      </Routes>
    </>
  )
}

export default App;