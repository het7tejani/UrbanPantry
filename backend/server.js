import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

// Load environment variables from a .env file into process.env
dotenv.config();

// --- DEBUGGING STEP ---
// The following line will print the API key to your server console when it starts.
// This helps us verify that the .env file is being read correctly.
// If it prints 'undefined', your .env file is in the wrong location or named incorrectly.
// It should be located at 'backend/.env'.
// If it prints your key, but you still have errors, the key itself might be invalid or restricted.
console.log(`[DEBUG] Loaded API_KEY: ${process.env.API_KEY ? '******' + process.env.API_KEY.slice(-4) : 'undefined'}`);
// --- END DEBUGGING STEP ---

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// This line is crucial for your POST request to work.
// It tells Express to parse incoming request bodies with JSON payloads.
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

connectDB();