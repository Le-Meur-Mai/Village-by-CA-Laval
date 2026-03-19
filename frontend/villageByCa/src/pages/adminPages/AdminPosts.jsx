import '../../styles/page.css'

import '../../styles/AdminQuotes.css'

import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import PresentationPage from '../../components/PresentationPage.jsx';
import PostPopUp from '../../components/PostPopUp.jsx';
import PostCard from '../../components/PostCard.jsx';
import PostCreatePopUp from '../../components/PostCreatePopUp.jsx'
import { useState, useEffect } from 'react';

const AdminPosts = () => {

    // UserState pour récupérer touts les posts
    const [posts, setAllPosts] = useState([]);

    // Userstate pour afficher la popup d'un post existant
    const [showPopup, setShowPopup] = useState(false);
    // UserState pour afficher les données correspondante au post dans la popup
    const [popupData, setPopupData] = useState(null);
    // UserState pour afficher la popup de création d'un article avec un formulaire
    const [showCreatePopup, setShowCreatePopup] = useState(false);

    // On va récupérer tous les posts
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

    // On va récupérer les détails de l'article
    const openPopup = async (id) => {
        const res = await fetch(`http://localhost:3000/admin/articles/${id}`, {
            credentials: "include"
        });
        const data = await res.json();
        setPopupData(data);
        setShowPopup(true);
    };

    return (
        <div className="page">
            <Header />
            <main>
                <PresentationPage title='Gestion des Posts' text='' />

                <button className="button-to-create"onClick={() => setShowCreatePopup(true)}>+</button>

                {/*Quand la popUp de création est activée */}
                {showCreatePopup && (
                    <PostCreatePopUp
                        onClose={() => setShowCreatePopup(false)}
                        // On utilise l'opérateur spread pour recréer le tableau de tous les posts en rajoutant le nouveau
                        onCreate={(newPost) => setAllPosts(prev => [...prev, newPost])}
                    />
                )}

                <div className='quote-align'>
                    {posts.map(post =>
                        <PostCard
                        key={post.id} 
                        post={ post }
                        text={'Modifier'}
                        path={'/admin/posts'}
                        onClick={() => openPopup(post.id)}/>
                    )}
                </div>

                {/*Pour activer le pop-up*/}
                    {showPopup && (
                        <PostPopUp
                            post={popupData}
                            onClose={() => setShowPopup(false)}
                            /* updater est une fonction qui sait comment modifier la liste des posts.
                            Le parent l’utilise pour mettre à jour l’état global et l’état de la popup.*/
                            onUpdate={(updatedPost) => {
                                // 1. Mettre à jour la liste globale
                                setAllPosts(prev =>
                                    prev.map(p => p.id === updatedPost.id ? updatedPost : p)
                                );

                                // 2. Mettre à jour la popup
                                setPopupData(updatedPost);
                            }}

                            // On remonte le DELETE au composant parent
                            onDelete={(id) => setAllPosts(prev => prev.filter(p => p.id !== id))}
                        />
                    )}
    
            </main>
            <Footer />
        </div>
    )
}

export default AdminPosts;