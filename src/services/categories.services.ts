import { PrismaClient } from "../../prisma/generated/client.js";
import {
  AlreadyExistsError,
  NotFoundError,
  BadRequestError,
} from "../errors/errors.classes.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/category.schemas.js";

export const categoryServices = (prisma: PrismaClient) => {
  return {
    async getCategoriesService() {
      const categories = await prisma.category.findMany();
      return categories;
    },

    async getCategoryByIdService(id: number) {
      const result = await prisma.category.findUnique({
        where: { id },
      });
      if (!result) throw new NotFoundError("Category not found");
      return result;
    },

    async createCategoryService(data: CreateCategoryInput) {
      const categoryExist = await prisma.category.findUnique({
        where: {
          name: data.name,
        },
      });
      if (categoryExist) {
        throw new AlreadyExistsError("Category already exists");
      }

      const newCategory = await prisma.category.create({
        data: data,
      });

      return newCategory;
    },

    async removeCategoryService(id: number) {
      const categoryToRemove = await prisma.category.findUnique({
        where: { id },
        include: { products: true },
      });
      if (!categoryToRemove) throw new NotFoundError("Category not found");
      if (categoryToRemove.products && categoryToRemove.products.length > 0) {
        throw new BadRequestError(
          "Cannot delete category with associated products",
        );
      }

      const categoryRemoved = await prisma.category.delete({
        where: { id },
      });

      return categoryRemoved;
    },

    async updateCategoryService(id: number, data: UpdateCategoryInput) {
      const categoryToUpdate = await prisma.category.findUnique({
        where: { id },
      });
      const nameExists = await prisma.category.findUnique({
        where: { name: data.name },
      });
      if (nameExists) throw new AlreadyExistsError("Category already exists");
      if (!categoryToUpdate) throw new NotFoundError("not found");
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: { ...data },
      });

      return updatedCategory;
    },
  };
};
