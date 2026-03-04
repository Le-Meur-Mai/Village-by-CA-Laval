import { Link } from 'react-router-dom';

import '../styles/Footer.css';
import logoBlanc from '../assets/logo_blanc.png';

const Footer = () => {
    return (
        <footer>
            <div className='upperPart'>
                <div className='leftPart'>
                    <Link to="/"><img src = { logoBlanc } alt="logo du Village By CA" className='logo' /></Link>
                    <ul>
                        <li><Link to="/startups">Startups</Link></li>
                        <li><Link to="/partenaires">Partenaires</Link></li>
                        <li><Link to="/agenda">Agenda</Link></li>
                        <li><Link to="/locations">Locaux</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                    <div className='vl'></div>
                    <Link to="/login">Connexion</Link>
                </div>
                <div className='rightPart'>
                    <img src="/" alt="LinkedIn" />
                    <img src="/" alt="Instagram" />
                </div>
            </div>
            <div className='bottomPart'>
                <p>2024 Village By CA - TOUS DROITS RESERVES</p>
                <Link to="/">Mention Légales</Link>
            </div>
        </footer>
    )
}

export default Footer;