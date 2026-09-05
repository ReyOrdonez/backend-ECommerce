import { authorizeRole } from "./../middlewares/roleVerification.middleware.js";
import { Router } from "express";
import categoriesController from "../controllers/categories.controller.js";

const privateCategoriesRouter = Router();

privateCategoriesRouter.get("/", categoriesController.getAll);
privateCategoriesRouter.get("/:id", categoriesController.getById);
privateCategoriesRouter.post(
  "/",
  authorizeRole("ADMIN"),
  categoriesController.create,
);
privateCategoriesRouter.patch(
  "/:id",
  authorizeRole("ADMIN"),
  categoriesController.update,
);
privateCategoriesRouter.delete(
  "/:id",
  authorizeRole("ADMIN"),
  categoriesController.remove,
);

export default privateCategoriesRouter;
