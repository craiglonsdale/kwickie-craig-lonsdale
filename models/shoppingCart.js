const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ShoppingCart = new Schema({
  name: {
    type: String,
    required: true
  }
});

ShoppingCart.pre('remove', next => {
  const ShoppingItem = mongoose.model('shoppingitem');
  ShoppingItem.remove({ShoppingCart: this._id}).exec();
  return next();
});

module.exports = ShoppingCart;
