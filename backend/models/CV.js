const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  label: { type: String, trim: true, default: '' },
  fileName: { type: String, required: true, trim: true },
  contentType: { type: String, required: true },
  size: { type: Number, default: 0 },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CV', cvSchema);