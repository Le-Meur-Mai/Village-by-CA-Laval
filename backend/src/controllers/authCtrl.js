import jwt from "jsonwebtoken";
import AuthServices from "../services/authServices.js";

const servicesAuth = new AuthServices();

// Vérifie que l'email et le mot de passe de l'utilisateur correspond.
const login = async (req, res, next) => {
  try {
    const user = await servicesAuth.login(req.body);
    // On crée le token de l'utilisateur
    const token = jwt.sign({id: user.id, isAdmin: user.isAdmin},
      process.env.JWT_SECRET,
      {expiresIn: "1d"}
    );
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: false,// true en prod (HTTPS)
      /*strict -> Dit au navigateur d'envoyer le cookie seulement s'il provient de
      la même origine que spécifié dans app.js. lax accepte les requêtes
      cross-origin. (Pas des mêmes port ou domaines).*/
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 Journée
    });
    res.status(200).json(user.isAdmin);
  } catch (error) {
    next(error);
  }
}

// Affiche le profil de l'utilisateur, sa startup et ses citations
const getProfile = async (req, res, next) => {
  try {
    const id = req.user.id;
    const profile = await servicesAuth.getProfile(id);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
}


export default {
  login,
  getProfile
}