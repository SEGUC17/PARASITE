var mongoose = require('mongoose');

var psychReqSchema = mongoose.Schema({
  address: {
    trim: true,
    type: String
  },
  createdAt: {
    default: Date.now,
    type: Date
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

mongoose.model('PsychologistRequest', psychReqSchema, 'psychologistRequests');
