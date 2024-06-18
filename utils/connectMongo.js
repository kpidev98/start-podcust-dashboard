import mongoose from "mongoose";
const DB_HOST = process.env.MONGO_URI;

async function connectDatabase() {
  try {
    await mongoose.connect(DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}

export default connectDatabase;
