const express = require('express');
const multer = require('multer');
const cors = require('cors');  // Import cors
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Enable CORS for all routes (or specify the origin)
app.use(cors({
  origin: 'http://127.0.0.1:5500',  // Allow only your frontend
  methods: ['GET', 'POST'],  // Allow only specific methods
  allowedHeaders: ['Content-Type', 'Authorization']  // Allow specific headers
}));

// Set up storage destination and filename for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads', req.query.path || '');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.post('/file', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileInfo = {
    originalName: req.file.originalname,
    uploadName: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  };

  res.status(200).json({
    message: 'File uploaded successfully!',
    file: fileInfo
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});