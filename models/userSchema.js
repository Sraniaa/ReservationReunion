// Schéma Mongoose pour un utilisateur dans une base de données MongoDB
import mongoose from "mongoose";
import validator from "validator"; // Package Node.js qui permet de valider les données
import bcrypt from "bcryptjs"; // Package Node.js pour le hachage des mots de passe
import jwt from "jsonwebtoken"; // Package Node.js pour la gestion des JSON Web Tokens

// Définition du schéma de l'utilisateur
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Veuillez entrer votre nom"],
    minLength: [3, "Le nom doit contenir au moins 3 caractères"],
    maxLength: [30, "Le nom ne peut pas dépasser 30 caractères"],
  },
  email: {
    type: String,
    required: [true, "Veuillez entrer votre adresse e-mail"],
    unique: true,
    validate: [validator.isEmail, "Veuillez entrer une adresse e-mail valide"],
  },
  phone: {
    type: String,
    required: [true, "Veuillez entrer votre numéro de téléphone"],
  },
  password: {
    type: String,
    required: [true, "Veuillez fournir votre mot de passe"],
    minLength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
    maxLength: [32, "Le mot de passe ne peut pas dépasser 32 caractères"],
  },
  role: {
    type: String,
    default: 'user', // Default role is 'user'
    enum: ["admin", "user","superadmin"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware : avant de sauvegarder l'utilisateur, hacher le mot de passe
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Méthode pour comparer les mots de passe hachés
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour générer un JSON Web Token (JWT)
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Création du modèle User à partir du schéma
const User = mongoose.model("User", userSchema);

// Exportation de la classe User en tant qu'élément nommé
export { User };
