import "../styles/PostDetails.css";

const PostDetails = ({ title="Titre de l'article", picture=null, description="Un super article arrive !" }) => {
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