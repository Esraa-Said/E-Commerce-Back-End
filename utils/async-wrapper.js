const asyncWrapper = (fun) => {
  return (req, res, next) => {

    // Convert to Promise if not async function
    Promise.resolve(fun(req, res, next)).catch((error) => next(error));
  };
};

module.exports = asyncWrapper;