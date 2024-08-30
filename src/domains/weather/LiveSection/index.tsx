import { WeatherAdapterInterface } from "@/api/weather/types";
import { FC } from "react";
import { WindDirection } from "../component/WindDirection";
import { getRainyType } from "../utils";

interface Props {
  live: Awaited<ReturnType<WeatherAdapterInterface["live"]>>;
  today_temperature: Awaited<
    ReturnType<WeatherAdapterInterface["todayTemperature"]>
  >;
}

const LiveSection: FC<Props> = (props) => {
  const { live, today_temperature } = props;

  return (
    <section>
      <div>
        <div>
          <strong>{live.T1H?.obsrValue}℃</strong>
          <strong>{getRainyType(live.PTY?.obsrValue)}</strong>
        </div>
        <div>
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
          <span>(오전 6시, 오후 3시)</span>
        </div>
      </div>
      <div>
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
