import '../styles/HeroSection.css';

import VillageImage from '../assets/HeroImage.png';

const HeroSection = () => {
    return (
        <div className='hero-section-container'>
            <img src= { VillageImage } alt="Vue du Village by CA" className='village-image'/>
        </div>
    )
}

export default HeroSection;