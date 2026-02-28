import { Link } from 'react-router-dom';

import '../styles/Header.css'
import logoBlanc from '../assets/logo_blanc.png';

const Header = () => {
    return (
        <header>
            <Link to="/"><img src= { logoBlanc } alt="logo du Village By CA" className='logo-header' /></Link>
            <div className='navBox'>
                <nav className='navbar'>
                    <Link to="/startups">Startups</Link>
                    <Link to="/partenaires">Partenaires</Link>
                    <Link to="/agenda">Agenda</Link>
                    <Link to="/locations">Locaux</Link>
                </nav>
            </div>
            <Link to="/contact"><button className='contact'>Contact</button></Link>
        </header>
    )
}

export default Header;