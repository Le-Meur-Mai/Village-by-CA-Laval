import '../styles/HeroSection.css';

import Button from './buttons/button';
import VillageImage from '../assets/HeroImage.png';

const HeroSection = () => {
    return (
        <div className='hero-section-container'>
            <img src= { VillageImage } alt="Vue du Village by CA" className='village-image'/>
            <div className='top'>
                <h2 className='title'>Accélérateur d'innovations pour Start-Up et entreprises</h2>
            </div>
            <div className='bottom'>
                <Button text="Contactez-nous" />
            </div>
        </div>
    )
}

export default HeroSection;