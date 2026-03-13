import { PrismaClient } from "../../prisma/generated/client.js";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schemas.js";

export const productServices = (prisma: PrismaClient) => {
  return {
    async getProductsService() {
      throw new Error("Not implemented");
    },

    async getProductByIdService(id: number) {
      throw new Error("Not implemented");
    },

    async createProductService(data: CreateProductInput) {
      throw new Error("Not implemented");
    },

    async removeProductService(id: number) {
      throw new Error("Not implemented");
    },

    async updateProductService(id: number, data: UpdateProductInput) {
      throw new Error("Not implemented");
    },
  };
};
