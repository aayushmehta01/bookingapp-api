import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { createError } from '../utils/apiError.js'
import { generateResetToken } from '../utils/verifyToken.js';

// testing git

// Function to send the reset password email
const sendResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port:465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <p>You requested a password reset. Please click the link below to reset your password:</p>
            <a href="http://localhost:5173/reset-password/${token}">Reset Password</a>
        `,
    };

    await transporter.sendMail(mailOptions);
};


// Forgot Password Route
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return next(createError(404, "User not found"));

        const resetToken = generateResetToken(user._id);
        
        await sendResetEmail(email, resetToken);

        res.status(200).send('Password reset email sent');
    } catch (err) {
        next(err);
    }
};


// Reset Password Route
export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    console.log(req.body);

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        const user = await User.findById(decoded.id);
        if (!user) return next(createError(404, "User not found"));

        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).send('Password successfully updated');
    } catch (err) {
        console.log(err);
        next(createError(400, 'Invalid or expired token.'));
    }
};


// Register user route
export const register = async(req, res, next) => {
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        });
        
        await newUser.save();
        res.status(200).send("User has been created");
    }
    catch(err){
        next(err);
    }
}


// Login user route
export const login = async(req, res, next) => {
    try{
        const user = await User.findOne({username:req.body.username});
        if(!user) return next(createError(404, "User not found"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect) return next(createError(400, "Incorrect password"));

        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            }, 
            process.env.JWT)

        const { password, isAdmin, ...otherDetails } = user._doc;
        
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        })
        .status(200)
        .json({...otherDetails});
    }
    catch(err){
        next(err);
    }
}