import jwt from "jsonwebtoken";
import { createError } from "../utils/apiError.js";

export const generateResetToken = (userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT,
        { expiresIn: "1h" }
    );
    return token;
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log(`User ID: ${req.user.id}, Params ID: ${req.params.id}, Is Admin: ${req.user.isAdmin}`);
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "You are not authorized to update this account!"));
        }
    });
};


export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log(req.user); // Log the user object
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};