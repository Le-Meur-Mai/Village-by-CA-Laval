import { Link } from 'react-router-dom';
import '../../styles/Button.css'

const Button = ({text = "Bouton", path = "/"}) => {
    return (
        <Link to={ path }><button className="button">{ text }</button></Link>
    )
}

export default Button;