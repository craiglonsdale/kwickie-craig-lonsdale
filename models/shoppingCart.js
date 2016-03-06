const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ShoppingCart = new Schema({
  name: {
    type: String,
    required: true
  }
});

/**
 * Finds all of the shopping carts items and removes them before
 * removing the shopping cart document from the DB
 */
ShoppingCart.pre('remove', next => {
  const ShoppingItem = mongoose.model('shoppingitem');
  return ShoppingItem.remove({ShoppingCart: this._id}, next);
});

module.exports = ShoppingCart;
