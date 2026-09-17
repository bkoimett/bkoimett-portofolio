const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

adminSchema.methods.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

adminSchema.statics.createAdmin = async function (username, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  return this.create({ username, passwordHash });
};

module.exports = mongoose.model('Admin', adminSchema);
