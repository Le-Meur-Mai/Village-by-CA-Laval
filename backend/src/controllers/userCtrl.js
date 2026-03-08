import UserServices from "../services/userServices.js";
import userReturn from "../utils/returnFormat/userReturn.js";

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
    res.status(201).json(`Le nouvel utilisateur ${newUser.name} a été créé.`);
  } catch (error) {
    next(error);
  }
}

// Retourne un utilisateur avec son ID
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await servicesUser.getUserById(id);
    user = userReturn.getUserProfile(user);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

// Retourne tous les utilisateurs
const getAllUsers = async (req, res, next) => {
  try {
    let users = await servicesUser.getAllUsers();
    users = userReturn.getAllUsersFormat(users);
    res.status(200).json(users);
  } catch (error) {
    next (error);
  }
}

// Mise à jour d'un utilisateur
const updateUser = async (req, res, next) => {
  try {
    const isAdmin = req.user.isAdmin;
    const id = req.user.id;
    const newData = req.body;
    const updatedUser = await servicesUser.updateUser(id, newData, isAdmin);
    res.status(200).json(`Le nouvel utilisateur ${updatedUser.name} a été mis à jour.`);
  } catch (error) {
    next(error);
  }
}

// Mise à jour d'un utilisateur par un admin
const updateUserByAdmin = async (req, res, next) => {
  try {
    const isAdmin = req.user.isAdmin;
    const id = req.params.id;
    const newData = req.body;
    const updatedUser = await servicesUser.updateUser(id, newData, isAdmin);
    res.status(200).json(`L'utilisateur ${updatedUser.name} a été mis à jour.`);
  } catch (error) {
    next(error);
  }
}

// Supression d'un utilisateur
const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedUser = await servicesUser.deleteUser(id);
    res.status(200).json(`Le nouvel utilisateur ${deletedUser.name} a été supprimé.`);
  } catch (error) {
    next(error);
  }
}

export default {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateUserByAdmin,
  deleteUser
}
