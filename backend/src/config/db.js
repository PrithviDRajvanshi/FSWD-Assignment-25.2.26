const mongoose = require("mongoose");

const getMongoUri = () => process.env.DATABASE_URL;

const connectDB = async () => {
  const mongoURI = getMongoUri();

  if (!mongoURI) {
    throw new Error("DATABASE_URL is not defined");
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
