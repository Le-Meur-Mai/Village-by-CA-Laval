import '../styles/Footer.css';
import logoBlanc from '../assets/logo_blanc.png';

const Footer = () => {
    return (
        <footer>
            <div className='upperPart'>
                <div className='leftPart'>
                    <a href="/index"><img src = { logoBlanc } alt="logo du Village By CA" className='logo' /></a>
                    <ul>
                        <li><a href="/startups">Startups</a></li>
                        <li><a href="/partenaires">Partenaires</a></li>
                        <li><a href="/agenda">Agenda</a></li>
                        <li><a href="/locations">Locaux</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                    <div className='vl'></div>
                    <a href="/login">Connexion</a>
                </div>
                <div className='rightPart'>
                    <img src="/" alt="LinkedIn" />
                    <img src="/" alt="Instagram" />
                </div>
            </div>
            <div className='bottomPart'>
                <p>2024 Village By CA - TOUS DROITS RESERVES</p>
                <a href="/">Mention Légales</a>
            </div>
        </footer>
    )
}

export default Footer;