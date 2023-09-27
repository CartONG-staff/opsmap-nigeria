import { TKFDFTrafficLightConfiguration } from "./TKFDFTrafficLightConfiguration";

// ////////////////////////////////////////////////////////////////////////////
// Union type
// ////////////////////////////////////////////////////////////////////////////

export const UNDEFINED_RANK_VALUE = -1;

export function getRankValue(
  index: string,
  configuration: TKFDFTrafficLightConfiguration
): number {
  return Object.keys(configuration.properties.colormap).findIndex(
    key => key == index
  );
}
