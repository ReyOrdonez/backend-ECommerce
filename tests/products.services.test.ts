import { expect, test, describe, vi } from "vitest";
import { productServices } from "../src/services/products.services.js";
import { NotFoundError } from "../src/errors/errors.classes.js";

// FAKE PRODUCT DATA
const fakeProduct = {
  id: 1,
  name: "Fake Product",
  price: 9.99,
  stock: 10,
  createdAt: new Date("2026-01-01"),
  categoryId: 1,
};

const fakeCreateInput = {
  name: "Fake Product",
  price: 9.99,
  stock: 10,
  categoryId: 1,
};

describe("product services", () => {
  test("getProductsService returns all products", async () => {
    const fakePrisma = {
      product: {
        findMany: vi.fn().mockResolvedValue([fakeProduct]),
      },
    };

    const result = await productServices(
      fakePrisma as any,
    ).getProductsService();

    expect(result).toEqual([fakeProduct]);
    expect(fakePrisma.product.findMany).toHaveBeenCalled();
  });

  test("getProductByIdService returns a product by id", async () => {
    const fakePrisma = {
      product: {
        findUnique: vi.fn().mockResolvedValue(fakeProduct),
      },
    };

    const result = await productServices(
      fakePrisma as any,
    ).getProductByIdService(1);

    expect(result).toEqual(fakeProduct);
  });

  test("getProductByIdService throws NotFoundError when product does not exist", async () => {
    const fakePrisma = {
      product: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    };

    await expect(
      productServices(fakePrisma as any).getProductByIdService(1),
    ).rejects.toThrow(NotFoundError);
  });

  test("createProductService creates and returns a new product", async () => {
    const fakePrisma = {
      product: {
        create: vi.fn().mockResolvedValue(fakeProduct),
      },
    };

    const result = await productServices(
      fakePrisma as any,
    ).createProductService(fakeCreateInput);

    expect(result).toEqual(fakeProduct);
  });

  test("removeProductService removes and returns the product", async () => {
    const fakePrisma = {
      product: {
        findUnique: vi.fn().mockResolvedValue(fakeProduct),
        delete: vi.fn().mockResolvedValue(fakeProduct),
      },
    };

    const result = await productServices(
      fakePrisma as any,
    ).removeProductService(1);

    expect(fakePrisma.product.findUnique).toHaveBeenCalled();
    expect(fakePrisma.product.delete).toHaveBeenCalled();
    expect(result).toEqual(fakeProduct);
  });

  test("removeProductService throws NotFoundError when product does not exist and does not call delete", async () => {
    const fakePrisma = {
      product: {
        findUnique: vi.fn().mockResolvedValue(null),
        delete: vi.fn(),
      },
    };

    await expect(
      productServices(fakePrisma as any).removeProductService(1),
    ).rejects.toThrow(NotFoundError);

    expect(fakePrisma.product.delete).not.toHaveBeenCalled();
  });

  test("updateProductService updates and returns the product", async () => {
    const fakePrisma = {
      product: {
        update: vi.fn().mockResolvedValue({ ...fakeProduct, name: "Updated" }),
      },
    };

    const result = await productServices(
      fakePrisma as any,
    ).updateProductService(1, { name: "Updated" });

    expect(fakePrisma.product.update).toHaveBeenCalled();
    expect(result).toEqual({ ...fakeProduct, name: "Updated" });
  });

  test("updateProductService throws NotFoundError when product does not exist", async () => {
    const fakePrisma = {
      product: {
        update: vi.fn().mockRejectedValue(new Error("not found")),
      },
    };

    await expect(
      productServices(fakePrisma as any).updateProductService(1, {
        name: "Updated",
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
