import '../styles/page.css'

import Header from '../components/Header.jsx';
import PresentationPage from '../components/PresentationPage.jsx';
import Footer from '../components/Footer.jsx';

const Locaux = () => {
    return (
        <div className='page'>
            <Header />
            <PresentationPage 
                title='Nos Bureaux' 
                text="Nos startups s’épanouissent dans nos locaux, où elles peuvent pleinement 
                se développer et créer un réseau. C’est un cadre idéal pour rassembler et dévelloper 
                votre startup." />
            <Footer />
        </div>
    )
}

export default Locaux;