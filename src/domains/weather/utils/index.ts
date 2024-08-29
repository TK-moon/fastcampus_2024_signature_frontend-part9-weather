/**
 * @DIR /src/domains/weather/utils/index.ts
 */

import { WeatherAdapterInterface } from "@/api/weather/types";

/**
 * 3일치 단기예보를 초단기 예보 데이터로 덮어씌우는 함수
 *
 * @param forecast
 * @param short_term_forecast
 * @returns
 */
export const mergeForecastWithShortTermForecast = (
  forecast: Awaited<ReturnType<WeatherAdapterInterface["forecast"]>>,
  short_term_forecast: Awaited<
    ReturnType<WeatherAdapterInterface["shortTermForecast"]>
  >
) => {
  return forecast.map((item, index) => {
    const date = item.PCP.fcstDate;
    const time = item.PCP.fcstTime;
    const datetime = `${date}_${time}`.toString();
    const short_forecast_item = short_term_forecast?.get(`"${datetime}"`);

    return {
      ...item,
      ...short_forecast_item,
    };
  });
};

const RAINY_TYPE: Readonly<Record<string, string>> = {
  "0": "맑음",
  "1": "비",
  "2": "비/눈",
  "3": "눈",
  "4": "소나기",
  "5": "빗방울",
  "6": "빗방울눈날림",
  "7": "눈날림",
};

export function getRainyType(value: string | undefined) {
  if (value === undefined) {
    return "";
  }
  return RAINY_TYPE[value];
}

export function getCloudType(value: string | undefined) {
  if (value === undefined) {
    return "Loading";
  }

  const parsed_value = parseInt(value);

  if (0 <= parsed_value && parsed_value < 6) {
    return "맑음";
  }

  if (6 <= parsed_value && parsed_value < 9) {
    return "구름 많음";
  }

  return "흐림";
}
