exports.resolvePromise = (res, promise) => {
  promise.then(data => {
    res.apiResponse(null, data);
  }).catch(err => {
    res.apiResponse(err);
  });
};
