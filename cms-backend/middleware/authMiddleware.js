const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // if (!token) {
    //     return res.status(401).json({ message: 'Access denied. No token provided.' });
    // }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token to request
        console.log('Decoded token:', decoded);
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose'); // For ObjectId conversion
// require('dotenv').config();

// module.exports = function (req, res, next) {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('JWT_SECRET used for token verification:', process.env.JWT_SECRET);
//     req.user = decoded;

//     // Convert the userId from the token to ObjectId to match MongoDB
//     req.user.id = mongoose.Types.ObjectId(req.user.userId);
//     console.log('Decoded token:', decoded);
//     next();
//   } catch (error) {
//     return res.status(400).json({ message: 'Invalid token.' });
//   }
// };
