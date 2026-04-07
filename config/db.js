const mongoose = require("mongoose");

const getMongoUri = () => {
  if (process.env.NODE_ENV === "test") {
    return (
      process.env.MONGODB_URI_TEST ||
      process.env.MONGO_URI_TEST ||
      process.env.MONGODB_URI ||
      process.env.MONGO_URI
    );
  }

  return process.env.MONGODB_URI || process.env.MONGO_URI;
};

const connectDB = async () => {
  const mongoURI = getMongoUri();

  if (!mongoURI) {
    throw new Error("MongoDB URI is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const conn = await mongoose.connect(mongoURI);
  if (process.env.NODE_ENV !== "test") {
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  }
  return conn.connection;
};

const clearDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  const { collections } = mongoose.connection;
  const deleteOperations = Object.values(collections).map((collection) =>
    collection.deleteMany({})
  );

  await Promise.all(deleteOperations);
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.connection.close();
};

module.exports = {
  connectDB,
  disconnectDB,
  clearDatabase,
  getMongoUri,
};
