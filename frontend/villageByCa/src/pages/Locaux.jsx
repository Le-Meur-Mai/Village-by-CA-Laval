import '../styles/page.css'

import Header from '../components/Header.jsx';
import PresentationPage from '../components/PresentationPage.jsx';
import PreFooter from '../components/PreFooter.jsx';
import Footer from '../components/Footer.jsx';

const Locaux = () => {
    return (
        <div className='page'>
            <Header />
            <main>
                <PresentationPage 
                    title='Nos Bureaux' 
                    text="Nos startups s’épanouissent dans nos locaux, où elles peuvent pleinement 
                    se développer et créer un réseau. C’est un cadre idéal pour rassembler et dévelloper 
                    votre startup." />
            </main>
            <PreFooter 
                title="Vous voulez louer une de nos salles ?" 
                text="Contactez-nous pour découvrir nos offres !"
                buttontext="Contactez-nous" />
            <Footer />
        </div>
    )
}

export default Locaux;