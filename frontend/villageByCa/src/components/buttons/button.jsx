import { Link } from 'react-router-dom';
import '../../styles/Button.css'

const Button = ({text = "Bouton"}) => {
    return (
        <button className="button">{ text }</button>
    )
}

export default Button;