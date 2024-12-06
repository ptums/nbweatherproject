import { PrismaClient, User } from "@prisma/client";
import { adminUser } from "../utils";

const prisma = new PrismaClient();

const excludeAdminCondition = {
  uniqueId: {
    not: adminUser,
  },
};

export const UserRepository = {
  create: async (userData: Omit<User, "id">): Promise<User> => {
    return prisma.user.create({
      data: userData,
    });
  },

  findById: async (id: number): Promise<User | null> => {
    return prisma.user.findFirst({
      where: {
        id,
        ...excludeAdminCondition,
      },
    });
  },

  findByUniqueId: async (uniqueId: string): Promise<User | null> => {
    const results = await prisma.user.findFirst({
      where: {
        uniqueId,
      },
    });

    return results;
  },

  deleteById: async (id: number): Promise<void> => {
    await prisma.user.delete({
      where: { id },
    });
  },

  // Additional utility functions

  findAll: async (): Promise<User[]> => {
    return prisma.user.findMany({
      where: excludeAdminCondition,
    });
  },

  update: async (
    id: number,
    userData: Partial<Omit<User, "id">>
  ): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data: userData,
    });
  },

  existsById: async (id: number): Promise<boolean> => {
    const count = await prisma.user.count({
      where: {
        id,
        ...excludeAdminCondition,
      },
    });
    return count > 0;
  },
};
