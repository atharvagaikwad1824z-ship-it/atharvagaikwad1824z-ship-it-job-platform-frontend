const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log(process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

module.exports = connectDB;