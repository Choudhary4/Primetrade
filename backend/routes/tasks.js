const express = require('express');
const Task = require('../models/Task');
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

// @route   GET /api/tasks
// @desc    Get all tasks for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
    const { title, description, status } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const task = new Task({
            user: req.user._id,
            title,
            description,
            status,
            image: imageUrl,
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    const { title, description, status } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            if (task.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            task.title = title || task.title;
            task.description = description || task.description;
            task.status = status || task.status;

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                task.image = result.secure_url;
            }

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            if (task.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            await task.deleteOne();
            res.json({ message: 'Task removed' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
