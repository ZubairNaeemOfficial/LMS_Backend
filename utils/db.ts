import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbURL: string ='mongodb+srv://zubairrr:mhjk1234@lms.pxjdfaj.mongodb.net/';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dbURL,{
        dbName: "lms", 
    });
    console.log(`DB is connected: ${connection.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to the database: ${error.message}`);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

export default connectDB;
