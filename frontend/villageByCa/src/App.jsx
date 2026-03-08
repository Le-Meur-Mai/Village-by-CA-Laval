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
import Connexion from './pages/Connexion.jsx';
import Profil from './pages/Profil.jsx';

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
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Connexion />} />
        <Route path='/profil' element={<Profil />} />
      </Routes>
    </>
  )
}

export default App;