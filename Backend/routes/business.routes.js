const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const businessController = require('../controllers/business.controller');
const multer = require('multer');
const path = require('path');

// ================= Auth Routes =================
router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First Name must be at least 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('organization').isLength({ min: 3 }).withMessage('Organization must be at least 3 characters'),
    body('role').isIn(['Designer', 'Editor', 'Manager', 'Others']).withMessage('Invalid Role')
], businessController.registerBusiness);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], businessController.loginBusiness);

router.get('/profile', businessController.getProfile);
router.get('/logout', businessController.logoutBusiness);

// ================= Multer for Archive (ZIP/RAR) Upload =================
const archiveStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const archiveFilter = (req, file, cb) => {
    const allowed = [".zip", ".rar"];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error("Only ZIP and RAR files are allowed"), false);
};
const archiveUpload = multer({ storage: archiveStorage, fileFilter: archiveFilter });
router.post('/upload', archiveUpload.single('file'), businessController.uploadFile);

// ================= Multer for Image Upload (VTON/Recommend) =================
const imageUpload = multer({ dest: 'uploads/' });
router.post('/recommend', imageUpload.single('file'), businessController.recommendImages);
router.post('/tryon', businessController.tryOn);

module.exports = router;
