import '../styles/page.css'

import Header from '../components/Header.jsx';
import HeroSection from '../components/HeroSection.jsx';
import Footer from '../components/Footer.jsx';
import PreFooter from '../components/PreFooter.jsx';

const Index = () => {
    return (
        <div className='page'>
            <Header />
            <HeroSection />
            <h3>Coopérer pour Innover</h3>
            <p>Le Village by CA de Laval est un écosystème dynamique dédié à l’accompagnement des startups 
                en phase de croissance. Cet espace favorise les rencontres entre jeunes entreprises, experts 
                et partenaires pour accélérer l’innovation sur le territoire. Les startups y trouvent un soutien 
                personnalisé, allant du mentorat à l’accès à un réseau solide d’acteurs économiques. Le Village 
                crée ainsi un environnement propice au développement, à l’expérimentation et à la réussite 
                entrepreneuriale.</p>
            <h4>Rencontrez l'équipe</h4>
            <p>Amandine et alternant</p>
            <PreFooter 
                title="Envie de vous faire accompagner ?" 
                text="Contactez-nous maintenant et explorons ensemble tout le potentiel de votre entreprise"
                buttontext="Contactez-nous" />
            <Footer />
        </div>
    )
}

export default Index;