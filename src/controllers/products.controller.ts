import type { NextFunction, Request, Response } from "express";
import { productServices } from "../services/products.services.js";
import {
  createProductInput,
  updateProductInput,
  productOutput,
} from "../schemas/product.schemas.js";
import { prisma } from "../lib/prisma.js";

const productServicesModule = productServices(prisma);

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productServicesModule.getProductsService();
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await productServicesModule.getProductByIdService(Number(id));
    const result = productOutput.parse(product);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createProductInput.parse(req.body);
    const newProduct = await productServicesModule.createProductService(data);
    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productServicesModule.removeProductService(Number(id));
    const result = productOutput.parse(deletedProduct);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = updateProductInput.parse(req.body);
    const updatedProduct = await productServicesModule.updateProductService(Number(id), data);
    const result = productOutput.parse(updatedProduct);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const productsController = { getAll, getById, create, remove, update };

export default productsController;
