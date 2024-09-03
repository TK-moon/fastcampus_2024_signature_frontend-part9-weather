import { FC } from "react";
import { getCloudType, mergeForecastWithShortTermForecast } from "../utils";
import { WindDirection } from "../component/WindDirection";
import dayjs, { Dayjs } from "dayjs";
import styles from "./index.module.css";

interface Props {
  forecast_list: ReturnType<typeof mergeForecastWithShortTermForecast>;
}

const ForecastSection: FC<Props> = (props) => {
  const { forecast_list } = props;

  return (
    <section className={styles.container}>
      <ol className={styles.item_list}>
        <li className={`${styles.item} ${styles.item_title}`}>
          <span>일시</span>
          <span>하늘</span>
          <span>
            기온
            <small className={styles.unit}>(℃)</small>
          </span>
          <span>
            강수확률
            <small className={styles.unit}>(%)</small>
          </span>
          <span>
            강수량
            <small className={styles.unit}>(mm)</small>
          </span>
          <span>
            습도<small className={styles.unit}>(%)</small>
          </span>
          <span>풍향</span>
          <span>
            풍속
            <small className={styles.unit}>(m/s)</small>
          </span>
        </li>
        {forecast_list.map((item, index) => {
          const date = item.TMP.fcstDate;
          const time = item.TMP.fcstTime;
          const datetime = dayjs(`${date} ${time}`);
          const diff = formatDiffDays(datetime);
          const hour = datetime.format("HH");

          return (
            <li className={styles.item} key={`forecast-${datetime.toString()}`}>
              <span>
                {diff} {hour}시
              </span>
              <span>{getCloudType(item.SKY.fcstValue)}</span>
              <span>{item.TMP.fcstValue}℃</span>
              <span>{item.POP.fcstValue}%</span>
              <span>{item.PCP.fcstValue}</span>
              <span>{item.REH.fcstValue}%</span>
              <span>
                <WindDirection
                  direction={parseInt(item.VEC?.fcstValue ?? "0")}
                />
              </span>
              <span>{item.WSD.fcstValue}m/s</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export { ForecastSection };

function formatDiffDays(datetime: Dayjs) {
  const diff = dayjs(datetime).diff(dayjs().format("YYYY-MM-DD"), "day");

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
