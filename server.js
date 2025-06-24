const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const otpRoutes = require('./routes/otp');
const faqRoutes = require('./routes/faqs');
const contactRoutes = require('./routes/contact'); // ✅ Moved up

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/otp', otpRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/contact', contactRoutes); // ✅ Moved before listen

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
