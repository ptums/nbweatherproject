import { PrismaClient, WeatherQueries, User, Prisma } from "@prisma/client";
import { adminUser } from "../utils";

const prisma = new PrismaClient();

export type WeatherQueriesWithRelations = Prisma.WeatherQueriesGetPayload<{
  include: {
    weatherData: true;
    users: {
      where: {
        uniqueId: {
          not: string;
        };
      };
    };
  };
}>;

export const WeatherQueriesRepository = {
  create: async (
    weatherQueryData: Omit<WeatherQueries, "id">
  ): Promise<WeatherQueriesWithRelations> => {
    return prisma.weatherQueries.create({
      data: weatherQueryData,
      include: {
        weatherData: true,
        users: {
          where: {
            uniqueId: {
              not: adminUser,
            },
          },
        },
      },
    });
  },

  findById: async (id: number): Promise<WeatherQueriesWithRelations | null> => {
    return prisma.weatherQueries.findUnique({
      where: { id },
      include: {
        weatherData: true,
        users: {
          where: {
            uniqueId: {
              not: adminUser,
            },
          },
        },
      },
    });
  },

  findByUniqueId: async (
    uniqueId: string
  ): Promise<WeatherQueriesWithRelations[]> => {
    return prisma.weatherQueries.findMany({
      where: {
        users: {
          some: {
            uniqueId: uniqueId,
          },
        },
      },
      include: {
        weatherData: true,
        users: {
          where: {
            uniqueId: {
              not: adminUser,
            },
          },
        },
      },
    });
  },

  update: async (
    id: number,
    weatherQueryData: Partial<Omit<WeatherQueries, "id">>
  ): Promise<WeatherQueriesWithRelations> => {
    return prisma.weatherQueries.update({
      where: { id },
      data: weatherQueryData,
      include: {
        weatherData: true,
        users: {
          where: {
            uniqueId: {
              not: adminUser,
            },
          },
        },
      },
    });
  },

  deleteById: async (id: number): Promise<void> => {
    await prisma.weatherQueries.delete({
      where: { id },
    });
  },

  findAll: async (): Promise<WeatherQueriesWithRelations[]> => {
    return prisma.weatherQueries.findMany({
      include: {
        weatherData: true,
        users: {
          where: {
            uniqueId: {
              not: adminUser,
            },
          },
        },
      },
    });
  },

  addUserToQuery: async (
    queryId: number,
    uniqueId: string
  ): Promise<WeatherQueriesWithRelations> => {
    return prisma.weatherQueries.update({
      where: { id: queryId },
      data: {
        users: {
          connect: { uniqueId: uniqueId },
        },
      },
      include: {
        weatherData: true,
        users: {
          where: {
            uniqueId: {
              not: adminUser,
            },
          },
        },
      },
    });
  },

  removeUserFromQuery: async (
    queryId: number,
    uniqueId: string
  ): Promise<WeatherQueriesWithRelations> => {
    return prisma.weatherQueries.update({
      where: { id: queryId },
      data: {
        users: {
          disconnect: {
            uniqueId: uniqueId,
          },
        },
      },
      include: {
        weatherData: true,
        users: {
          where: {
            uniqueId: {
              not: adminUser,
            },
          },
        },
      },
    });
  },

  findByQuery: async (
    query: string
  ): Promise<WeatherQueriesWithRelations | null> => {
    return prisma.weatherQueries.findFirst({
      where: {
        query: {
          contains: query,
          // mode: "insensitive",
        },
      },
      include: {
        weatherData: true,
        users: {
          where: {
            uniqueId: {
              not: adminUser,
            },
          },
        },
      },
    });
  },

  existsById: async (id: number): Promise<boolean> => {
    const count = await prisma.weatherQueries.count({
      where: { id },
    });
    return count > 0;
  },

  existsUser: async (queryId: number, uniqueId: string): Promise<boolean> => {
    const count = await prisma.weatherQueries.count({
      where: {
        id: queryId,
        users: {
          some: {
            uniqueId: uniqueId,
          },
        },
      },
    });

    return count > 0;
  },
};
