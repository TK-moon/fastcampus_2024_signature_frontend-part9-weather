/**
 * @DIR /src/api/weather/types.ts
 */

/** 초단기 예보 카테고리 타입 */
enum VERY_SHORT_TERM_WEATHER_FORECAST_CATEGORY {
  /** 기온 */
  T1H = "T1H",
  /** 1시간 강수량 */
  RN1 = "RN1",
  /** 하늘상태 */
  SKY = "SKY",
  /** 동서바람성분 */
  UUU = "UUU",
  /** 남북바람성분 */
  VVV = "VVV",
  /** 습도 */
  REH = "REH",
  /** 강수형태 */
  PTY = "PTY",
  /** 낙뢰 */
  LGT = "LGT",
  /** 풍향 */
  VEC = "VEC",
  /** 풍속 */
  WSD = "WSD",
}

/** 초단기 실황 카테고리 타입 */
enum VERY_SHORT_TERM_WEATHER_LIVE_CATEGORY {
  /**
   * 0 없음
   * 1 비
   * 2 비/눈
   * 3 눈
   * 5 빗방울
   * 6 빗방울눈날림
   * 7 눈날림
   */
  /** 강수형태 */
  PTY = "PTY",
  /** 기온 */
  T1H = "T1H",
  /**
   * mm
   * 0.1mm ~ 1mm 미만 : 1.0 미만
   * 1mm 이상 30mm 미만 : 실수값 mm
   * 30.0mm 이상 50.0mm 미만 : 30~50mm
   * 50.0mm 이상 : 50.0mm 이상
   */
  /** 습도 */
  REH = "REH",
  /** 1시간 강수량 */
  RN1 = "RN1",
  /** 동서바람성분 */
  UUU = "UUU",
  /** 남북바람성분 */
  VVV = "VVV",
  /** 풍향 */
  VEC = "VEC",
  /** 풍속 */
  WSD = "WSD",
}

/** 단기 예보 카테고리 타입 */
enum SHORT_TERM_WEATHER_FORECAST_CATEGORY {
  /** 강수확률 */
  POP = "POP",
  /** 강수형태 */
  PTY = "PTY",
  /** 1시간 강수량 */
  PCP = "PCP",
  /** 습도 */
  REH = "REH",
  /** 1시간 신적설 */
  SNO = "SNO",
  /** 하늘상태 */
  SKY = "SKY",
  /** 1시간 기온 */
  TMP = "TMP",
  /** 일 최저기온 */
  TMN = "TMN",
  /** 일 최고기온 */
  TMX = "TMX",
  /** 풍속 (동서성분) */
  UUU = "UUU",
  /** 풍속 (남북성분) */
  VVV = "VVV",
  /** 파고 */
  WAV = "WAV",
  /** 풍향 */
  VEC = "VEC",
  /** 풍속 */
  WSD = "WSD",
}

interface HeaderType {
  header: {
    resultCode:
      | "00"
      | "01"
      | "02"
      | "03"
      | "04"
      | "05"
      | "10"
      | "11"
      | "12"
      | "20"
      | "21"
      | "22"
      | "30"
      | "31"
      | "32"
      | "33"
      | "99";
    resultMessage: string;
  };
}

interface BodyType<T> {
  dataType: "JSON" | "XML";
  numOfRows: number;
  totalCount: number;
  pageNo: number;
  items: {
    item: T[];
  };
}

interface ResponseType<T> {
  response: {
    header: HeaderType;
    body?: BodyType<T>;
  };
}

interface CommonItemType {
  /** 발표 일자 */
  baseDate: string;
  /** 발표 시간 */
  baseTime: string;
  /** 예측지점 X 좌표 */
  nx: number;
  /** 예측지점 Y 좌표 */
  ny: number;
}

export interface VeryShortTermWeatherForecastItemType extends CommonItemType {
  /** 자료 구분 코드 */
  category: VERY_SHORT_TERM_WEATHER_FORECAST_CATEGORY;
  /** 예측 일자 */
  fcstDate: string;
  /** 예측 시간 */
  fcstTime: string;
  /** 예보 값 */
  fcstValue: string;
}

export interface VeryShortTermWeatherForecastResponseType
  extends ResponseType<VeryShortTermWeatherForecastItemType> {}

export interface VeryShortTermWeatherLiveItemType extends CommonItemType {
  category: VERY_SHORT_TERM_WEATHER_LIVE_CATEGORY;
  obsrValue: string;
}

export interface VeryShortTermWeatherLiveResponseType
  extends ResponseType<VeryShortTermWeatherLiveItemType> {}

export interface ShortTermWeatherForecastItemType extends CommonItemType {
  category: SHORT_TERM_WEATHER_FORECAST_CATEGORY;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
}

export interface ShortTermWeatherForecastResponseType
  extends ResponseType<ShortTermWeatherForecastItemType> {}

export interface WeatherInterface {
  fetchVeryShortTermWeatherLive: () => Promise<
    VeryShortTermWeatherLiveItemType[]
  >;
  fetchTodayShortTermWeatherForecast: () => Promise<
    ShortTermWeatherForecastItemType[]
  >;
  fetchShortTermWeatherForecast: () => Promise<
    ShortTermWeatherForecastItemType[]
  >;
  fetchVeryShortTermWeatherForecast: () => Promise<
    VeryShortTermWeatherForecastItemType[]
  >;
}

export interface WeatherAdapterInterface {
  live(): Promise<Record<string, VeryShortTermWeatherLiveItemType | undefined>>;
  todayTemperature(): Promise<{ min: number; max: number }>;
  forecast(): Promise<
    Array<
      Record<
        SHORT_TERM_WEATHER_FORECAST_CATEGORY,
        ShortTermWeatherForecastItemType
      >
    >
  >;
  shortTermForecast(): Promise<
    Map<
      string,
      Record<
        VERY_SHORT_TERM_WEATHER_FORECAST_CATEGORY,
        VeryShortTermWeatherForecastItemType
      >
    >
  >;
}
