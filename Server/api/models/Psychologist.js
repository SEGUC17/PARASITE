var mongoose = require('mongoose');

var psychSchema = mongoose.Schema({
  address: {
    trim: true,
    type: String
  },
  daysOff: { type: [String] },
  email: {
    required: true,
    trim: true,
    type: String
  },
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
  phone: { type: String },
  priceRange: { type: Number }
});

mongoose.model('Psychologist', psychSchema, 'psychologists');
