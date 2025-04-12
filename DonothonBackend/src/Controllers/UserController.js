const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const mailUtil = require("../Utils/MailUtil"); // Correct spelling

const secret = "secret"; // You can move this to .env later

// Add User
const addUser = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashPassword;
        const add = await userModel.create(req.body);

        const message = `
            <h1>Welcome to Donothon Family ${req.body.name}!</h1>
            <p>We're thrilled to have you join our community. Donothon is all about sharing and caring. Start exploring now and make a difference!</p>
            <button><a href='https://localhost:5173/'>Get Started</a></button>
            <p>If you have any questions, feel free to reach out at <a href='mailto:support@wearshare.com' style='text-decoration:underline;color:blue;'>support@donothon.com</a>.</p>
        `;

        await mailUtil.sendMail(req.body.email, "Welcome to donothon", message);

        res.status(201).json({
            message: 'User created successfully',
            data: add
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'User already exists or error occurred',
            error: err
        });
    }
};

// Sign In
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).populate("role");

        if (!user) {
            return res.status(404).json({ message: 'Email not registered' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            data: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Profile
const getProfileById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await userModel.findById(id);
        res.status(200).json({
            message: "Profile fetched successfully",
            data
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = await userModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({
            message: "Profile updated successfully",
            data: updatedData
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Profile
const deleteProfile = async (req, res) => {
    try {
        const id = req.params.id;
        await userModel.findByIdAndDelete(id);
        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Forgot Password (send reset link)
const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const foundUser = await userModel.findOne({ email });

        if (foundUser) {
            const token = jwt.sign({ id: foundUser._id, email: foundUser.email }, secret, { expiresIn: "1h" });
            const url = `http://localhost:5173/resetpassword/${token}`;
            const mailContent = `<h3>Reset your password</h3><p>Click below to reset your password:</p><a href="${url}">Reset Password</a>`;

            await mailUtil.sendMail(foundUser.email, "Reset Password", mailContent);

            return res.json({
                message: "Reset password link sent to email",
            });
        } else {
            return res.status(404).json({
                message: "User not found. Please register first.",
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error sending reset link",
            error: err,
        });
    }
};

// Reset Password
const resetpassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const decodedToken = jwt.verify(token, secret);

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        await userModel.findByIdAndUpdate(decodedToken.id, {
            password: hashedPassword,
        });

        res.json({
            message: "Password updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error resetting password",
            error: err,
        });
    }
};

module.exports = {
    addUser,
    signIn,
    getProfileById,
    updateProfile,
    deleteProfile,
    forgotPassword,
    resetpassword
};
