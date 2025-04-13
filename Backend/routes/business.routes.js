const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const businessController = require('../controllers/business.controller');

const multer = require('multer');
const path = require('path');



router.post('/register', [ 
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min: 3}).withMessage('First Name must be at least 3 characters'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long '),
    body('organization').isLength({min: 3}).withMessage('Organization must be at least 3 characters long'),
    body('role').isIn(['Designer', 'Editor', 'Manager','Others']).withMessage('Invalid Role')
],
businessController.registerBusiness
)


router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long ')
],
businessController.loginBusiness
)

router.get('/profile',businessController.getProfile)

router.get('/logout', businessController.logoutBusiness)


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save uploads in "uploads/" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Multer File Filter (Accept Only ZIP/RAR)
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".zip", ".rar"];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExt)) {
        cb(null, true);
    } else {
        cb(new Error("Only ZIP and RAR files are allowed!"), false);
    }
};


const upload = multer({ storage, fileFilter });

// Define Route
router.post('/upload', upload.single('file'),businessController.uploadFile);


module.exports = router;