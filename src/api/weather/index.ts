/**
 * @DIR /src/api/weather/index.ts
 */

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  ShortTermWeatherForecastResponseType,
  VeryShortTermWeatherForecastResponseType,
  VeryShortTermWeatherLiveResponseType,
  WeatherInterface,
  VeryShortTermWeatherLiveItemType,
  ShortTermWeatherForecastItemType,
  VeryShortTermWeatherForecastItemType,
  WeatherAdapterInterface,
} from "./types";
import { groupBy, keyBy } from "lodash-es";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

export class Weather implements WeatherInterface {
  private readonly api_key = this.getOpenApiKey();
  private readonly BASE_TIME_LIST = [
    "0200",
    "0500",
    "0800",
    "1100",
    "1400",
    "1700",
    "2000",
    "2300",
  ] as const;

  private readonly x: number;
  private readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  private getOpenApiKey() {
    const API_KEY = process.env.OPEN_API_KEY;

    if (API_KEY === undefined) {
      throw new Error("KEY IS NOT AVAILABLE");
    }

    return API_KEY;
  }

  /**
   * 초단기 실황
   * 현재 실황 정보 응답
   * 매시간 30분에 생성되고 10분 이후 API로 제공
   *
   * e.g.
   * 19시 데이터는 19시 40분에 요청 가능
   */
  async fetchVeryShortTermWeatherLive() {
    const url = new URL(
      "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst"
    );

    const current_datetime = dayjs().tz();

    url.searchParams.append("ServiceKey", this.api_key);
    url.searchParams.append("dataType", "JSON");

    url.searchParams.append("base_date", current_datetime.format("YYYYMMDD"));

    const current_minuit = current_datetime.minute();
    const is_before_40_minute = current_minuit < 40;
    const base_datetime = is_before_40_minute
      ? current_datetime.add(-1, "hours")
      : current_datetime;

    url.searchParams.append("base_time", base_datetime.format("HHmm"));

    url.searchParams.append("nx", this.x.toString());
    url.searchParams.append("ny", this.y.toString());

    url.searchParams.append("pageNo", "1");
    url.searchParams.append("numOfRows", "1000");

    const result = await fetch(url);
    const data = (await result.json()) as VeryShortTermWeatherLiveResponseType;

    return data.response.body?.items.item ?? [];
  }

  /**
   * 현재 시간에서 가장 가까운 단기예보 base_time 반환
   */
  private getNearestBaseTimeForShortTermWeatherForecast(current_hour: number) {
    let target_index = 0;

    for (const index in this.BASE_TIME_LIST) {
      const base_time_item = parseInt(this.BASE_TIME_LIST[index].slice(0, 2));
      if (current_hour < base_time_item) {
        target_index = parseInt(index) - 1;
        break;
      }
      target_index = -1;
    }

    if (target_index === -1) {
      return {
        date: dayjs().add(-1, "day").format("YYYYMMDD"),
        time: "2300",
      };
    }

    return {
      date: dayjs().format("YYYYMMDD"),
      time: this.BASE_TIME_LIST[target_index],
    };
  }

  /**
   * 단기예보 : 당일
   * 어제 날짜의 23시 기준으로 요청 및 290개로 제한하여 오늘 단기예보 요청
   */
  async fetchTodayShortTermWeatherForecast() {
    const url = new URL(
      "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"
    );

    const current_datetime = dayjs().tz();

    url.searchParams.append("ServiceKey", this.api_key);
    url.searchParams.append("dataType", "JSON");

    /**
     * 어제 날짜의 23시 기준으로 요청하여 오늘 날짜의 단기예보를 가져옴
     */
    url.searchParams.append(
      "base_date",
      current_datetime.add(-1, "days").format("YYYYMMDD")
    );
    url.searchParams.append("base_time", "2300");

    url.searchParams.append("nx", this.x.toString());
    url.searchParams.append("ny", this.y.toString());

    url.searchParams.append("pageNo", "1");
    url.searchParams.append("numOfRows", "290");

    const result = await fetch(url);
    const data = (await result.json()) as ShortTermWeatherForecastResponseType;

    return data.response.body?.items.item ?? [];
  }

  /**
   * 단기예보 : 3일치
   * 가장 많은 데이터를 주지만 정확도가 낮아 초단기 실황으로 최근 6시간 덮어씌울 데이터
   */
  async fetchShortTermWeatherForecast() {
    const url = new URL(
      "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"
    );

    url.searchParams.append("ServiceKey", this.api_key);
    url.searchParams.append("dataType", "JSON");

    const target_base = this.getNearestBaseTimeForShortTermWeatherForecast(
      dayjs().tz().hour()
    );

    url.searchParams.append("base_date", target_base.date);
    url.searchParams.append("base_time", target_base.time);

    url.searchParams.append("nx", this.x.toString());
    url.searchParams.append("ny", this.y.toString());

    url.searchParams.append("pageNo", "1");
    url.searchParams.append("numOfRows", "592");

    const result = await fetch(url);
    const data = (await result.json()) as ShortTermWeatherForecastResponseType;

    return data.response.body?.items.item ?? [];
  }

  /**
   * 초단기 예보
   * 현재로부터 6시간 예보를 1시간 단위로 응답
   * 매시간 30분에 생성되고, 15분 이후 API로 제공
   * 단기예보보다 정확도 높음
   *
   * e.g.
   * 19시 데이터는 19:30분에 생성되며, 19시 45분에 요청 가능,
   * `19~20`, `20~21`, `21~22`, `22~23`, `23~24`, `24~01` 예보 응답
   */
  async fetchVeryShortTermWeatherForecast() {
    const url = new URL(
      "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst"
    );

    url.searchParams.append("ServiceKey", this.api_key);
    url.searchParams.append("dataType", "JSON");

    const base_datetime = dayjs().tz().add(-1, "hours");
    const basedate = base_datetime.format("YYYYMMDD");
    const basetime = base_datetime.format("HHmm");

    url.searchParams.append("base_date", basedate);
    url.searchParams.append("base_time", basetime);

    url.searchParams.append("nx", this.x.toString());
    url.searchParams.append("ny", this.y.toString());

    url.searchParams.append("pageNo", "1");
    url.searchParams.append("numOfRows", "200");

    const result = await fetch(url);
    const data =
      (await result.json()) as VeryShortTermWeatherForecastResponseType;

    return data.response.body?.items.item ?? [];
  }
}

export class WeatherAdapter implements WeatherAdapterInterface {
  private weather: Weather;

  constructor(weather: Weather) {
    this.weather = weather;
  }

  /** 초단기 실황 데이터 배열을 category key를 가진 객체로 변환 */
  async live() {
    const result = await this.weather.fetchVeryShortTermWeatherLive();

    const converted_value: Record<string, VeryShortTermWeatherLiveItemType> =
      keyBy<VeryShortTermWeatherLiveItemType>(result, "category");
    return converted_value;
  }

  /** 당일 단기예보에서 최저기온, 최고기온을 가진 아이템을 찾아 그 값을 반환 */
  async todayTemperature() {
    const result = await this.weather.fetchTodayShortTermWeatherForecast();

    const filtered_list = result.filter(
      (v) => v.category === "TMN" || v.category === "TMX"
    );
    const value_list = filtered_list.map((v) => {
      return parseFloat(v.fcstValue);
    });

    return { min: Math.min(...value_list), max: Math.max(...value_list) };
  }

  /**
   * 3일치 단기예보에서 가져온 데이터를 데이트타임으로 그룹화 하고
   * 그룹화된 배열 내 객체의 category 속성을 key로 갖는 객체를 반환
   */
  async forecast() {
    const result = await this.weather.fetchShortTermWeatherForecast();
    const grouped_list = groupBy(
      result,
      (data) => `"${data.fcstDate}_${data.fcstTime}"`
    );
    const timestamp = Object.keys(grouped_list);

    const list = timestamp.map((key) => {
      const categorized_group: Record<
        string,
        ShortTermWeatherForecastItemType
      > = keyBy<ShortTermWeatherForecastItemType>(
        grouped_list[key],
        "category"
      );
      return categorized_group;
    });

    return list;
  }

  /**
   * 초단기 예보에서 가져온 데이터를 데이트타임으로 그룹화 하고
   * 그룹화된 배열 내 객체의 category 속성을 key로 갖는 Map을 반환
   */
  async shortTermForecast() {
    const result = await this.weather.fetchVeryShortTermWeatherForecast();
    const grouped_list = groupBy(
      result,
      (data) => `"${data.fcstDate}_${data.fcstTime}"`
    );
    const timestamp = Object.keys(grouped_list);

    const map = timestamp.reduce((acc, key) => {
      const categorized_item: Record<
        string,
        VeryShortTermWeatherForecastItemType
      > = keyBy(grouped_list[key], "category");
      acc.set(key, categorized_item);
      return acc;
    }, new Map<string, Record<string, VeryShortTermWeatherForecastItemType>>());

    return map;
  }
}
