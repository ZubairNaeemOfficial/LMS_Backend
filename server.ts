import { app } from "./app";
import connectDB from "./utils/db";
require("dotenv").config();

// Create the server
 connectDB()
app.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
   
})