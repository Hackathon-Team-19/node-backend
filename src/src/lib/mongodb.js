import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

if (!process.env.MONGODB_URI || !process.env.DATABASE) {
    throw new Error("No database connection string or database name provided");
}

let db = null;

async function connectToDatabase() {
    try {
        const connection = await MongoClient.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1,
        });

        console.log("MongoDB connection established");

        db = connection.db(process.env.DATABASE);
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export { connectToDatabase, db };
