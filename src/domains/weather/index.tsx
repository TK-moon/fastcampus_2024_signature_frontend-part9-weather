import { WeatherAdapterInterface } from "@/api/weather/types";
import { FC } from "react";
import { mergeForecastWithShortTermForecast } from "./utils";
import { LiveSection } from "./LiveSection";
import { ForecastSection } from "./ForecastSection";
import { Header } from "./Header";
import Image from "next/image";

interface Props {
  live: Awaited<ReturnType<WeatherAdapterInterface["live"]>>;
  today_temperature: Awaited<
    ReturnType<WeatherAdapterInterface["todayTemperature"]>
  >;
  merged_forecast: ReturnType<typeof mergeForecastWithShortTermForecast>;
  update_time: string;
  image: string | undefined;
}

const WeatherMain: FC<Props> = (props) => {
  const { live, today_temperature, merged_forecast, update_time, image } =
    props;

  return (
    <main>
      <img src={`data:image/jpeg;base64,${image}`} alt="" />
      <Header update_time={update_time} />
      <LiveSection live={live} today_temperature={today_temperature} />
      <ForecastSection forecast_list={merged_forecast} />
    </main>
  );
};

export { WeatherMain };
