import Button from "./buttons/button.jsx";
import "../styles/PostCard.css";

export default function PostCard({ post, text, path, onClick }) {

    // Logo par défaut si aucune image de post n'est fourni, host sur Cloudinary pour pouvoir l'optimiser
    const villageByCa = "https://res.cloudinary.com/dwc7gkjyk/image/upload/w_365,dpr_auto,f_auto,q_auto/v1779287482/logo_village_by_ca_e3pngc.webp"

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
                    <img src={post.picture.replace('/upload/', '/upload/w_365,dpr_auto,f_auto,q_auto/')} alt={post.title} />
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