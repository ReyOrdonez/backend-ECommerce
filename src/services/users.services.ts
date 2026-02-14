import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

//types
import type { UpdateUserInput } from "../Schemas/user.schemas";

//Error classes
import {
  NotFoundError,
  BadRequestError,
  AlreadyExistsError,
} from "../errors/errors.classes";

//Get all users function
export const getUsersService = async () => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true },
  });
  return users;
};

//Find user by id function
export const getUserByIdService = async (id: number) => {
  const user = await prisma.user.findFirst({
    where: { id },
    select: { id: true, username: true, email: true },
  });
  if (!user) throw new NotFoundError("User not found");
  return user;
};

//Create a new user function
export const createUserService = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const userExists = await prisma.user.findUnique({
    //We use findUnique here because email is unique in the database
    where: { email: data.email },
  });
  if (userExists) {
    throw new AlreadyExistsError("This email already exists");
  }
  const hashedPassword = await bcrypt.hash(data.password, 8);
  return prisma.user.create({
    data: { ...data, password: hashedPassword },
    select: { id: true, username: true },
  });
};

//Remove user by id function
export const removeUserService = async (id: number) => {
  const userExists = await prisma.user.findUnique({
    where: { id },
  });
  if (!userExists) {
    throw new NotFoundError("User not found");
  }
  //return deleted user
  const userToDelete = await prisma.user.delete({
    where: { id },
  });
  return userToDelete;
};

//Update user by id function
export const updateUserService = async (id: number, data: UpdateUserInput) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 8);
  }
  const updatedUser = await prisma.user
    .update({
      where: { id },
      data: data as Parameters<typeof prisma.user.update>[0]["data"],
      select: { id: true, username: true },
    })
    .catch(() => {
      throw new NotFoundError("User not found");
    });
  return updatedUser;
};
