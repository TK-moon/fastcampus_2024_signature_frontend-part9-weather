import { Weather, WeatherAdapter } from "@/api/weather";
import { WeatherMain } from "@/domains/weather";
import { mergeForecastWithShortTermForecast } from "@/domains/weather/utils";
import dayjs from "dayjs";
import { GetStaticProps } from "next";
import { ComponentProps, FC } from "react";

interface Props extends ComponentProps<typeof WeatherMain> {}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const weather_instance = new Weather(60, 126);
  const weather = new WeatherAdapter(weather_instance);

  const promise = [
    weather.live(),
    weather.todayTemperature(),
    weather.forecast(),
    weather.shortTermForecast(),
  ] as const;

  const [live, today_temperature, forecast, short_term_forecast] =
    await Promise.all(promise);

  const merged_forecast = mergeForecastWithShortTermForecast(
    forecast,
    short_term_forecast
  );

  // const live = await weather.live();
  // const forecast = await weather.forecast();
  // const today_temperature = await weather.todayTemperature();
  // const short_term_forecast = await weather.shortTermForecast();

  return {
    props: {
      live,
      today_temperature,
      merged_forecast,
      update_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    },
  };
};

const WeatherPage: FC<Props> = (props) => {
  return <WeatherMain {...props} />;
};

export default WeatherPage;
