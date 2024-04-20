import mongoose from "mongoose";

// Définition du schéma de la salle de réunion
const roomSchema = new mongoose.Schema({
  // Nom de la salle, qui doit être unique et est requis
  name: {
    type: String,
    required: [true, "Le nom de la salle est obligatoire"],
    unique: true,
    trim: true
  },
  // Capacité de la salle, indiquant le nombre maximum de personnes qu'elle peut accueillir
  capacity: {
    type: Number,
    required: [true, "La capacité de la salle est obligatoire"],
    min: [1, "La capacité doit être d'au moins 1 personne"],
    // Vous pouvez ajuster la valeur maximale selon les besoins de votre application
    max: [100, "La capacité ne peut pas dépasser 100 personnes"]
  },
  // Liste de l'équipement disponible dans la salle, limitée aux valeurs définies dans 'enum'
  equipment: {
    type: [{
      type: String,
      enum: [
        "projecteur",        // Un projecteur pour afficher des présentations
        "tableau",           // Un tableau blanc pour écrire ou afficher des informations
        "téléconférence",    // Un système de téléconférence pour des réunions virtuelles
        "ordinateur",        // Un ordinateur mis à disposition dans la salle
        "haut-parleur",      // Un système de haut-parleurs pour l'amplification du son
        "microphone",        // Un ou plusieurs microphones pour les présentations ou conférences
        "caméra",            // Une caméra pour enregistrer ou diffuser la réunion
        "autre"              // Une option pour tout autre équipement non spécifiquement listé
      ],
    }],
    default: []
  },
  // Description optionnelle de la salle
  description: {
    type: String,
    maxLength: [500, "La description ne peut pas dépasser 500 caractères"]
  },
  // Date de création de l'enregistrement de la salle, avec une valeur par défaut à la date actuelle
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Création du modèle Room à partir du schéma défini
const Room = mongoose.model("Room", roomSchema);

// Exportation du modèle Room pour l'utiliser dans d'autres parties de l'application
export { Room };
