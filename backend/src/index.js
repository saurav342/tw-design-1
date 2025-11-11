require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const contentRoutes = require('./routes/contentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const intakeRoutes = require('./routes/intakeRoutes');
const founderExtrasRoutes = require('./routes/founderExtrasRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const paymentAdminRoutes = require('./routes/paymentAdminRoutes');

const app = express();

// Configure CORS with proper origin handling
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://launchnlift.netlify.app',
  'https://www.launchnlift.netlify.app',
  'https://launchandlift.com',
  'https://www.launchandlift.com',
];

// Add any additional origins from environment variable
if (process.env.APP_URL) {
  const envOrigins = process.env.APP_URL.split(',')
    .map(url => url.trim())
    .filter(url => url.length > 0);
  allowedOrigins.push(...envOrigins);
}

// Helper function to check if origin matches allowed patterns
function isOriginAllowed(origin) {
  if (!origin) return true; // Allow requests with no origin
  
  // Normalize origin by removing trailing slash
  const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();
  
  // Check exact match
  if (allowedOrigins.some(allowed => normalizedOrigin === allowed.replace(/\/$/, '').toLowerCase())) {
    return true;
  }
  
  // Check Netlify app subdomains (*.netlify.app)
  if (/^https:\/\/[\w-]+\.netlify\.app$/.test(normalizedOrigin)) {
    return true;
  }
  
  // Check www variations
  const withoutWww = normalizedOrigin.replace(/^https?:\/\/(www\.)?/, 'https://');
  const withWww = normalizedOrigin.replace(/^https?:\/\//, 'https://www.');
  
  if (allowedOrigins.some(allowed => {
    const normalizedAllowed = allowed.replace(/\/$/, '').toLowerCase();
    return withoutWww === normalizedAllowed || withWww === normalizedAllowed;
  })) {
    return true;
  }
  
  return false;
}

const corsOptions = {
  origin: function (origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      // For development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[CORS] Allowing origin in development: ${origin}`);
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);
        callback(null, false); // Return false instead of error for better compatibility
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours - cache preflight requests for 24 hours
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok', brand: 'Launch & Lift' }));

app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/intakes', intakeRoutes);
app.use('/api/founder-extras', founderExtrasRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin/payment', paymentAdminRoutes);

const clientDistPath = path.resolve(__dirname, '../../frontend/dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');

if (fs.existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    return res.sendFile(clientIndexPath);
  });
}

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  // Connect to MongoDB
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Launch & Lift API running on port ${PORT}`);
    });
  }).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

module.exports = app;
