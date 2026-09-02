
import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();


/*
|--------------------------------------------------------------------------
| SERVER PORT
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 5000;


/*
|--------------------------------------------------------------------------
| CONNECT DATABASE → START SERVER
|--------------------------------------------------------------------------
*/
connectDB()
  .then(() => {

    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on http://localhost:${PORT}`
        );
      }
    );

  })
  .catch((err) => {

    console.error(
      "Database connection failed:",
      err
    );

    process.exit(1);

  });