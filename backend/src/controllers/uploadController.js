const multer = require('multer');
const { uploadToS3 } = require('../utils/s3');

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF, PPT, PPTX, DOC, DOCX files
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PPT, PPTX, DOC, and DOCX files are allowed.'));
    }
  },
});

/**
 * Upload pitch deck to S3
 */
const uploadPitchDeck = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { buffer, originalname, mimetype } = req.file;

    // Upload to S3
    const fileUrl = await uploadToS3(buffer, originalname, mimetype, 'pitch-decks');

    return res.status(200).json({
      message: 'File uploaded successfully.',
      fileUrl,
      fileName: originalname,
    });
  } catch (error) {
    console.error('Error uploading pitch deck:', error);
    return res.status(500).json({
      message: error.message || 'Failed to upload file.',
    });
  }
};

// Middleware for handling single file upload
const uploadMiddleware = upload.single('pitchDeck');

module.exports = {
  uploadPitchDeck,
  uploadMiddleware,
};

