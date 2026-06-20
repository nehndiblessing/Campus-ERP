import mongoose from "mongoose";

let mongoServer;

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (uri) {
      await mongoose.connect(uri);
      console.log("MongoDB Connected");
      return;
    }

    if (process.env.NODE_ENV === "production") {
      console.error("MONGO_URI is required in production");
      process.exit(1);
    }

    const { MongoMemoryServer } = await import("mongodb-memory-server");
    mongoServer = await MongoMemoryServer.create();
    const memUri = mongoServer.getUri();

    await mongoose.connect(memUri);
    console.log("MongoDB Memory Server started and connected");
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;