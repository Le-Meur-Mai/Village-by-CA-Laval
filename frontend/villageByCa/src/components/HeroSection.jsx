import '../styles/HeroSection.css';

import Button from './buttons/button';
import VillageImage from '../assets/HeroImage.avif';

const HeroSection = () => {
    return (
        <div className='hero-section-container'>
            {/* C'est le Largest Contentful Paint (LCP) de la page, la plus grosse image de la page et la première
            à apparaitre. On lui dit donc de la charger en priorité par rapport aux autres, et que son décryptage
            ne bloque pas le rendu de la page avec fetchpriority et decoding */}
            <img src= { VillageImage }  fetchPriority="high" decoding="async" alt="Vue du Village by CA" className='hero-section-image'/>
            <div className='hero-section-content'>
                <h1 className='title-hero-section'>Accélérateur d'innovations pour Startups et entreprises</h1>
                <Button className='cta-hero-section' text="Contactez-nous" path='/contact' />
            </div>
        </div>
    )
}

export default HeroSection;
