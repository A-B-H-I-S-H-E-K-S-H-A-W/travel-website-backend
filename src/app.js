import express from "express";
import cors from "cors";
import fu from "express-fileupload";
import { router } from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(fu());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/users", router);

export default app;
