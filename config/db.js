const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Warning: MongoDB connection error: ${error.message}`);
    console.log("Server will start without database connection");
  }
};

module.exports = connectDB;
