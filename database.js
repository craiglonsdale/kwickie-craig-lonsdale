module.exports = function (config, database) {
  database.connect(config.mongo);
  database.model('shoppingcart', require('./models/shoppingCart'));
  database.model('shoppingitem', require('./models/shoppingItem'));
};
