import app from './app.js';
import dotenv from "dotenv";
dotenv.config();

// Setting up the server to listen on the configured port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
