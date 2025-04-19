const { validationResult } = require('express-validator');
const businessModel = require('../models/business.model');
const businessService = require('../services/business.service');
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const VTON_API_URL = "https://api.segmind.com/v1/idm-vton";
const API_KEY = process.env.VTON_API_KEY;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

// ================= Auth =================

module.exports.registerBusiness = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fullname, email, password, organization, role } = req.body;

    if (await businessModel.findOne({ email })) {
        return res.status(400).json({ message: 'User already exists' });
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
};

module.exports.loginBusiness = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const business = await businessModel.findOne({ email }).select('+password');
    if (!business || !(await business.comparePassword(password))) {
        return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    const token = business.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, business });
};

module.exports.getProfile = async (req, res) => {
    res.status(200).json({ business: req.business });
};

module.exports.logoutBusiness = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

// ================= Upload for FastAPI Predictions =================

module.exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded!" });

        const business_id = "1234545"; // TODO: replace with req.business._id if using auth
        const { model_type } = req.body;
        const filePath = path.join(__dirname, "../uploads", req.file.filename);

        const formData = new FormData();
        formData.append("user_id", business_id);
        formData.append("model_type", model_type);
        formData.append("file", fs.createReadStream(filePath));

        const response = await axios.post("http://127.0.0.1:8000/predict/", formData, {
            headers: formData.getHeaders()
        });

        fs.unlinkSync(filePath); // cleanup
        res.json(response.data);
    } catch (error) {
        console.error("❌ Upload error:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// ================= Image Recommendation =================

module.exports.recommendImages = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file.path));

        const response = await axios.post("http://127.0.0.1:8000/recommend-binary/", formData, {
            headers: formData.getHeaders()
        });

        fs.unlinkSync(req.file.path); // cleanup
        res.json({ recommended_images: response.data.recommended_images });
    } catch (error) {
        console.error("❌ Recommendation error:", error.message);
        res.status(500).json({ error: "Error processing image recommendation" });
    }
};

// ================= ImgBB Upload =================

const uploadToImgBB = async (imagePath) => {
    try {
        const formData = new FormData();
        formData.append("image", fs.createReadStream(imagePath));

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
            headers: formData.getHeaders()
        });

        return response.data.data.url;
    } catch (err) {
        console.error("❌ ImgBB Upload Error:", err.response?.data || err.message);
        throw new Error("Failed to upload image to ImgBB");
    }
};

// ================= Virtual Try-On =================

module.exports.tryOn = async (req, res) => {
    const { human_base64, garm_base64 } = req.body;

    if (!human_base64 || !garm_base64) {
        return res.status(400).json({ error: "Missing human or garment image" });
    }

    try {
        const humanPath = "uploads/human.jpg";
        const garmPath = "uploads/garm.jpg";

        // Save base64 to disk
        fs.writeFileSync(humanPath, Buffer.from(human_base64, "base64"));
        fs.writeFileSync(garmPath, Buffer.from(garm_base64, "base64"));

        // Upload to ImgBB
        const humanUrl = await uploadToImgBB(humanPath);
        const garmUrl = await uploadToImgBB(garmPath);

        console.log("👕 Human ImgBB URL:", humanUrl);
        console.log("👗 Garment ImgBB URL:", garmUrl);

        fs.unlinkSync(humanPath);
        fs.unlinkSync(garmPath);

        // Send to VTON API
        const vtonResponse = await axios.post(VTON_API_URL, {
            crop: false,
            seed: 42,
            steps: 30,
            category: "dresses", // try changing to "upper_body" if needed
            force_dc: false,
            human_img: humanUrl,
            garm_img: garmUrl,
            mask_only: false
        }, {
            headers: { "x-api-key": API_KEY },
            responseType: "arraybuffer"
        });

        const base64Image = Buffer.from(vtonResponse.data).toString("base64");
        res.json({ vton_image: `data:image/png;base64,${base64Image}` });

    } catch (error) {
        if (error.response?.data instanceof Buffer) {
            const htmlError = error.response.data.toString();
            console.error("❌ VTON HTML Error:", htmlError);
        } else {
            console.error("❌ VTON Error:", error.response?.data || error.message);
        }

        res.status(500).json({
            error: "VTON Try-On failed. See logs for details."
        });
    }
};
