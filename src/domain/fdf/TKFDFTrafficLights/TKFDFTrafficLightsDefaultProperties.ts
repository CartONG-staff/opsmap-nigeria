import { TKFDFTrafficLightColormapItem } from "./TKFDFTrafficLightColormap";
import { TKFDFTrafficLightProperties } from "./TKFDFTrafficLightProperties";

/**
 * Default error colormapitem
 */
export const DEFAULT_ERROR_TRAFFICLIGHT: TKFDFTrafficLightColormapItem = {
  color: "purple",
  label: "trafficlight.error"
};

/**
 * Default color map used in the app
 */
export const DEFAULT_PROPERTIES: TKFDFTrafficLightProperties = {
  colormap: {
    grey: {
      color: "#999999",
      label: "trafficlight.undefined"
    },
    darkred: {
      color: "#C00000",
      label: "trafficlight.critical"
    },
    red: {
      color: "#FF0000",
      label: "trafficlight.danger"
    },
    orange: {
      color: "#FFC000",
      label: "trafficlight.warning"
    },
    yellow: {
      color: "#FFE599",
      label: "trafficlight.caution"
    },
    green: {
      color: "#A8D08D",
      label: "trafficlight.ok"
    },
    purple: DEFAULT_ERROR_TRAFFICLIGHT
  },
  colorerror: "purple"
};
