import { PrismaClient, WeatherData } from "@prisma/client";

const prisma = new PrismaClient();

export const WeatherDataRepository = {
  create: async (
    weatherData: Omit<WeatherData, "id">
  ): Promise<WeatherData> => {
    return prisma.weatherData.create({
      data: weatherData,
    });
  },

  findById: async (id: number): Promise<WeatherData | null> => {
    return prisma.weatherData.findUnique({
      where: { id },
    });
  },

  findByQueryId: async (queryId: number): Promise<WeatherData[]> => {
    return prisma.weatherData.findMany({
      where: { queryId },
    });
  },

  update: async (
    id: number,
    weatherData: Partial<Omit<WeatherData, "id">>
  ): Promise<WeatherData> => {
    return prisma.weatherData.update({
      where: { id },
      data: weatherData,
    });
  },

  deleteById: async (id: number): Promise<void> => {
    await prisma.weatherData.delete({
      where: { id },
    });
  },

  findAll: async (): Promise<WeatherData[]> => {
    return prisma.weatherData.findMany();
  },

  findByDateRange: async (
    startDate: Date,
    endDate: Date
  ): Promise<WeatherData[]> => {
    return prisma.weatherData.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  },

  existsById: async (id: number): Promise<boolean> => {
    const count = await prisma.weatherData.count({
      where: { id },
    });
    return count > 0;
  },
};
