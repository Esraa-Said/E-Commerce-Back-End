const pagination = async (req,Model, filter = {}, populate = "")=>{


     const page = +req.query?.page || 1;
     const limit = +req.query?.limit || 10;
     const skip = (page - 1) * limit;
    
    
    let query = Model.find(filter, {__v: 0}).skip(skip).limit(limit);

    if(populate) query = query.populate(populate);

    const data = await query;


    const totalDocs = await Model.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs/limit);

    return {
        data, page, limit, totalDocs, totalPages
    }

}

module.exports = pagination;