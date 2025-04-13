const {validationResult} = require('express-validator');
const businessModel = require('../models/business.model');
const businessService = require('../services/business.service');
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");





module.exports.registerBusiness = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, organization, role } = req.body;

    const isBusinessAlreadyExist = await businessModel.findOne({ email });

    if (isBusinessAlreadyExist) {
        return res.status(400).json({ message: 'User already exist' });
    }


    const hashedPassword = await businessModel.hashPassword(password);

    const business = await businessService.createBusiness({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        organization,
        role

    });

    const token = business.generateAuthToken();

    res.status(201).json({ token, business });

}


module.exports.loginBusiness = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const business = await businessModel.findOne({ email }).select('+password');

    if (!business) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await business.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid Password' });
    }

    const token = business.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, business });
}


module.exports.getProfile = async (req, res, next) => {
    res.status(200).json({business: req.business});
}

module.exports.logoutBusiness = async (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({message: 'Logged out successfully'});
}



module.exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded!" });
        }
        // const business_id = req.business._id;
        const business_id = "1234545"; 

        const {  model_type } = req.body;
        const file = req.file;
        const filePath = path.join(__dirname, "../uploads", file.filename);

        console.log("✅ File Uploaded:", file.filename);
        // console.log("📌 User ID:", business_id.toString());
        console.log("📌 User ID:", business_id);
        console.log("🔍 Model Type:", model_type);

        // Ensure file exists
        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ error: "File not found after upload" });
        }

        // Create FormData
        const formData = new FormData();
        // formData.append("user_id", business_id.toString());
        formData.append("user_id", business_id);
        formData.append("model_type", model_type);
        formData.append("file", fs.createReadStream(filePath), {
            filename: file.filename,
            contentType: "application/octet-stream", // Generic for ZIP/RAR
        });

        // Send file to FastAPI
        const response = await axios.post("http://127.0.0.1:8000/predict/", formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        console.log("🚀 FastAPI Response:", response.data);

        // if (response.status === 200) {
        //     await businessService.deductCoins(business_id, 10);
        // }

        // Delete file after successful upload
        fs.unlinkSync(filePath);

        // Return FastAPI response
        res.json(response.data);
    } catch (error) {
        console.error("❌ Error uploading file:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};