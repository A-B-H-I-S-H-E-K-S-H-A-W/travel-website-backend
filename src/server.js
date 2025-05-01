import app from "./app.js";
import dotenv from "dotenv";
import { mongoDBConnection } from "./db/db.js";
dotenv.config({
  path: "./.env",
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 8000;

mongoDBConnection()
  .then((data) => {
    console.log("MONGO DB CONNECTION ESTABLISHED :::", data.connection.host);
    app.listen(port, () => {
      console.log(`Your server is listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("MONGO DB CONNECTION FAILURE::::....", error);
    process.exit(1);
  });
