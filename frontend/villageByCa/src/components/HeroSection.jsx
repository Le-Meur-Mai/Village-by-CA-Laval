import '../styles/HeroSection.css';

import Button from './buttons/button';
import VillageImage from '../assets/HeroImage.png';

const HeroSection = () => {
    return (
        <div className='hero-section-container'>
            <img src= { VillageImage } alt="Vue du Village by CA" className='village-image'/>
            <div className='top'>
                <h3 className='title'>Découvrez les Startups de demain</h3>
            </div>
            <div className='bottom'>
                <Button text="Découvrez les Startups" />
            </div>
        </div>
    )
}

export default HeroSection;