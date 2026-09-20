import { PrismaClient } from "../../prisma/generated/client.js";
import { NotFoundError } from "../errors/errors.classes.js";

import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schemas.js";

export const productServices = (prisma: PrismaClient) => {
  return {
    async getProductsService() {
      const products = await prisma.product.findMany();

      return products;
    },

    async getProductByIdService(id: number) {
      const product = await prisma.product.findUnique({
        where: { id },
      });
      if (!product) throw new NotFoundError("Product not found");
      return product;
    },

    async createProductService(data: CreateProductInput) {
      const newProduct = await prisma.product.create({
        data: { ...data },
      });
      return newProduct;
    },

    async removeProductService(id: number) {
      const findProduct = await prisma.product.findUnique({
        where: { id },
      });
      if (!findProduct) throw new NotFoundError("Product not found");
      const removeProduct = await prisma.product.delete({
        where: { id },
      });
      return removeProduct;
    },

    async updateProductService(id: number, data: UpdateProductInput) {
      const findProduct = await prisma.product.findUnique({
        where: { id },
      });
      if (!findProduct) throw new NotFoundError("Product not found");
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { ...data },
      });

      return updatedProduct;
    },
  };
};
