const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { randomUUID } = require('crypto');
const path = require('path');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
const BUCKET_REGION = process.env.AWS_REGION || 'us-east-1';

/**
 * Upload a file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalFileName - Original file name
 * @param {string} mimeType - File MIME type
 * @param {string} folder - Folder path in S3 (e.g., 'pitch-decks', 'documents')
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
const uploadToS3 = async (fileBuffer, originalFileName, mimeType, folder = 'uploads') => {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME environment variable is not set');
  }

  // Generate a unique file name
  const fileExtension = path.extname(originalFileName);
  const fileName = `${folder}/${randomUUID()}${fileExtension}`;

  // Upload parameters
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
    // Note: ACL is deprecated for new S3 buckets. Use bucket policies instead.
    // Remove ACL if your bucket has ACLs disabled (recommended for security)
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Generate the file URL
    const fileUrl = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${fileName}`;
    
    return fileUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

/**
 * Generate a presigned URL for private S3 objects
 * @param {string} key - S3 object key
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} - Presigned URL
 */
const getPresignedUrl = async (key, expiresIn = 3600) => {
  const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
};

module.exports = {
  uploadToS3,
  getPresignedUrl,
  s3Client,
};

