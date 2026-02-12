import { Router } from "express";
import usersController from "../controllers/users.controller";

const router = Router();

router.get("/", usersController.getAll);

router.post("/register", usersController.create);

router.get("/:id", usersController.getById);

router.delete("/:id", usersController.remove);

router.patch("/:id", usersController.update);

export default router;
