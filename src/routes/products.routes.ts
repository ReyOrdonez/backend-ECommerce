import { Router } from "express";
import productsController from "../controllers/products.controller.js";

export const publicProductsRouter = Router();

publicProductsRouter.get("/", productsController.getAll);
publicProductsRouter.get("/:id", productsController.getById);

export const privateProductsRouter = Router();

privateProductsRouter.post("/", productsController.create);
privateProductsRouter.patch("/:id", productsController.update);
privateProductsRouter.delete("/:id", productsController.remove);
