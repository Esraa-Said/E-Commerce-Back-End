const mongoose = require("mongoose");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");


const checkDocumentsExistMiddleware = (modelsMap) => {
  return asyncWrapper(async (req, res, next) => {
    for (const [paramName, Model] of Object.entries(modelsMap)) {
      const id = req.params[paramName] || req.body[paramName];

      if (!id) continue;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new CustomError(`Invalid ${Model.modelName} ID format`, 400));
      }

      const query = { _id: id };
      const document = await Model.findOne(query);
      if (!document) {
        return next(new CustomError(`${Model.modelName} not found`, 404));
      }

      const formattedName =
        Model.modelName.charAt(0).toLowerCase() + Model.modelName.slice(1);

      req[formattedName] = document;
    }

    next();
  });
};
module.exports = checkDocumentsExistMiddleware;