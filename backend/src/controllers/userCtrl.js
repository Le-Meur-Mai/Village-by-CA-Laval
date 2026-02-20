import UserServices from "../services/userServices.js";

// Déclaration d'une nouvelle instance sur la classe Service
const servicesUser = new UserServices();

// Création d'un utilisateur
const createUser = async (req, res, next) => {
  try {
    const newUser = await servicesUser.createUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}

// Retourne un utilisateur avec son ID
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await servicesUser.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

// Retourne tous les utilisateurs
const getAllUsers = async (req, res, next) => {
  try {
    const users = await servicesUser.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next (error);
  }
}

// Mise à jour d'un utilisateur
const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updatedUser = await servicesUser.updateUser(id, newData);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

// Supression d'un utilisateur
const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedUser = await servicesUser.deleteUser(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
}

export default {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser
}
