import mongoose from "mongoose";
async function connectDB() {
   try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("connected to the database");
   } catch (err) {
      console.log("Database connection error:", err);
      process.exit(1);
   }
}
export default connectDB;