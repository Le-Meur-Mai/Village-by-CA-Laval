import Button from "./buttons/button.jsx";
import "../styles/PostCard.css";
import villageByCa from '../assets/logo_village_by_ca.png';

export default function PostCard({ post, text, path, onClick }) {
    // On prend la date du createdAt et on le met en format lisible car de base il est en ISO
    const date = new Date(post.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="post-card">
            {post.picture &&(
                <div className="post-image">
                    <img src={post.picture} alt={post.title} />
                </div>
            )}
            {!post.picture &&(
                <div className="post-image">
                    <img src={villageByCa} alt={post.title} />
                </div>
            )}

            <p className="post-date">{date}</p>

            <h3 className="post-title">{post.title}</h3>
            <div className="post-element-center" onClick={onClick}>
                <Button
                text={text}
                path={path}/>
            </div>
        </div>
    );
}