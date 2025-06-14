import { Router } from "express";
import { fetchEvents } from "../controllers/fetch.controller";

export const fetchRouter = Router();

fetchRouter.get("/", fetchEvents);
