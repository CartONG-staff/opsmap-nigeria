export enum TKTrafficLightColors {
  OK = "green",
  WARNING = "yellow",
  DANGER = "orange",
  CRITICAL = "red",
  UNDEFINED = "purple"
}

export enum TrafficLightTypes {
  STRING = "string",
  MATH = "math",
  LIST = "list"
}
export interface TKTrafficLightItem {
  traffic_light_name: string;
  type: TrafficLightTypes;
  value: string;
  color: TKTrafficLightColors;
}
export interface TKTrafficLightGrouped {
  type: TrafficLightTypes;
  values: [
    {
      value: string;
      color: TKTrafficLightColors;
    }
  ];
}
