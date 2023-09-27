import { TKFDFTrafficLightConfiguration } from "./TKFDFTrafficLightConfiguration";

// ////////////////////////////////////////////////////////////////////////////
// Union type
// ////////////////////////////////////////////////////////////////////////////

export const UNDEFINED_RANK_VALUE = -1;

export function getRankValue(
  index: string,
  configuration: TKFDFTrafficLightConfiguration
): number {
  if (
    !configuration ||
    !configuration.properties ||
    !configuration.properties.colormap
  ) {
    return UNDEFINED_RANK_VALUE;
  }
  return Object.keys(configuration.properties.colormap).findIndex(
    key => key == index
  );
}
