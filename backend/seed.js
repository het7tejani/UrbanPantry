import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Product from './models/productModel.js';
import Category from './models/categoryModel.js';
import Testimonial from './models/testimonialModel.js';
import User from './models/userModel.js';
import Look from './models/lookModel.js';

dotenv.config();

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