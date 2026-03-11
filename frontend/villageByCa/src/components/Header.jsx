import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

import '../styles/Header.css'
import logoBlanc from '../assets/logo_blanc.png';

const Header = () => {
    const { auth, loading } = useAuth();
    return (
        <header>
            <div className='navLeft'>
                <Link to="/"><img src= { logoBlanc } alt="logo du Village By CA" className='logo-header' /></Link>
            </div>
            <div className='navCenter'>
                <div className='navBox'>
                    <nav className='navbar'>
                        <Link to="/startups">Startups</Link>
                        <Link to="/partenaires">Partenaires</Link>
                        <Link to="/agenda">Agenda</Link>
                        <Link to="/locations">Nos Bureaux</Link>
                    </nav>
                </div>
            </div>
            <div className='navRight'>
                {!loading && (
                    auth
                        ? auth.isAdmin
                            ? <Link to="/admin" className='profil'>Mon espace</Link>
                            : <Link to="/profil" className='profil'>Mon espace</Link>
                        : null
                )}
            <Link to="/contact" className='contact'><b>Contact</b></Link>
            </div>
        </header>
    )
}

export default Header;
