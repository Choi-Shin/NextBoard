import mongoose from "mongoose";

// mongoose.set("strictQuery", true);
mongoose.set("strictQuery", false);
const connectMongo = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    if (connection.readyState == 1) {
      console.log("Database Connected");
    }
  } catch (errors) {
    console.log(errors);
    return Promise.reject(errors);
  }
};

export default connectMongo;
