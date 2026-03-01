import { Link } from 'react-router-dom';
import '../../styles/Button.css'

const Button = ({text = "Bouton"}) => {
    return (
        <Link to="/startups"><button className="button">{ text }</button></Link>
    )
}

export default Button;