export enum TrafficLight {
  OK = 1,
  WARNING = 2,
  CRITICAL = 3
}

export interface TKSurveyItemI {
  name: string;
  value: string;
  trafficLight?: TrafficLight;
}
