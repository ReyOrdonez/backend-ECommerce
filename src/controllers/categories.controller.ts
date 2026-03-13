import type { NextFunction, Request, Response } from "express";
import { categoryServices } from "../services/categories.services.js";
import {
  createCategoryInput,
  updateCategoryInput,
  categoryOutput,
} from "../schemas/category.schemas.js";
import { prisma } from "../lib/prisma.js";

const categoryServicesModule = categoryServices(prisma);

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryServicesModule.getCategoriesService();
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await categoryServicesModule.getCategoryByIdService(
      Number(id),
    );
    const result = categoryOutput.parse(category);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createCategoryInput.parse(req.body);
    const newCategory =
      await categoryServicesModule.createCategoryService(data);
    return res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryServicesModule.removeCategoryService(
      Number(id),
    );
    const result = categoryOutput.parse(deletedCategory);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = updateCategoryInput.parse(req.body);
    const updatedCategory = await categoryServicesModule.updateCategoryService(
      Number(id),
      data,
    );
    const result = categoryOutput.parse(updatedCategory);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const categoriesController = { getAll, getById, create, remove, update };

export default categoriesController;
