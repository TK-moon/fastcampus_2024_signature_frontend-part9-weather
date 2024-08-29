import { WeatherAdapterInterface } from "@/api/weather/types";
import { FC } from "react";
import { mergeForecastWithShortTermForecast } from "./utils";

interface Props {
  live: Awaited<ReturnType<WeatherAdapterInterface["live"]>>;
  today_temperature: Awaited<
    ReturnType<WeatherAdapterInterface["todayTemperature"]>
  >;
  merged_forecast: ReturnType<typeof mergeForecastWithShortTermForecast>;
}

const WeatherMain: FC<Props> = (props) => {
  const { live, today_temperature, merged_forecast } = props;

  return (
    <main>
      <h1>Weather</h1>
    </main>
  );
};

export { WeatherMain };
