import express from "express";
import cors from "cors";
import fu from "express-fileupload";
import { userRouter } from "./routes/user.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { superAdminRouter } from "./routes/superadmin.routes.js";
import { busRouter } from "./routes/bus.routes.js";
import { hotelRouter } from "./routes/hotel.routes.js";
import { flightRouter } from "./routes/flight.routes.js";
import { bookingRouter } from "./routes/booking.routes.js";

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
app.use("/api/bus", busRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/flight", flightRouter);
app.use("/api/booking", bookingRouter);

export default app;
