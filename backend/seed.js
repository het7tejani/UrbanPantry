import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Product from './models/productModel.js';
import Category from './models/categoryModel.js';
import Testimonial from './models/testimonialModel.js';
import User from './models/userModel.js';
import Look from './models/lookModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Environment Variable Loading ---
// To make this more robust, we'll check for the .env file in a couple of common locations.
const backendEnvPath = path.resolve(__dirname, '.env');
const parentEnvPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(backendEnvPath)) {
  console.log('[DEBUG] Seeder: Loading .env file from backend directory.');
  dotenv.config({ path: backendEnvPath });
} else if (fs.existsSync(parentEnvPath)) {
  console.log('[DEBUG] Seeder: Loading .env file from parent (online) directory.');
  dotenv.config({ path: parentEnvPath });
} else {
  console.log('[DEBUG] Seeder: No .env file found in common directories.');
}


// Admin user is essential for accessing the dashboard.
const adminUserData = {
    fullName: 'Admin User',
    username: 'admin',
    email: 'admin@urbanpantry.com',
    password: 'adminpassword', // This will be hashed before saving
    role: 'admin'
};


const seedDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined. Please ensure a .env file exists for seeding in either the /online or /online/backend directory.');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding check...');

        // --- SAFETY CHECK ---
        // Check if there are any users. If not, we assume the DB is fresh.
        const userCount = await User.countDocuments();

        if (userCount > 0) {
            console.log('Database already contains users. Seeding script will NOT run to protect existing data.');
            console.log('To start fresh, you must manually clear the database first.');
        } else {
            console.log('Database appears empty. Seeding essential admin user...');

            // Clear all collections to be certain of a fresh start
            await Product.deleteMany({});
            await Category.deleteMany({});
            await Testimonial.deleteMany({});
            await User.deleteMany({});
            await Look.deleteMany({});
            console.log('Cleared all collections.');
            
            // Hash password and create admin user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminUserData.password, salt);
            await new User({ ...adminUserData, password: hashedPassword }).save();

            console.log('Database seeded successfully with ONLY the admin user!');
            console.log('---');
            console.log('Admin user created with credentials:');
            console.log('Email: admin@urbanpantry.com');
            console.log('Password: adminpassword');
            console.log('---');
            console.log('All sample products, looks, and testimonials have been removed.');
            console.log('Please use the Admin Dashboard to add your own content.');
        }

    } catch (err) {
        console.error('Error seeding database:', err.message);
    } finally {
        // Disconnect from the database
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedDB();