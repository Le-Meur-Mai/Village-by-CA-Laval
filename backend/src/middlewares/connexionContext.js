import jwt from "jsonwebtoken";

/* Fonction similaire à authorizationConnexion mais qui ne renvoie jamais d'erreurs
dans la console car elle sert juste à intialiser le contexte de connexion de React,
alors que les autres fonctions sont faites pour accéder à des pages réservées
aux personnes connectées. */

function connexionContext (req, res, next) {
  // On regarde si on a le token dans les cookies envoyés
  const token = req.cookies.jwtToken;
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    // On décode le token avec notre secret pour voir s'il est valide.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, isAdmin }
    return next();
  } catch (err) {
    req.user = null;
    return next();
  }
}

export default connexionContext;
