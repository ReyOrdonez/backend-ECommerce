import { authorizeRole } from "./../middlewares/roleVerification.middleware.js";
import { Router } from "express";
import productsController from "../controllers/products.controller.js";

export const publicProductsRouter = Router();

publicProductsRouter.get("/", productsController.getAll);
publicProductsRouter.get("/:id", productsController.getById);

export const privateProductsRouter = Router();

privateProductsRouter.post(
  "/",
  authorizeRole("ADMIN"),
  productsController.create,
);
privateProductsRouter.patch(
  "/:id",
  authorizeRole("ADMIN"),
  productsController.update,
);
privateProductsRouter.delete(
  "/:id",
  authorizeRole("ADMIN"),
  productsController.remove,
);
