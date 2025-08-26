const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      dbName: process.env.MONGO_DB_NAME,
    });
    console.log(`✅ DataBase Connection Success`);
    
  } catch (error) {
    console.log(`❌ DataBase Connection Error ${error} `);
  }
};

module.exports = connectDB;