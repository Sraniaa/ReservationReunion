// Classe pour gérer les erreurs
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Middleware de gestion des erreurs
export const errorMiddleware = (err, req, res, next) => {
    // Définition du message d'erreur et du code d'état par défaut
    err.message = err.message || "Erreur interne du serveur";
    err.statusCode = err.statusCode || 500;

    // Gestion des différents types d'erreurs
    if (err.name === "CastError") {
        const message = `Ressource non trouvée. Champ invalide : ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
        const message = `Entrée dupliquée pour : ${Object.keys(err.keyValue)}`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        const message = `Le jeton JSON est expiré. Veuillez réessayer.`;
        err = new ErrorHandler(message, 400);
    }

    // Envoi de la réponse d'erreur au client
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;