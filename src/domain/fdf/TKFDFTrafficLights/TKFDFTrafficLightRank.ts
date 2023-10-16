import { TKFDFTrafficLightConfiguration } from "./TKFDFTrafficLightConfiguration";

// ////////////////////////////////////////////////////////////////////////////
//
// ////////////////////////////////////////////////////////////////////////////

/**
 * Value used when rank can't be computed (no tl definition for instance)
 */
export const UNDEFINED_RANK_VALUE = -1;

/**
 * Compute a rank value assocaited to the traffic light.
 * This value is used to sort the TL later in the UI.
 * Basically, it returns the index of the TL in the associated colormap
 */
export function getRankValue(
  index: string,
  configuration: TKFDFTrafficLightConfiguration
): number {
  return Object.keys(configuration.properties.colormap).findIndex(
    key => key == index
  );
}
