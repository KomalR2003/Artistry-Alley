import mongoose from "mongoose";
import dns from "dns";

// Configure Node.js to use public DNS servers (Cloudflare/Google) 
// to resolve MongoDB Atlas SRV DNS lookup issues (querySrv ECONNREFUSED)
try {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (err) {
  console.warn("Failed to set custom DNS servers:", err.message);
}

const MONGODB_URI = process.env.MONGODB_URI;

// Maintain connection cache across hot reloads in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined in environment variables. Please check your .env or .env.local file."
    );
  }

  if (!cached.promise) {
    const opts = {
      dbName: "ArtDB",
      bufferCommands: false, // Disable Mongoose buffering so operations fail fast if not connected
      family: 4,             // Force IPv4 resolution to avoid IPv6 handshake issues
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("MongoDB connected successfully");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Clear failed connection promise so subsequent requests can retry
    console.error("MongoDB connection failed:", error);
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
