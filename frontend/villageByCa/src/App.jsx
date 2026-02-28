import './App.css'
import { Routes, Route } from "react-router-dom";

import Index from './pages/Index.jsx'
import Startups from './pages/Startups.jsx';
import Partenaires from './pages/Partenaires.jsx';
import Agenda from './pages/Agenda.jsx';
import Contact from './pages/Contact.jsx';
import Locaux from './pages/Locaux.jsx';

const App = () => {
  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/startups' element={<Startups />} />
        <Route path='/partenaires' element={<Partenaires />} />
        <Route path='/agenda' element={<Agenda />} />
        <Route path='/locations' element={<Locaux />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App;