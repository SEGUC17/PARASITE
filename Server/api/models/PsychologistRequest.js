var mongoose = require('mongoose');

var psychReqSchema = mongoose.Schema({
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('PsychologistRequest', psychReqSchema);