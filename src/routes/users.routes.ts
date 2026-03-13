import { Router } from "express";
import usersController from "../controllers/users.controller.js";

export const publicUsersRouter = Router();

publicUsersRouter.post("/register", usersController.create);

export const privateUsersRouter = Router();

privateUsersRouter.get("/", usersController.getAll);

privateUsersRouter.get("/:id", usersController.getById);

privateUsersRouter.delete("/:id", usersController.remove);

privateUsersRouter.patch("/:id", usersController.update);
