const businessModel = require('../models/business.model');
const bcrypt = require('bcrypt');
const jwt   = require('jsonwebtoken');  

module.exports.authBusiness = async (req ,res, next ) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const business = await businessModel.findById(decoded._id);
        if (!business) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        req.business = business;
        return next();
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized'});
    }
        
}