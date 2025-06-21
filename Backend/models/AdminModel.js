const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  rut: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
});

module.exports = mongoose.model('Admin', AdminSchema);