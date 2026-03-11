import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const handleLogout = async () => {
        await fetch('http://localhost:3000/auth/logout', {
            method: "POST",
            credentials: "include",
        });
        setAuth(null); // On vide le contexte
        // Le cookie va expirer naturellement
        navigate('/login');
    }
    return (
        <Link onClick={handleLogout}>Déconnexion</Link>
    )
}

export default Logout;
