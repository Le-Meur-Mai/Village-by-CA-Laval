import '../styles/page.css'

import Header from '../components/Header.jsx';
import PresentationPage from '../components/PresentationPage.jsx';
import Footer from '../components/Footer.jsx';

const Partenaires = () => {
    return (
        <div className='page'>
            <Header />
            <PresentationPage 
                title="Partenaires" 
                text="Nos entreprises ambassadrices sont toujours en quête d'innovation 
                et c'est pourquoi elles ont choisi le Village by CA. Elles soutiennent et 
                rendent possible l'aventure Village pour 10 à 15 porteurs de projets chaque année, 
                en subventionnant près de 70% du coût de cet accompagnement à la structuration." />
            <Footer />
        </div>
    )
}

export default Partenaires;