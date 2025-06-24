const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Ensure this model exists

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('📩 Received contact form:', req.body);

  try {
    const contact = new Contact({ name, email, message });
    const saved = await contact.save();
    console.log('✅ Contact saved:', saved);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('❌ Error saving contact:', err);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

// GET /api/contact/all (for debug/admin only)
router.get('/all', async (req, res) => {
  try {
    const allContacts = await Contact.find();
    res.json(allContacts);
  } catch (err) {
    console.error('❌ Failed to fetch contacts:', err);
    res.status(500).json({ error: 'Error retrieving contacts' });
  }
});

module.exports = router;
