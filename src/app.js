import express from "express";
import cors from "cors";
import fu from "express-fileupload";
import { userRouter } from "./routes/user.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { superAdminRouter } from "./routes/superadmin.routes.js";

const app = express();

app.use(cors());
app.use(fu());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/super-admin", superAdminRouter);

export default app;
