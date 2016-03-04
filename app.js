const bodyParser = require('body-parser');
const express = require('express');

module.exports = () => {
  const middleware = require('./routes/middleware');
  const app = express();
  // Setup parsers etc
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  // Routes
  app.use('*', middleware.initializeAPI);
  app.use('/shoppingcart', require('./routes/shoppingCart'));
  app.use('/shoppingitem', require('./routes/shoppingitem'));
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.apiResponse({
      message: err.message,
      error: {}
    });
  });
  return app;
};
