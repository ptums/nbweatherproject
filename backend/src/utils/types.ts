import { WeatherQueries, WeatherData, User, Prisma } from "@prisma/client";

export interface WeatherQueriesUsers extends WeatherQueries {
  weatherData: WeatherData[];
  users: User[];
}

// If you need a type that includes all relations, you can also use Prisma's utility types:
type WeatherQueriesWithRelations = Prisma.WeatherQueriesGetPayload<{
  include: { weatherData: true; users: true };
}>;
