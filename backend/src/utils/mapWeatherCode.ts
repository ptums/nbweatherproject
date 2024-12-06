export enum Weather {
  CLEAR = "CLEAR",
  MAINLY_CLEAR = "MAINLY_CLEAR",
  PARTLY_CLOUDY = "PARTLY_CLOUDY",
  OVERCAST = "OVERCAST",
  FOG = "FOG",
  DRIZZLE = "DRIZZLE",
  RAIN = "RAIN",
  SNOW = "SNOW",
  RAIN_SHOWERS = "RAIN_SHOWERS",
  SNOW_SHOWERS = "SNOW_SHOWERS",
  THUNDERSTORM = "THUNDERSTORM",
  UNKNOWN = "UNKNOWN",
}

export function mapWeatherCode(code: number): Weather {
  switch (code) {
    case 0:
      return Weather.CLEAR;
    case 1:
    case 2:
      return Weather.MAINLY_CLEAR;
    case 3:
      return Weather.PARTLY_CLOUDY;
    case 45:
    case 48:
      return Weather.FOG;
    case 51:
    case 53:
    case 55:
      return Weather.DRIZZLE;
    case 61:
    case 63:
    case 65:
      return Weather.RAIN;
    case 71:
    case 73:
    case 75:
      return Weather.SNOW;
    case 80:
    case 81:
    case 82:
      return Weather.RAIN_SHOWERS;
    case 85:
    case 86:
      return Weather.SNOW_SHOWERS;
    case 95:
    case 96:
    case 99:
      return Weather.THUNDERSTORM;
    default:
      return Weather.UNKNOWN;
  }
}
