/**
 * Sends the data or error that is returned by the promise as an api response
 * @param {Object} res Object
 * @param {Promise} promise that will return a data or error
 */
exports.resolvePromise = (res, promise) => {
  promise.then(data => {
    res.apiResponse(null, data);
  }).catch(err => {
    res.apiResponse(err);
  });
};
