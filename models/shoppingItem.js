const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ShoppingItem = new Schema({
  description: {
    type: String,
    required: true
  },
  shoppingCart: {
    type: ObjectId,
    ref: 'shoppingcart',
    required: true
  }
});

module.exports = ShoppingItem;
