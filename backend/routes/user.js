const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, upload.single('profilePicture'), async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                user.profilePicture = result.secure_url;
            } catch (error) {
                return res.status(500).json({ message: 'Image upload failed' });
            }
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
            token: req.headers.authorization.split(' ')[1], // Return same token
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
