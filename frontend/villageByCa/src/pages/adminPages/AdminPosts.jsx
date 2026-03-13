import '../../styles/page.css'

import '../../styles/AdminQuotes.css'

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PresentationPage from '../../components/PresentationPage';
import PostCard from '../../components/PostCard';
import { useState, useEffect } from 'react';

const AdminPosts = () => {

    const [allPosts, setAllPosts] = useState([]);

    useEffect(() => {
        const getAllPosts = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/articles',  {
                    method: 'GET',
                    credentials: 'include'
                })
    
                const data = await response.json();
    
                setAllPosts(data)
            } catch (error) {
                console.error(error);
            }
        }
        getAllPosts()
    }, [])

    return (
        <div className="page">
            <Header />
            <main>
                <PresentationPage title='Gestion des Posts' text='' />

                <div className='quote-align'>
                    {allPosts.map(post =>
                        <PostCard post={ post } />
                    )}
                </div>
    
            </main>
            <Footer />
        </div>
    )
}

export default AdminPosts;