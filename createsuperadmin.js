import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/userSchema.js";
import { dbConnection } from "./database/dbConnection.js";

dotenv.config(); // Ensure your environment variables are loaded

// Function to create a superadmin if one does not exist
const createSuperAdmin = async () => {
  try {
    const exists = await User.findOne({ role: "superadmin" });
    if (exists) {
      console.log("A superadmin already exists.");
      return;
    }

    // Create a new superadmin user
    const superadmin = new User({
      name: "SuperAdmin",
      email: "superadmin@example.com",
      phone: "1234567890",
      password: "superadminpassword", // Choose a secure password
      role: "superadmin"
    });

    await superadmin.save();
    console.log("Superadmin created successfully!");
  } catch (error) {
    console.error("Failed to create superadmin:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

// Connect to the database and run the function
dbConnection().then(() => createSuperAdmin());
