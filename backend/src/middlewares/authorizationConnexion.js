import jwt from "jsonwebtoken";
function authorizationConnexion (req, res, next) {
  // On regarde si on a le token dans les cookies envoyés
  const token = req.cookies.jwtToken;
  if (!token) {
    return res.status(403).json("You are not authentificated.");
  }
  try {
    // On décode le token avec notre secret pour voir s'il est valide.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, isAdmin }
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export default authorizationConnexion;
