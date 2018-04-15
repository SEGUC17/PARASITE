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
psychSchema.index({
      firstName: 'text',
      lastName: 'text'
  });

var psychologist = mongoose.model('Psychologist', psychSchema, 'psychologists');
psychologist.ensureIndexes();
