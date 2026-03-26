import { expect, test, describe, vi } from "vitest";
import { categoryServices } from "../src/services/categories.services.js";
import { NotFoundError } from "../src/errors/errors.classes.js";

// FAKE CATEGORY DATA
const fakeCategory = {
  id: 1,
  name: "Fake Category",
};

const fakeCreateInput = {
  name: "Fake Category",
};

describe("category services", () => {
  test("getCategoriesService returns all categories", async () => {
    const fakePrisma = {
      category: {
        findMany: vi.fn().mockResolvedValue([fakeCategory]),
      },
    };

    const result = await categoryServices(
      fakePrisma as any,
    ).getCategoriesService();

    expect(result).toEqual([fakeCategory]);
    expect(fakePrisma.category.findMany).toHaveBeenCalled();
  });

  test("getCategoriesService returns empty array when no categories exist", async () => {
    const fakePrisma = {
      category: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    };

    const result = await categoryServices(
      fakePrisma as any,
    ).getCategoriesService();

    expect(result).toEqual([]);
    expect(fakePrisma.category.findMany).toHaveBeenCalled();
  });

  test("getCategoryByIdService returns a category by id", async () => {
    const fakePrisma = {
      category: {
        findUnique: vi.fn().mockResolvedValue(fakeCategory),
      },
    };

    const result = await categoryServices(
      fakePrisma as any,
    ).getCategoryByIdService(1);

    expect(result).toEqual(fakeCategory);
    expect(fakePrisma.category.findUnique).toHaveBeenCalled();
  });

  test("getCategoryByIdService throws NotFoundError when category does not exist", async () => {
    const fakePrisma = {
      category: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    };

    await expect(
      categoryServices(fakePrisma as any).getCategoryByIdService(1),
    ).rejects.toThrow(NotFoundError);
  });

  test("createCategoryService creates and returns a new category", async () => {
    const fakePrisma = {
      category: {
        create: vi.fn().mockResolvedValue(fakeCategory),
      },
    };

    const result = await categoryServices(
      fakePrisma as any,
    ).createCategoryService(fakeCreateInput);

    expect(result).toEqual(fakeCategory);
    expect(fakePrisma.category.create).toHaveBeenCalled();
  });

  test("removeCategoryService removes and returns the category", async () => {
    const fakePrisma = {
      category: {
        findUnique: vi.fn().mockResolvedValue(fakeCategory),
        delete: vi.fn().mockResolvedValue(fakeCategory),
      },
    };

    const result = await categoryServices(
      fakePrisma as any,
    ).removeCategoryService(1);

    expect(fakePrisma.category.findUnique).toHaveBeenCalled();
    expect(fakePrisma.category.delete).toHaveBeenCalled();
    expect(result).toEqual(fakeCategory);
  });

  test("removeCategoryService throws NotFoundError when category does not exist and does not call delete", async () => {
    const fakePrisma = {
      category: {
        findUnique: vi.fn().mockResolvedValue(null),
        delete: vi.fn(),
      },
    };

    await expect(
      categoryServices(fakePrisma as any).removeCategoryService(1),
    ).rejects.toThrow(NotFoundError);

    expect(fakePrisma.category.delete).not.toHaveBeenCalled();
  });

  test("updateCategoryService updates and returns the category", async () => {
    const fakePrisma = {
      category: {
        update: vi.fn().mockResolvedValue({ ...fakeCategory, name: "Updated" }),
      },
    };

    const result = await categoryServices(
      fakePrisma as any,
    ).updateCategoryService(1, { name: "Updated" });

    expect(fakePrisma.category.update).toHaveBeenCalled();
    expect(result).toEqual({ ...fakeCategory, name: "Updated" });
  });

  test("updateCategoryService throws NotFoundError when category does not exist", async () => {
    const fakePrisma = {
      category: {
        update: vi.fn().mockRejectedValue(new Error("not found")),
      },
    };

    await expect(
      categoryServices(fakePrisma as any).updateCategoryService(1, {
        name: "Updated",
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
