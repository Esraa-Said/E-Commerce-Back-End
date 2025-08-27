require("dotenv").config();
const connectDB = require("../config/db");
const Category = require("../models/category-model");
const deleteAll = async () => {
  try {
    await connectDB();
    await Category.deleteMany();
    console.log(`Data Deleted`);
    process.exit(0);
  } catch (err) {
    console.log(`Error in deleting data`, err);
    process.exit(1);
  }
};

if(process.argv[2]==='delete'){
    deleteAll();
}