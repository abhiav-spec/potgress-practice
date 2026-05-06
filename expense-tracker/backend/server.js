import "./src/config/db.js"; // just import once
import app from "./src/app.js";

app.listen(3000, () => {
  console.log("Server running");
});