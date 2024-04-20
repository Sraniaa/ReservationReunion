// Middleware pour capturer les erreurs asynchrones
export const catchAsyncError = (theFunction) => {
  return (req, res, next) => {
    // Exécute la fonction asynchrone passée en paramètre de manière sécurisée
    // en utilisant Promise.resolve() pour gérer les promesses et catch() pour capturer les erreurs
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
};
