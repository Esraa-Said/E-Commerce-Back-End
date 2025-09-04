const pagination = async (req, Model, filter = {}, populate = "") => {
  const page = +filter.page || 1;
  const limit = +filter.limit || 10;
  const skip = (page - 1) * limit;
  delete filter.page;
  delete filter.limit;
 
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: "i" };
  }

    if (filter.stock) {
    filter.stock = { $regex: filter.stock};
  }
  
  let query = Model.find(filter, { __v: 0 }).skip(skip).limit(limit);

  if (populate) query = query.populate(populate, "name");

  const data = await query;

  const totalDocs = await Model.countDocuments(filter);
  const totalPages = Math.ceil(totalDocs / limit);

  return {
    data,
    page,
    limit,
    totalDocs,
    totalPages,
  };
};

module.exports = pagination;
