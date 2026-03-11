import '../styles/page.css'

import Button from '../components/buttons/button.jsx';
import PresentationPage from '../components/PresentationPage.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import PreFooter from '../components/PreFooter.jsx';
import PostDetails from '../components/PostDetails.jsx';

import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

const ArticleDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const result = await fetch(`http://localhost:3000/agenda/${id}`);
      const json = await result.json();
      setPost(json);
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return (<h3>Chargement...</h3>)
  } else {
      return (
          <div className='page'>
              <Header />
              <main>
                  <PresentationPage 
                      title="Actualités" 
                      text=""/>
                  <div className="button-on-the-left">
                      <Button
                      text="Retour →"
                      path="http://localhost:5173/agenda"/>
                  </div>
                  <PostDetails
                  title={post.title}
                  picture={post.picture}
                  description={post.description}/>
              </main>
              <PreFooter
              title="Envie de participer à un évenement ?"
              text="Contactez-nous !"
              buttontext="Nous contacter"/>
              <Footer />
          </div>
      )

  }
}

export default ArticleDetails;