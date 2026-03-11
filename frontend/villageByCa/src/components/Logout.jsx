import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const handleLogout = () => {
        setAuth(null); // On vide le contexte
        // Le cookie va expirer naturellement
        navigate('/login');
    }
    return (
        <Link onClick={handleLogout}>Déconnexion</Link>
    )
}

export default Logout;
