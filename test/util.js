const request = require('supertest-as-promised');
const config = require('../test.js');
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
mockgoose(mongoose);
require('../database')(config, mongoose);
const app = require('../app')(config);

app.listen(config.port, function () {
  console.log(`Kwickie - Craig Lonsdale - ${config.env}`);
});
/**
 * Creates a new Shopping Cart object in the database
 * @param {String} Name for the shopping cart
 **/
exports.createShoppingCart = (name) => {
  const body = {
    name: name
  };
  return request('http://localhost:3000')
  .post('/shoppingcart')
  .send(body);
};
/**
 * Creates a new Shopping Item object in the database
 * @param {String} Description for the shopping item
 * @param {ObjectId} Id the shopping cart it belongs to
 **/
exports.createShoppingItem = (description, cartId) => {
  const body = {
    description: description,
    shoppingCart: cartId
  };
  return request('http://localhost:3000')
  .post('/shoppingitem')
  .send(body);
};
