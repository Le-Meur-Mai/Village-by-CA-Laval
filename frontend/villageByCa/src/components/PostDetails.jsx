import "../styles/PostDetails.css";

const PostDetails = ({ title="L'article n'existe pas ou n'a pas été trouvé", picture=null, description="Nous sommes désolés pour le dérangement occasionné." }) => {
  return (
    <article className="post-details">
        <h2 className="post-details-title">{title}</h2>

        {picture && (
            <div className="post-details-image-wrapper">
                    <img
                    src={picture}
                    alt={title}
                    className="post-image"
                    />
            </div>
        )}

        <p className="post-details-description">
            {description}
        </p>
    </article>
  );
};

export default PostDetails;