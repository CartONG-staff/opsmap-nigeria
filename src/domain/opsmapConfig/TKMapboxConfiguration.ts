export interface TKMapboxConfiguration {
  token: string;
  style: string;
  padding: 100;
  zoomspeed: 2;
  readonly bounds: Array<number>;
}
