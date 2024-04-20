import express from 'express';
import { isAuthenticated, isAdmin, isSuperAdmin } from '../middlewares/auth.js';
import { createAdminAccount, getAllUsers, updateUser, deleteUser, getAllAdmins, updateAdmin, deleteAdmin } from '../controllers/adminController.js';
import { loginController, logoutController } from '../controllers/userController.js';  // Reuse login and logout for simplicity

const adminRouter = express.Router();

// Admin and SuperAdmin share similar dashboards and functionalities
adminRouter.post('/login', loginController);  // Admins and SuperAdmins can log in here
adminRouter.get('/logout', logoutController);  // Common logout route

// Admin functionalities accessible by both Admin and SuperAdmin
adminRouter.get('/users', isAuthenticated, isAdmin, getAllUsers);
adminRouter.patch('/users/:id', isAuthenticated, isAdmin, updateUser);
adminRouter.delete('/users/:id', isAuthenticated, isAdmin, deleteUser);

// SuperAdmin-specific functionalities
adminRouter.post('/register', isAuthenticated, isSuperAdmin, createAdminAccount);  // Only SuperAdmins can register new admins
adminRouter.get('/admins', isAuthenticated, isSuperAdmin, getAllAdmins);
adminRouter.patch('/admins/:id', isAuthenticated, isSuperAdmin, updateAdmin);
adminRouter.delete('/admins/:id', isAuthenticated, isSuperAdmin, deleteAdmin);

export default adminRouter;
