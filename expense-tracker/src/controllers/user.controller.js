import { createUser, getAllUsers, getUserById, deleteUser } from '../models/user.model.js';

export const createUserHandler = async (req, res) => {

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email required" });
    }
    
    try {
        const user = await createUser(name, email);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsersHandler = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserByIdHandler = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await getUserById(id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};