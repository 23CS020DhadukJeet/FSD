const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to allow only PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// Configure multer with file size limit (2MB)
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB in bytes
    },
    fileFilter: fileFilter
});

// Serve static files
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Resume upload endpoint
app.post('/upload-resume', (req, res) => {
    upload.single('resume')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File too large! Please upload a PDF file smaller than 2MB.'
                });
            }
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please select a PDF file to upload.'
            });
        }

        res.json({
            success: true,
            message: 'Resume uploaded successfully!',
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    });
});

// Get uploaded resumes list
app.get('/resumes', (req, res) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error reading uploads directory'
            });
        }

        const resumes = files.map(file => ({
            filename: file,
            uploadDate: fs.statSync(`./uploads/${file}`).mtime
        }));

        res.json({
            success: true,
            resumes: resumes
        });
    });
});

app.listen(PORT, () => {
    console.log(`Job Portal server running on http://localhost:${PORT}`);
});