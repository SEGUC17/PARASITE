var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var productSchema = mongoose.Schema({
  acquiringType: {
    enum: [
      'rent',
      'sell',
      'rent/sell'
    ],
    required: true,
    trim: true,
    type: String
  },
  createdAt: {
    default: Date.now,
    type: Date
  },
  description: {
    trim: true,
    type: String
  },
  image: {
    trim: true,
    type: String
  },
  name: {
    required: true,
    trim: true,
    type: String
  },
  price: {
    min: 0,
    required: true,
    type: Number
  },
  //in days
  rentPeriod: {
    min: 1,
    required: false,
    type: Number
  },
  seller: {
    required: true,
    trim: true,
    // hyperlink to user's profile
    type: String
  }
});
productSchema.plugin(mongoosePaginate);
mongoose.model('Product', productSchema, 'products');
