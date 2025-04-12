const { StatusCodes } = require('http-status-codes');
const UserSchema = require('../modals/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const profileImage = req.file;

        // Validate file upload
        if (!profileImage) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No file uploaded" });
        }

        const profileImagePath = profileImage.path;

        // Check if the user already exists
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User already exists!" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new UserSchema({
            firstName,
            lastName,
            email,
            password: hashPassword,
            profileImagePath,
        });

        await newUser.save();

        // Respond with success message and user details (excluding password)
        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;

        res.status(StatusCodes.CREATED).json({
            success: true,
            msg: "User registered successfully!",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error. Please try again later." });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(email, password);

        // Check if user exists
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, msg: "User doesn't exist!" });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: "Invalid credentials!" });
        }

        // Ensure JWT_SECRET is defined
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,  // ✅ Ensure JWT_SECRET is properly set in .env file
            { expiresIn: '1h' } // ✅ Added expiration time for security
        );

        // Remove password from user object before sending it back
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        // Respond with the token and user details (excluding password)
        res.status(StatusCodes.OK).json({ success: true, token, user: userWithoutPassword });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error. Please try again later." });
    }
};

module.exports = {
    register,
    login
};
