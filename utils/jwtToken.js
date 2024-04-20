export const sendToken = (user, statuscode, res, message) => {
    // Obtenir le token JWT pour l'utilisateur
    const token = user.getJWTToken();

    // Définir les options pour le cookie contenant le token
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ), // Date d'expiration du cookie (calculée en fonction du nombre de jours spécifié dans l'environnement)
        httpOnly: true, // Le cookie ne peut être accédé que par le serveur HTTP, pas par JavaScript côté client
    };

    // Envoyer la réponse au client avec le token dans un cookie et d'autres informations
    res.status(statuscode) // Définir le code de statut HTTP de la réponse
        .cookie("token", token, options) // Définir le cookie avec le token
        .json({
            success: true, // Indiquer si la demande a réussi
            user, // Envoyer les détails de l'utilisateur avec la réponse
            message, // Envoyer un message décrivant le résultat de l'action (par exemple, "Utilisateur connecté avec succès!")
            token, // Envoyer également le token dans le corps de la réponse pour référence
        });
}