import bcrypt from "bcrypt";
import { PrismaClient } from "../../prisma/generated/client.js";

//types
import type { UpdateUserInput } from "../Schemas/user.schemas.js";

//Error classes
import { NotFoundError, AlreadyExistsError } from "../errors/errors.classes.js";

export const userServices = (prisma: PrismaClient) => {
  return {
    //Get all users function
    async getUsersService() {
      const users = await prisma.user.findMany({
        orderBy: {
          id: "asc",
        },
        select: { id: true, username: true, email: true },
      });
      return users;
    },

    //Find user by id function
    async getUserByIdService(id: number) {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, username: true, email: true },
      });
      if (!user) throw new NotFoundError("User not found");
      return user;
    },

    //Create a new user function
    async createUserService(data: {
      username: string;
      email: string;
      password: string;
    }) {
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
    },

    //Remove user by id function
    async removeUserService(id: number) {
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
    },
    //Update user by id function
    async updateUserService(id: number, data: UpdateUserInput) {
      const updateData = {
        ...data,
        ...(data.password && {
          password: await bcrypt.hash(data.password, 8),
        }),
      };
      const updatedUser = await prisma.user
        .update({
          where: { id },
          data: updateData,
          select: { id: true, username: true },
        })
        .catch(() => {
          throw new NotFoundError("User not found");
        });
      return updatedUser;
    },
  };
};
