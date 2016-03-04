const mongoose = require('mongoose');
const ShoppingCart = mongoose.model('shoppingcart');
const ShoppingItem = mongoose.model('shoppingitem');
const helpers = require('./helpers');
/*
 * Creates a new shopping cart entry in the database.
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} sends results via res.json
 */
exports.createShoppingCart = (req, res) => {
  const promise = new ShoppingCart({
    name: req.body.name
  }).save();
  helpers.resolvePromise(res, promise);
};
/**
 * Gets all shopping carts that have been created
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} sends results via res.json
 */
exports.getShoppingCarts = (req, res) => {
  const promise = ShoppingCart.find();
  helpers.resolvePromise(res, promise);
};
/**
 * Gets the shopping cart that has it's id specified in req.params.id
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} sends results via res.json
 */
exports.getShoppingCart = (req, res) => {
  const promise = ShoppingCart.findById(req.params.id);
  helpers.resolvePromise(res, promise);
};
/**
 * Gets the items in a shopping cart that has it's id specified in req.params.id
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} sends results via res.json
 */
exports.getShoppingCartItems = (req, res) => {
  const promise = ShoppingItem.find({shoppingCart: req.params.id})
    .then(data => {
      return data.map(item => {
        return { description: item.description };
      });
    });
  helpers.resolvePromise(res, promise);
};
/**
 * Deletes the shopping cart that has it's id specified in req.params.id
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} sends results via res.json
 */
exports.deleteShoppingCart = (req, res) => {
  const promise = ShoppingCart.findById(req.params.id)
    .then(cart => {
      // Have to do it this way so my pre remove hook gets fired
      // and the items in the cart get cleaned up
      if (cart) {
        return cart.remove();
      }
      return cart;
    });
  helpers.resolvePromise(res, promise);
};
/**
 * Updates the shopping cart that has it's id specified in req.params.id
 * with the data on req.body
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} ends results via res.json
 */
exports.updateShoppingCart = (req, res) => {
  const promise = ShoppingCart.findByIdAndUpdate({_id: req.params.id},
    req.body);
  helpers.resolvePromise(res, promise);
};
