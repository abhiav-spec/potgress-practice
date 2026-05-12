import dotenv from "dotenv";

dotenv.config();

import app from "./src/app.js";

import { connectDB } from "./src/config/db.js";



const PORT =
  process.env.PORT || 3000;



// CONNECT DATABASE
await connectDB();



// START SERVER
app.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});