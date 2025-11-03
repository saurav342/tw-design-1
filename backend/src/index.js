require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const contentRoutes = require('./routes/contentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const intakeRoutes = require('./routes/intakeRoutes');
const founderExtrasRoutes = require('./routes/founderExtrasRoutes');

const app = express();

app.use(cors({ origin: process.env.APP_URL?.split(',') ?? '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok', brand: 'LaunchAndLift' }));

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/intakes', intakeRoutes);
app.use('/api/founder-extras', founderExtrasRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`LaunchAndLift API running on port ${PORT}`);
  });
}

module.exports = app;
