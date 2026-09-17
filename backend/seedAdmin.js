const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');

async function seedAdmin() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is required');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`Admin "${username}" already exists. Skipping.`);
  } else {
    await Admin.createAdmin(username, password);
    console.log(`Admin "${username}" created successfully.`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seedAdmin().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
