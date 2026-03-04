import '../styles/HeroSection.css';

import Button from './buttons/button';
import VillageImage from '../assets/HeroImage.png';

const HeroSection = () => {
    return (
        <div className='hero-section-container'>
            <img src= { VillageImage } alt="Vue du Village by CA" className='hero-section-image'/>
            <div className='hero-section-content'>
                <h1 className='title-hero-section'>Accélérateur d'innovations pour Startups et entreprises</h1>
                <Button className='cta-hero-section' text="Contactez-nous" path='/contact' />
            </div>
        </div>
    )
}

export default HeroSection;