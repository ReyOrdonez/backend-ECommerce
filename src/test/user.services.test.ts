import { expect, test, describe, vi } from "vitest";
import { userServices } from "../services/users.services.js";
import { NotFoundError, AlreadyExistsError } from "../errors/errors.classes.js";

//FAKE USER DATA
const fakeUser = {
  username: "Fakeuser",
  email: "fakeemail@gmail.com",
  password: "fakepassword",
};

describe("user services", () => {
  test("getUsers service return all users with no password", async () => {
    const fakePrisma = {
      user: {
        findMany: vi
          .fn()
          .mockResolvedValue([
            { id: 1, username: "fakeUser", email: "fakeuser@gmail.com" },
          ]),
      },
    };
    const result = await userServices(
      fakePrisma as any,
      {} as any,
    ).getUsersService();
    //EXPECT
    expect(result).toEqual([
      { id: 1, username: "fakeUser", email: "fakeuser@gmail.com" },
    ]);
    expect(fakePrisma.user.findMany).toHaveBeenCalledWith({
      orderBy: {
        id: "asc",
      },
      select: { id: true, username: true, email: true },
    });
  });
  test("gerUserById returns an user with no password", async () => {
    const fakePrisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: 1,
          username: "fakeuser",
          email: "fakeuser@gmail.com",
        }),
      },
    };
    const result = await userServices(
      fakePrisma as any,
      {} as any,
    ).getUserByIdService(1);

    //expect
    expect(result).toEqual({
      id: 1,
      username: "fakeuser",
      email: "fakeuser@gmail.com",
    });
    expect(fakePrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { id: true, username: true, email: true },
    });
  });
  test("getUserById throws an NotFoundError if users doesnt exist", async () => {
    const fakePrisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    };
    const users = userServices(fakePrisma as any, {} as any);

    //EXPECT
    await expect(users.getUserByIdService(1)).rejects.toThrow(NotFoundError);
  });
  test("createUser stops and throws a AlreadyExistError when email already exists", async () => {
    //MOCK PRISMA
    const fakePrisma = {
      user: {
        findUnique: vi
          .fn()
          .mockResolvedValue({ id: "fakeId", username: "fake user" }),
        create: vi.fn(),
      },
    };
    //MOCK BCRYPT
    const fakeBcrypt = {
      hash: vi.fn().mockResolvedValue("hashedPassword"),
    };
    //INITIALIZE USERS
    const users = userServices(fakePrisma as any, fakeBcrypt as any);

    //EXPETC
    await expect(users.createUserService(fakeUser)).rejects.toThrow(
      AlreadyExistsError,
    );

    expect(fakePrisma.user.create).not.toHaveBeenCalled();
  });
  test("createUser hash the password before create a new user then creates and returns a new user", async () => {
    //MOCK PRISMA
    const fakePrisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: 1, username: "fakeuser" }),
      },
    };
    //MOCK BCRYPT
    const fakeBcrypt = {
      hash: vi.fn().mockResolvedValue("hashedPassword"),
    };

    //INITIALIZE USERS
    const users = userServices(fakePrisma as any, fakeBcrypt as any);
    //SERVICE CALL
    const result = await users.createUserService(fakeUser);
    //EXPECTS
    expect(fakeBcrypt.hash).toHaveBeenCalledWith(fakeUser.password, 8);
    expect(fakePrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          password: "hashedPassword",
          username: fakeUser.username,
          email: fakeUser.email,
        }),
        select: expect.objectContaining({
          id: true,
          username: true,
        }),
      }),
    );
    expect(result).toEqual({ id: 1, username: "fakeuser" });
  });
  test("removeUser removes and returns a user", async () => {
    //fake prisma
    const fakePrisma = {
      user: {
        delete: vi.fn().mockResolvedValue(fakeUser),
        findUnique: vi.fn().mockResolvedValue(fakeUser),
      },
    };

    const result = await userServices(
      fakePrisma as any,
      {} as any,
    ).removeUserService(1);

    //EXPECT
    expect(fakePrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(fakePrisma.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(fakeUser);
  });
  test("removeUser service throws an NotFoundError if user doesnt exist and stops(doesnt execute user.delete)", async () => {
    //fake prisma
    const fakePrisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue(null),
        delete: vi.fn(),
      },
    };
    //MOCK BCRYPT
    const fakeBcrypt = {
      hash: vi.fn().mockResolvedValue("hashedPassword"),
    };
    //INITIALIZE USER SERVICES
    const users = userServices(fakePrisma as any, fakeBcrypt as any);

    //EXPECT
    await expect(users.removeUserService(1)).rejects.toThrow(NotFoundError);
    expect(fakePrisma.user.delete).not.toHaveBeenCalled();
  });

  test("updateUser updates and returns and user with no password", async () => {
    const fakePrisma = {
      user: {
        update: vi.fn().mockResolvedValue({
          id: 1,
          username: "fakeuser",
        }),
      },
    };
    const result = await userServices(
      fakePrisma as any,
      {} as any,
    ).updateUserService(1, {});

    //EXPECT
    expect(fakePrisma.user.update).toHaveBeenCalledWith({
      data: {},
      where: {
        id: 1,
      },
      select: {
        id: true,
        username: true,
      },
    });
    expect(result).toEqual({ id: 1, username: "fakeuser" });
  });
  test("updateUser hash the password and calls update with hashed password", async () => {
    const fakePrisma = {
      user: {
        update: vi.fn().mockResolvedValue({ id: 1, username: "username" }),
      },
    };
    const fakeBcrypt = {
      hash: vi.fn().mockResolvedValue("hashedPassword"),
    };
    const result = await userServices(
      fakePrisma as any,
      fakeBcrypt as any,
    ).updateUserService(1, {
      username: "newFakeUsername",
      password: "newFakePassword",
    });
    //EXPECT
    expect(fakeBcrypt.hash).toHaveBeenCalledWith("newFakePassword", 8);
    expect(fakePrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          password: "hashedPassword",
        }),
      }),
    );
  });
  test("updateUser throws an NotFoundError if user doesnt exist", async () => {
    const fakePrisma = {
      user: {
        update: vi.fn().mockRejectedValue(new Error("not found")),
      },
    };
    const fakeBcrypt = {
      hash: vi.fn(),
    };
    const service = userServices(fakePrisma as any, fakeBcrypt as any);
    const promise = service.updateUserService(1, {
      username: "fakeUser",
    });

    //EXPECT
    await expect(promise).rejects.toThrow(NotFoundError);
  });
});
