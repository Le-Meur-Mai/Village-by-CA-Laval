// Middleware vérifiant si l'utilisateur actuel est un admin

function authorizationAdmin (req, res, next) {

  if (!req.user) {
    return res.status(403).json({ message: "Not authenticated." });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied." });
  }
  next();
}

export default authorizationAdmin;
