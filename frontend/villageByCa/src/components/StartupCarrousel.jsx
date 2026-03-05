import "../styles/StartupCarrousel.css";

export default function StartupCarrousel({ startups }) {
  return (
    <div className="carousel-window">
      <div className="carousel-track">
        {startups.map((startup) => (
          <img
            key={startup.id}
            src={startup.logo}
            alt="logo start-up"
            className="carousel-logo"
          />
        ))}

        {/* duplication pour le défilement infini sinon il va y avoir un suat brutal*/}
        {startups.map((startup) => (
          <img
          // On rajoute dup sinon react va crash car il aura des props avec les mêmes clés
            key={`dup-${startup.id}`}
            src={startup.logo}
            alt='logo start-up'
            className="carousel-logo"
          />
        ))}
      </div>
    </div>
  );
}
