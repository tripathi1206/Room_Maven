const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./connectDB/connect');

// Load environment variables
dotenv.config();

// Ensure essential environment variables are defined
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing in the .env file!");
    process.exit(1);
}

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static('./public'));

// Import Routes
const authRoutes = require('./Routes/authRoutes');
const PageListingRoutes = require('./Routes/PageListingRoute');
const BookingRoute = require('./Routes/BookingRoute');
const UserRoute = require('./Routes/UserRoute');

// Test route
app.get('/test', (req, res) => {
    res.send("Hello, I am the test route!");
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', PageListingRoutes);
app.use('/api/v1/bookings', BookingRoute);
app.use('/api/v1/users', UserRoute);

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ success: false, msg: "Route not found!" });
});

// Set Port
const PORT = process.env.PORT || 3000;

// Start Server
const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);  // Exit process if database fails to connect
    }
};

// Handle unexpected shutdowns
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
    process.exit(1);
});

startServer();
