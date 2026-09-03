import { expect, test, describe, vi, beforeEach } from "vitest";

import { authService } from "../src/services/auth.services.js";
import { IncorrectPasswordOrEmail } from "../src/errors/errors.classes.js";

import bcrypt from "bcrypt";

import { prisma } from "../src/lib/prisma.js";

import jwt from "jsonwebtoken";

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
      fakePrisma as unknown as typeof prisma,
      fakeBcrypt as unknown as typeof bcrypt,
      fakeJWT as unknown as typeof jwt,
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
      authService(
        fakePrisma as unknown as typeof prisma,
        fakeBcrypt as unknown as typeof bcrypt,
        fakeJWT as unknown as typeof jwt,
      ).login("notexist@example.com", "anypassword"),
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
      authService(
        fakePrisma as unknown as typeof prisma,
        fakeBcrypt as unknown as typeof bcrypt,
        fakeJWT as unknown as typeof jwt,
      ).login("fakeuser@example.com", "wrongpassword"),
    ).rejects.toThrow(IncorrectPasswordOrEmail);

    expect(fakeJWT.sign).not.toHaveBeenCalled();
  });

  test("login throws Error when SECRET_JWT_KEY is not defined", async () => {
    delete process.env.SECRET_JWT_KEY;

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
    const fakeJWT = { sign: vi.fn() };

    await expect(
      authService(
        fakePrisma as unknown as typeof prisma,
        fakeBcrypt as unknown as typeof bcrypt,
        fakeJWT as unknown as typeof jwt,
      ).login("fakeuser@example.com", "fakepassword"),
    ).rejects.toThrow("SECRET_JWT_KEY is undefined");

    expect(fakeJWT.sign).not.toHaveBeenCalled();
  });

  test("login uses TOKEN_EXPIRATION env var when defined", async () => {
    process.env.TOKEN_EXPIRATION = "2h";

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

    await authService(
      fakePrisma as unknown as typeof prisma,
      fakeBcrypt as unknown as typeof bcrypt,
      fakeJWT as unknown as typeof jwt,
    ).login("fakeuser@example.com", "fakepassword");

    expect(fakeJWT.sign).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ expiresIn: "2h" }),
    );

    delete process.env.TOKEN_EXPIRATION;
  });

  test("login defaults TOKEN_EXPIRATION to '1h' when env var is not set", async () => {
    delete process.env.TOKEN_EXPIRATION;

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
    const fakeBcrypt = { compare: vi.fn().mockResolvedValue(true) };
    const fakeJWT = { sign: vi.fn().mockReturnValue("fakeToken") };

    await authService(
      fakePrisma as unknown as typeof prisma,
      fakeBcrypt as unknown as typeof bcrypt,
      fakeJWT as unknown as typeof jwt,
    ).login("fakeuser@example.com", "fakepassword");

    expect(fakeJWT.sign).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ expiresIn: "1h" }),
    );
  });

  test("login signs JWT with correct payload including role", async () => {
    const fakePrisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: 42,
          username: "adminuser",
          email: "admin@example.com",
          password: "hashedpassword",
          role: "ADMIN",
        }),
      },
    };
    const fakeBcrypt = { compare: vi.fn().mockResolvedValue(true) };
    const fakeJWT = { sign: vi.fn().mockReturnValue("fakeToken") };

    await authService(
      fakePrisma as unknown as typeof prisma,
      fakeBcrypt as unknown as typeof bcrypt,
      fakeJWT as unknown as typeof jwt,
    ).login("admin@example.com", "fakepassword");

    expect(fakeJWT.sign).toHaveBeenCalledWith(
      { id: 42, username: "adminuser", role: "ADMIN" },
      "test-secret",
      expect.anything(),
    );
  });
});
