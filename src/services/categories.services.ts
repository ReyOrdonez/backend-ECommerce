import { PrismaClient } from "../../prisma/generated/client.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../Schemas/category.schemas.js";

export const categoryServices = (prisma: PrismaClient) => {
  return {
    async getCategoriesService() {
      throw new Error("Not implemented");
    },

    async getCategoryByIdService(id: number) {
      throw new Error("Not implemented");
    },

    async createCategoryService(data: CreateCategoryInput) {
      throw new Error("Not implemented");
    },

    async removeCategoryService(id: number) {
      throw new Error("Not implemented");
    },

    async updateCategoryService(id: number, data: UpdateCategoryInput) {
      throw new Error("Not implemented");
    },
  };
};
