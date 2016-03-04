const mongoose = require('mongoose');
const ShoppingItem = mongoose.model('shoppingitem');
const helpers = require('./helpers');
/**
 * Creates a new shopping item entry in the database.
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} sends results via res.json
 */
exports.createShoppingItem = (req, res) => {
  const promise = new ShoppingItem({
    description: req.body.description,
    shoppingCart: req.body.shoppingCart
  }).save();
  helpers.resolvePromise(res, promise);
};
/**
 * Gets all shopping items that have been created
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} sends results via res.json
 */
exports.getShoppingItems = (req, res) => {
  const promise = ShoppingItem.find()
    .populate('shoppingCart');
  helpers.resolvePromise(res, promise);
};
/**
 * Gets the shopping item that has it's id specified in req.params.id
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} sends results via res.json
 */
exports.getShoppingItem = (req, res) => {
  const promise = ShoppingItem.findById(req.params.id)
    .populate('shoppingCart');
  helpers.resolvePromise(res, promise);
};
/**
 * Gets the car of the shopping item that has it's id specified in req.params.id
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} sends results via res.json
 */
exports.getShoppingItemCart = (req, res) => {
  const promise = ShoppingItem.findOne(req.params.id)
    .populate('shoppingCart')
    .then(item => {
      return item.shoppingcart;
    });
  helpers.resolvePromise(res, promise);
};
/**
 * Deletes the shopping item that has it's id specified in req.params.id
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} sends results via res.json
 */
exports.deleteShoppingItem = (req, res) => {
  const promise = ShoppingItem.findById(req.params.id).remove();
  helpers.resolvePromise(res, promise);
};
/**
 * Updates the shopping item that has it's id specified in req.params.id
 * with the data on req.body
 * @param {object} Request Objects
 * @param {object} Response Object
 * @return {json} ends results via res.json
 */
exports.updateShoppingItem = (req, res) => {
  const promise = ShoppingItem.findByIdAndUpdate({_id: req.params.id},
    req.body);
  helpers.resolvePromise(res, promise);
};
