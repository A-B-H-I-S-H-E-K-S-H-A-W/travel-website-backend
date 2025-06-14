import { Router } from "express";
import { fetchEvents, getInfoById } from "../controllers/fetch.controller.js";

export const fetchRouter = Router();

fetchRouter.get("/items", fetchEvents);
fetchRouter.get("/info/:id", getInfoById);
