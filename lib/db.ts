import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var _mongoose: MongooseCache;
}

if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null };
}

const cached: MongooseCache = global._mongoose;

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;
  console.log("Connecting to MongoDB...");

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
    console.log("Connected to MongoDB");
  } catch (err) {
    cached.promise = null; // reset so we can retry on next call
    throw err;
  }

  return cached.conn;
}
