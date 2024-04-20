//imports
import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

/*******************************INSCRIPTION*****************************/

//Inscription d'un nouvel utilisateur

export const registerController = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return next(new ErrorHandler("Veuillez remplir le formulaire d'inscription complet!", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("L'email est déjà enregistré. Veuillez vous connecter.", 400));
  }

  await User.create({
    name,
    email,
    phone,
    password,
  });

  res.status(200).json({
    success: true,
    message: "Utilisateur enregistré avec succès! Veuillez vous connecter."
  });
});



/*******************************CONNEXION*****************************/

export const loginController = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Veuillez fournir un email et un mot de passe.", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Identifiants invalides.", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Identifiants invalides.", 401));
  }

  // No need to check the role here; authenticate the user and send token
  sendToken(user, 200, res);
});


/**************************DECONNEXION**************************************/

// Fonction de déconnexion des utilisateurs
export const logoutController = catchAsyncError(async (req, res, next) => {
  // Réponse HTTP avec le statut 201 (créé avec succès)
  res
    .status(201)
    // Suppression du cookie "token" en le remplaçant par une chaîne vide
    .cookie("token", "", {
      httpOnly: true, // Le cookie est accessible uniquement via HTTP(S)
      expires: new Date(Date.now()), // Date d'expiration immédiate
    })
    // Envoie une réponse JSON avec succès et un message indiquant que l'utilisateur s'est déconnecté avec succès
    .json({
      success: true,
      message: "Déconnexion réussie.",
    });
});

/*********************USER || GET *****************************************/

// Fonction pour récupérer les informations de l'utilisateur
export const getUser = catchAsyncError((req, res, next) => {
  // Récupération de l'utilisateur à partir de la requête
  const user = req.user;

  // Réponse HTTP avec le statut 200 (OK) et envoie des informations de l'utilisateur sous forme JSON
  res.status(200).json({
    success: true, // Succès de l'opération
    user, // Données de l'utilisateur
  });
});