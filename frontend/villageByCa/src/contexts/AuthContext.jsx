/* Création d'un contexte React, toutes les composants/pages pourront lire le résultat de
ce contexte et adopter des comportements particuliers suivant le résultat. */
import { createContext, useContext, useState, useEffect } from "react";

/*On crée un nouveau contexte que l'on met dans la variable AuthContext
qui va contenir un objet avec .Provider qui permettra de partager les
valeurs mis dans value plus bas, avec tous les composants enfants.*/
const AuthContext = createContext(null);

// children c'est tous les composants wrappés dans le main.jsx c'est à dire toute l'app
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                const result = await fetch(`http://localhost:3000/auth`, {
                    credentials: "include",
                });
                if (!result.ok) {
                    throw new Error('Utilisateur non authentifié');
                }
                const json = await result.json();
                setAuth(json);
            } catch (error) {
                setAuth(null);
            }
            setLoading(false);
        };
        fetchAuth();
    }, []);

    return (
        // Un provider C'est le composant qui met à disposition les valeurs du contexte.
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Pour éviter que l'on est à écrire useContext(AuthContext) partout
export const useAuth = () => useContext(AuthContext);
