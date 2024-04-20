// Import des modules nécessaires
import { catchAsyncError } from "./catchAsyncError.js"; // Import de la fonction pour gérer les erreurs asynchrones
import ErrorHandler from "./error.js"; // Import de la classe ErrorHandler pour gérer les erreurs
import jwt from "jsonwebtoken"; // Import du module jwtwebtoken pour gérer les jetons JWT
import { User } from "../models/userSchema.js";  // Import du modèle User depuis le fichier userSchema.js


// Middleware to check if the user is authenticated
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;  // Extract the JWT from request cookies

  if (!token) {
    // If token is missing, send an unauthorized error with status code 401
    return next(new ErrorHandler("Utilisateur non autorisé", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  // Verify and decode the JWT with the JWT secret key
  req.user = await User.findById(decoded.id);  // Find the user in the database using the ID from the JWT

  next();  // Proceed to the next middleware
});

// Middleware to check if the user has Admin or SuperAdmin roles
export const isAdmin = (req, res, next) => {
  // Check if user's role is either Admin or SuperAdmin
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    // If not, send an access denied error with status code 403
    return next(new ErrorHandler("Accès non autorisé", 403));
  }
  next();  // User has the correct role, proceed to the next middleware
};

// Middleware to ensure the user is a SuperAdmin
export const isSuperAdmin = (req, res, next) => {
  // Assuming isAuthenticated middleware runs before this to set req.user
  if (req.user && req.user.role === "superadmin") {
    next();  // User is a SuperAdmin, proceed to the next middleware
  } else {
    // If user is not a SuperAdmin, send an access denied error with status code 403
    return next(new ErrorHandler("Accès non autorisé", 403));
  }
};
