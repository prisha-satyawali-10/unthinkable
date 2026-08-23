const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { transcribeAudio } = require('../services/asrService');
const { extractMeetingIntelligence } = require('../services/llmService');

// Setup multer for file uploads
const os = require('os');
const uploadDirectory = process.env.VERCEL ? os.tmpdir() : path.join(__dirname, '../../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    // Keep original extension and use a timestamp to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 75 * 1024 * 1024 }, // 75MB limit
  fileFilter: (req, file, cb) => {
    // Allow common audio formats
    const allowedMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm', 'audio/ogg', 'audio/x-m4a'];
    const allowedExtensions = ['.mp3', '.wav', '.m4a', '.webm', '.ogg'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

// Single pipeline endpoint
router.post('/upload-and-summarize', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No audio file uploaded.' });
  }

  const filePath = req.file.path;

  try {
    // 1. Transcribe audio
    const transcript = await transcribeAudio(filePath);

    if (!transcript || transcript.trim() === '') {
      throw new Error('Transcription failed or audio was empty.');
    }

    // 2. Extract intelligence
    const intelligence = await extractMeetingIntelligence(transcript);

    // 3. Return results
    res.json({
      status: 'success',
      data: {
        transcript: transcript,
        ...intelligence
      }
    });

  } catch (error) {
    console.error('Pipeline Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  } finally {
    // Cleanup temporary file
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete temporary file:', err);
      });
    }
  }
});

// Error handling middleware for Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ status: 'error', message: 'File size exceeds the 75MB limit.' });
    }
    return res.status(400).json({ status: 'error', message: err.message });
  } else if (err) {
    return res.status(400).json({ status: 'error', message: err.message });
  }
  next();
});

module.exports = router;
