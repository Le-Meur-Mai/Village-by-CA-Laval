import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

import '../styles/Header.css'
import logoBlanc from '../assets/logo_blanc.webp';

const Header = () => {
    const { auth, loading } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <header className={`header ${menuOpen ? "open" : ""}`}>
            <div className='navLeft'>
                <Link to="/"><img src= { logoBlanc } alt="logo du Village By CA" className='logo-header' /></Link>
            </div>

            {/* --- Le logo du menu Burger --- */}
            <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* --- Menu Classique --- */}
            <div className='navCenter'>
                <div className='navBox'>
                    <nav className='navbar'>
                        <Link to="/startups" onClick={() => setMenuOpen(false)}>Startups</Link>
                        <Link to="/partenaires" onClick={() => setMenuOpen(false)}>Partenaires</Link>
                        <Link to="/agenda" onClick={() => setMenuOpen(false)}>Agenda</Link>
                        <Link to="/locations" onClick={() => setMenuOpen(false)}>Nos Bureaux</Link>
                    </nav>
                </div>
            </div>
            <div className='navRight'>
                {!loading && (
                    auth
                        ? auth.isAdmin
                            ? <Link to="/admin" className='profil' onClick={() => setMenuOpen(false)}>Mon espace</Link>
                            : <Link to="/profil" className='profil' onClick={() => setMenuOpen(false)}>Mon espace</Link>
                        : null
                )}
            <Link to="/contact" className='contact' onClick={() => setMenuOpen(false)}><b>Contact</b></Link>
            </div>
        </header>
    )
}

export default Header;
