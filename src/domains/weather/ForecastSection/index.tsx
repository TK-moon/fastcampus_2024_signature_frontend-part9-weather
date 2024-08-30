import { FC } from "react";
import { getCloudType, mergeForecastWithShortTermForecast } from "../utils";
import { WindDirection } from "../component/WindDirection";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  forecast_list: ReturnType<typeof mergeForecastWithShortTermForecast>;
}

const ForecastSection: FC<Props> = (props) => {
  const { forecast_list } = props;

  return (
    <section>
      <ol>
        <li>
          <span>일시</span>
          <span>하늘</span>
          <span>기온</span>
          <span>강수확률</span>
          <span>강수량</span>
          <span>습도</span>
          <span>풍향</span>
          <span>풍속</span>
        </li>
        {forecast_list.map((item, index) => {
          const date = item.TMP.fcstDate;
          const time = item.TMP.fcstTime;
          const datetime = dayjs(`${date} ${time}`);
          const diff = formatDiffDays(datetime);

          return (
            <li key={`forecast-${datetime.toString()}`}>
              <span>{diff}</span>
              <span>{getCloudType(item.SKY.fcstValue)}</span>
              <span>{item.TMP.fcstValue}℃</span>
              <span>{item.POP.fcstValue}%</span>
              <span>{item.PCP.fcstValue}mm</span>
              <span>{item.REH.fcstValue}%</span>
              <span>
                <WindDirection
                  direction={parseInt(item.VEC?.fcstValue ?? "0")}
                />
              </span>
              <span>{item.UUU.fcstValue}(m/s)</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export { ForecastSection };

function formatDiffDays(datetime: Dayjs) {
  const diff = dayjs(datetime).diff(dayjs(), "day");

  switch (diff) {
    case 0:
      return "오늘";
    case 1:
      return "내일";
    case 2:
      return "모레";
    default:
      return `${diff}일 후`;
  }
}
