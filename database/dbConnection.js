import mongoose from "mongoose";
import colors from "colors";

export const dbConnection = () => {
  return mongoose // Make sure to return the Promise here
    .connect("mongodb://127.0.0.1:27017", {
      dbName: "Reunions",
    })
    .then(() => {
      console.log("Connexion à la base de données établie".bgMagenta.white);
    })
    .catch((err) => {
      console.error( // Use console.error for errors
        "Erreur lors de la connexion à la base de données :".bgRed.white,
        err
      );
      process.exit(1); // Exit the process for a failed connection
    });
};
