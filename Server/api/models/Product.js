var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  seller: {
    type: String,  // hyperlink to user's profile
    required: true,
    trim: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  acquiringType: { // rent\sell
    type: String,
    required: true,
    trim: true
  },
  rentPeriod: {   // in days
    type: Number,
    min: 1
  },
  description: {
    type: String,
    trim: true
  },
  state: {        // Approved\Pending
    type: String,
    default: "Pending",
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Product', productSchema);