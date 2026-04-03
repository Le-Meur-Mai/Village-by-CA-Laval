import '../styles/StartupPopUp.css';
// import '../styles/Button.css';

const StartupPopup = ({ data, onClose }) => {
    if (!data) return null;

    const { name, description, logo, email, website, types, descriptionPicture } = data;
    const color = types?.[0]?.color || "CCF2B1";

    return (
        // On rend le fond plus foncé et si l'utilisateur clique dessus (donc en dehors), ça ferme le pop-up
        <div className="popup-overlay" onClick={onClose}>
            {/*Si on clique dans la carte ça ne va pas la fermer car stopPropagation
            empêche l'évenement de remonter jusqu'à le on click de l'overlay qui fermerait le pop-up*/}
            <div className="popup-card" onClick={(e) => e.stopPropagation()}>

                {/* Bandeau coloré */}
                <div className="popup-color" style={{ backgroundColor: `${color}` }}></div>

                <div className="popup-content">

                    {/* Logo */}
                    <div className="popup-logo">
                        {logo && <img src={logo} alt={name} />}
                    </div>

                    {/* Nom */}
                    <h2 className="popup-title">{name}</h2>

                    {/* Email */}
                    <p className="popup-email">
                        <strong>Email :</strong> {email || "Non renseigné"}
                    </p>

                    {/* Bouton site web */}
                    {website && (
                        //rel -> empêche d’envoyer l’URL de la page au site cible. / target -> ouvre le site dans un nouvel onglet
                        <a href={website} target="_blank" rel="noopener noreferrer" className="popup-website">
                            Visiter le site web
                        </a>
                    )}

                    {/* Grande image */}
                    {descriptionPicture && (
                        <div className="popup-image">
                            <img src={descriptionPicture} alt={`Illustration de ${name}`} />
                        </div>
                    )}

                    {/* Description */}
                    <p className="popup-description">{description}</p>

                    {/* Bouton fermer */}
                    <button className="popup-close" onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartupPopup;
