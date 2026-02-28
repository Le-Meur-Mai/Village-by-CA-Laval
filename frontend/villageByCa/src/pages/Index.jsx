import '../styles/page.css'

import Header from '../components/Header.jsx';
import HeroSection from '../components/HeroSection.jsx';
import Footer from '../components/Footer.jsx';

const Index = () => {
    return (
        <div className='page'>
            <Header />
            <HeroSection />
            <Footer />
        </div>
    )
}

export default Index;