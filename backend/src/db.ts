import mongoose from "mongoose";

// Read .env into process.env. A variable that is already set (terminal, hosting platform) wins.

export async function connectToDatabase(): Promise<void> {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log(`Connected to MongoDB database "${mongoose.connection.name}"`);
}
