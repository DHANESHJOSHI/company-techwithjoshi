import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri && process.env.NODE_ENV !== "production") {
  console.warn("Please define the MONGODB_URI environment variable inside .env.local");
}
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 60000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

let cachedDb = null;

export default clientPromise;

export async function getDatabase(dbName = "techwithjoshi") {
  if (cachedDb) return cachedDb;
  const client = await clientPromise;
  cachedDb = client.db(dbName);
  return cachedDb;
}
