var mongoose = require('mongoose');

var psychSchema = mongoose.Schema({
  firstName: {
    required: true,
    trim: true,
    type: String
  },
  lastName: {
    required: true,
    trim: true,
    type: String
  },
  phone: {
    type: String
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