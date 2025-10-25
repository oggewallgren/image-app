import mongoose from "mongoose";
import { app } from "./app.js";

const DB_URL = process.env.DB_HOST || "mongodb://127.0.0.1/image-app-db";
const PORT = process.env.PORT || 3002;

// Setup db connection
mongoose
  .connect(DB_URL)
  .then(() => console.log("Database connection established successfully"))
  .catch((_err) => console.error("Error occurred while connecting to DB!"));

// Run the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
