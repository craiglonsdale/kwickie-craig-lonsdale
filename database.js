const mongoose = require('mongoose');
module.exports = function (config) {
  mongoose.connect(config.mongo);
  mongoose.model('shoppingcart', require('./models/shoppingCart'));
  mongoose.model('shoppingitem', require('./models/shoppingItem'));
};
