var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
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

psychSchema.index(
{
  firstName: 'text',
  lastName: 'text'
},
{ name: 'psychologistIndex' }
);

psychSchema.plugin(mongoosePaginate);
var psychologist = mongoose.model('Psychologist', psychSchema, 'psychologists');
psychologist.ensureIndexes();
