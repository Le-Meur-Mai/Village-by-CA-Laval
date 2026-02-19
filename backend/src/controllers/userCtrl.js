import UserServices from "../services/userServices.js";

// Création d'un utilisateur
const createUser = async (req, res, next) => {
  try {
    const newUser = await UserServices.createUser({
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
const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await UserServices.getUser(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

// Retourne tous les utilisateurs
const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserServices.getAllUsers();
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
    const updatedUser = await UserServices.updateUser(id, newData);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

// Supression d'un utilisateur
const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedUser = await UserServices.deleteUser(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
}

export default {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser
}
