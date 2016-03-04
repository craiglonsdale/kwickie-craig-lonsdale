/**
 * Initialize the route with API support
 */
exports.initializeAPI = (req, res, next) => {
  res.apiSuccess = data => {
    res.json(data);
  };
  res.apiError = err => {
    res.status(502).json({ error: err });
  };
  res.apiResponse = (err, data) => {
    if (err) {
      return res.apiError(err);
    }
    return res.apiSuccess(data);
  };
  return next();
};

exports.initalizeErrors = (req, res, next) => {
  res.error = () => {
    return res.status(500).render('errors/500');
  };
  return next();
};

exports.shoppingCart = require('./shoppingCart');
exports.shoppingItem = require('./shoppingItem');
