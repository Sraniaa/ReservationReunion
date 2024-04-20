import express from 'express';
import { registerController, loginController, logoutController } from '../controllers/userController.js'

const userRouter = express.Router();

// Register route for all users (although typically you might restrict admin creation here)
userRouter.post('/register', registerController);  // Any visitor can register as a basic user
userRouter.post('/login', loginController);  // Login route for all users
userRouter.get('/logout', logoutController);  // Logout route for all users

export default userRouter;
