import { expect, test, describe, vi, beforeEach } from "vitest";

import { authService } from "../src/services/auth.services.js";
import { IncorrectPasswordOrEmail } from "../src/errors/errors.classes.js";

describe("auth services", () => {
  beforeEach(() => {
    process.env.SECRET_JWT_KEY = "test-secret";
  });

  test("login returns user data and token", async () => {
    const fakePrisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: 1,
          username: "fakeuser",
          email: "fakeuser@example.com",
          password: "hashedpassword",
          role: "USER",
        }),
      },
    };
    const fakeBcrypt = {
      compare: vi.fn().mockResolvedValue(true),
    };
    const fakeJWT = {
      sign: vi.fn().mockReturnValue("fakeToken"),
    };

    const result = await authService(
      fakePrisma as any,
      fakeBcrypt as any,
      fakeJWT as any,
    ).login("fakeuser@example.com", "fakepassword");

    expect(result).toEqual({
      id: 1,
      username: "fakeuser",
      email: "fakeuser@example.com",
      token: "fakeToken",
    });
  });

  test("login throws IncorrectPasswordOrEmail when user does not exist", async () => {
    const fakePrisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    };
    const fakeBcrypt = { compare: vi.fn() };
    const fakeJWT = { sign: vi.fn() };

    await expect(
      authService(fakePrisma as any, fakeBcrypt as any, fakeJWT as any).login(
        "notexist@example.com",
        "anypassword",
      ),
    ).rejects.toThrow(IncorrectPasswordOrEmail);

    expect(fakeBcrypt.compare).not.toHaveBeenCalled();
    expect(fakeJWT.sign).not.toHaveBeenCalled();
  });

  test("login throws IncorrectPasswordOrEmail when password is incorrect", async () => {
    const fakePrisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: 1,
          username: "fakeuser",
          email: "fakeuser@example.com",
          password: "hashedpassword",
          role: "USER",
        }),
      },
    };
    const fakeBcrypt = {
      compare: vi.fn().mockResolvedValue(false),
    };
    const fakeJWT = { sign: vi.fn() };

    await expect(
      authService(fakePrisma as any, fakeBcrypt as any, fakeJWT as any).login(
        "fakeuser@example.com",
        "wrongpassword",
      ),
    ).rejects.toThrow(IncorrectPasswordOrEmail);

    expect(fakeJWT.sign).not.toHaveBeenCalled();
  });
});
