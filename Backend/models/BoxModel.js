const mongoose = require('mongoose');

const BoxSchema = new mongoose.Schema({
  piso: Number,
  box: Number,
});

module.exports = mongoose.model('Box', BoxSchema);