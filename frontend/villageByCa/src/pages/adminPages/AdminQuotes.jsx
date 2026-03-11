import '../../styles/page.css'

import Header from "../../components/Header";
import PresentationPage from '../../components/PresentationPage.jsx';
import Footer from "../../components/Footer";
import { useEffect, useState } from 'react';
import QuoteCard from '../../components/QuoteCard';

const AdminQuotes = () => {

    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        const getAllQuotes = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/citations', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'},
                    credentials: 'include'
                });
                const allQuotes = await response.json();
                setQuotes(allQuotes);
            } catch (error) {
                console.error(error);
            }
        }
        getAllQuotes();     
    }, [])

    return (
        <div className="page">
            <Header />
            <main>
                <PresentationPage 
                    title = 'Gestion des Citations'
                    text = ''
                />
                <div className='quote-align'>
                    {quotes.map(quote => 
                        <QuoteCard
                        key={quote.id}
                        id={quote.id}
                        logo={quote.startUp?.logo}
                        name={quote.startUp?.name}
                        firstName={quote.firstName}
                        lastName={quote.lastName}
                        description={quote.description}
                        canBeModified={true}
                        onUpdate={setQuotes}/>
                    )}
                </div>

            </main>
            <Footer />
        </div>
    )
}

export default AdminQuotes;