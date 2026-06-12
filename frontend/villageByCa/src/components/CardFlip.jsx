import '../styles/CardFlip.css'
import { useState } from "react";

const CardFlip = ({ titleFront = 'Front', titleBack = 'Back', icon = null, children = 'text' }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="card-flip" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
                <div className="card-face card-front">
                    <h2><b>{titleFront}</b></h2>
                    <img src={icon} alt="" />
                </div>
                <div className="card-face card-back">
                    <h3>{titleBack}</h3>
                    <p>{children}</p>
                </div>
            </div>
        </div>
    );
};

export default CardFlip;