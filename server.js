const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;


app.use(cors());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create directories for each year if they don't exist
const years = ['2022', '2023', '2024'];
years.forEach(year => {
    const dir = path.join(__dirname, 'uploads', year);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure Multer to store uploaded files in the correct year's directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const year = req.params.year;
        const dir = path.join(__dirname, 'uploads', year);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Endpoint to handle file upload
app.post('/upload/:year', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filePath = `/uploads/${req.params.year}/${req.file.filename}`;
    res.send({ filePath });
});

// Endpoint to get list of images for a given year
app.get('/images/:year', (req, res) => {
    const year = req.params.year;
    const dir = path.join(__dirname, 'uploads', year);
    fs.readdir(dir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const filePaths = files.map(file => `/uploads/${year}/${file}`);
        res.send(filePaths);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
