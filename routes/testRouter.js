import express from "express";
import { testPostController } from "../controllers/testController.js";

// Création de l'objet router
const router = express.Router();

// Définition des routes
router.post('/test-post' , testPostController);

// Export du routeur
export default router;