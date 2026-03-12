// Importation du fichier CSS global pour la mise en page
import '../../styles/page.css'

import '../../styles/AdminQuotes.css'

// Importation des composants réutilisables de l'application
import Header from "../../components/Header";
import PresentationPage from '../../components/PresentationPage.jsx';
import Footer from "../../components/Footer";

// Hooks React : useEffect pour les effets de bord, useState pour l'état local
import { useEffect, useState } from 'react';

// Composant QuoteCard pour afficher une citation
import QuoteCard from '../../components/QuoteCard';
import NewQuoteButton from '../../components/buttons/NewQuoteButton.jsx';

const AdminQuotes = () => {

    // État local contenant la liste des citations récupérées depuis l'API
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        // Fonction async déclarée à l'intérieur du useEffect
        // (car useEffect ne peut pas être directement async)
        const getAllQuotes = async () => {
            try {
                // Appel à l'API back-end pour récupérer toutes les citations
                // "credentials: 'include'" permet d'envoyer les cookies de session
                // (nécessaire pour les routes protégées de l'espace admin)
                const response = await fetch('http://localhost:3000/admin/citations', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'},
                    credentials: 'include'
                });

                // Conversion de la réponse HTTP en objet JavaScript
                const allQuotes = await response.json();

                // Mise à jour de l'état avec les citations récupérées,
                // ce qui déclenche un re-render du composant
                setQuotes(allQuotes);
            } catch (error) {
                // En cas d'erreur réseau ou de parsing, on log sans crasher l'app
                console.error(error);
            }
        }

        // Appel immédiat de la fonction
        getAllQuotes();     

    }, []) // [] = dépendances vides : le useEffect ne s'exécute qu'une seule fois

    return (
        // Conteneur principal avec la classe CSS "page"
        <div className="page">
            <Header />
            <main>
                {/* Bandeau de présentation avec titre et texte vide (pas de sous-titre ici) */}
                <PresentationPage 
                    title='Gestion des Citations'
                    text=''
                />
                <div className='new-quote-admin-section'>
                    <NewQuoteButton onUpdate={setQuotes} />
                </div>

                {/* Conteneur alignant les cartes de citations */}
                <div className='quote-align'>
                    {/* Itération sur le tableau de citations pour afficher une QuoteCard par entrée */}
                    {quotes.map(quote => 
                        <QuoteCard
                            key={quote.id}           // Clé unique requise par React pour optimiser le rendu des listes
                            id={quote.id}
                            logo={quote.startUp?.logo}   // Opérateur ?. : évite un crash si startUp est null/undefined
                            name={quote.startUp?.name}   // Idem
                            firstName={quote.firstName}
                            lastName={quote.lastName}
                            description={quote.description}
                            canBeModified={true}         // Mode admin : autorisation de modifier la citation
                            onUpdate={setQuotes}         // Passage de setQuotes pour permettre à QuoteCard de mettre à jour la liste
                        />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default AdminQuotes;