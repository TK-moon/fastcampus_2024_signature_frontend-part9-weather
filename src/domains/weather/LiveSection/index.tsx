import { WeatherAdapterInterface } from "@/api/weather/types";
import { FC } from "react";
import { WindDirection } from "../component/WindDirection";
import { getRainyType } from "../utils";
import styles from "./index.module.css";

interface Props {
  live: Awaited<ReturnType<WeatherAdapterInterface["live"]>>;
  today_temperature: Awaited<
    ReturnType<WeatherAdapterInterface["todayTemperature"]>
  >;
}

const LiveSection: FC<Props> = (props) => {
  const { live, today_temperature } = props;

  return (
    <section className={styles.container}>
      <div>
        <strong className={styles.current_temperature}>
          {live.T1H?.obsrValue}℃
        </strong>
        <strong className={styles.current_sky}>
          {getRainyType(live.PTY?.obsrValue)}
        </strong>
      </div>
      <div>
        <div className={styles.today_temperature}>
          <dl>
            <dt>최저</dt>
            <dd>
              <strong>{today_temperature.min}℃</strong>
            </dd>
          </dl>
          <dl>
            <dt>최고</dt>
            <dd>
              <strong>{today_temperature.max}℃</strong>
            </dd>
          </dl>
        </div>
        <span className={styles.today_temperature_description}>
          (오전 6시, 오후 3시)
        </span>
      </div>
      <div className={styles.info}>
        <dl>
          <dt>강수량</dt>
          <dd>{live.RN1?.obsrValue}mm</dd>
        </dl>
        <dl>
          <dt>습도</dt>
          <dd>{live.REH?.obsrValue}%</dd>
        </dl>
        <dl>
          <dt>풍향</dt>
          <dd>
            <WindDirection direction={parseInt(live.VEC?.obsrValue ?? "0")} />
          </dd>
        </dl>
        <dl>
          <dt>풍속</dt>
          <dd>{live.WSD?.obsrValue}(m/s)</dd>
        </dl>
      </div>
    </section>
  );
};

export { LiveSection };
