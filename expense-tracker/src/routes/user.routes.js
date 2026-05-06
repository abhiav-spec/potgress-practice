import express from 'express';
import { getUserById , createUserHandler, getAllUsersHandler} from '../controllers/user.controller.js';

const router = express.Router();

// Create user
router.post("/create-account", createUserHandler);
// Get all users
router.get("/users", getAllUsersHandler);
// Get user by email
router.get("/users/:email", getUserByIdHandler);