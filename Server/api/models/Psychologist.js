var mongoose = require('mongoose');

var psychSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: Number
  },
  address: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  daysOff: {
    type: [String]
  },
  priceRange: {
    type: Number
  }
});

mongoose.model('Psychologist', psychSchema);