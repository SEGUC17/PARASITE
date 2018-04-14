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
  editID: {
    required: false,
    trim: true,
    type: String
  },
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
  priceRange: { type: Number },
  type: {
    default: 'add',
    enum: [
    'add',
    'edit'
    ],
    required: false,
    trim: true,
    type: String
  }
});

mongoose.model('PsychologistRequest', psychReqSchema, 'psychologistrequests');
