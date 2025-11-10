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

const app = express();

app.use(cors({ origin: process.env.APP_URL?.split(',') ?? '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok', brand: 'LaunchAndLift' }));

app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/intakes', intakeRoutes);
app.use('/api/founder-extras', founderExtrasRoutes);
app.use('/api/upload', uploadRoutes);

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
      console.log(`LaunchAndLift API running on port ${PORT}`);
    });
  }).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

module.exports = app;
