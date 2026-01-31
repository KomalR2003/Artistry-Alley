import mongoose from "mongoose";

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "ArtDB",
    });

    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

export default dbConnect;
