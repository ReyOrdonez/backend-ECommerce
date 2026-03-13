import { Router } from "express";
import categoriesController from "../controllers/categories.controller.js";

const privateCategoriesRouter = Router();

privateCategoriesRouter.get("/", categoriesController.getAll);
privateCategoriesRouter.get("/:id", categoriesController.getById);
privateCategoriesRouter.post("/", categoriesController.create);
privateCategoriesRouter.patch("/:id", categoriesController.update);
privateCategoriesRouter.delete("/:id", categoriesController.remove);

export default privateCategoriesRouter;
