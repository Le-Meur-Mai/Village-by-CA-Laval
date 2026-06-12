import { useState } from "react";
import "../styles/LazyYoutube.css";

const LazyYoutube = ({ videoId }) => {
  const [loaded, setLoaded] = useState(false);

  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div 
      className="youtube-wrapper"
      onClick={() => setLoaded(true)}
    >
      {!loaded && (
        <div className="youtube-thumbnail">
          <img src={thumbnail} fetchPriority="high" decoding="async" alt="Video du Village by CA de Laval" />
          <button className="youtube-play">▶</button>
        </div>
      )}

      {loaded && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title="YouTube video"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        ></iframe>
      )}
    </div>
  );
};

export default LazyYoutube;
