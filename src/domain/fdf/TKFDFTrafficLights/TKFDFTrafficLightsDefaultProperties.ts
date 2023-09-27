import { TKFDFTrafficLightItem } from "./TKFDFTrafficLightItem";
import { TKFDFTrafficLightsProperties } from "./TKFDFTrafficLightProperties";

// ////////////////////////////////////////////////////////////////////////////
// Type
// ////////////////////////////////////////////////////////////////////////////

export const DEFAULT_ERROR_TRAFFICLIGHT: TKFDFTrafficLightItem = {
  color: "pink",
  label: {
    fr: "Erreur",
    en: "Error"
  }
};

export const DEFAULT_PROPERTIES: TKFDFTrafficLightsProperties = {
  colormap: {
    grey: {
      color: "#999999",
      label: {
        fr: "Indéterminé",
        en: "Undefined"
      }
    },
    darkred: {
      color: "#C00000",
      label: {
        fr: "Critique",
        en: "Critical"
      }
    },
    red: {
      color: "#FF0000",
      label: {
        fr: "Danger",
        en: "Danger"
      }
    },
    orange: {
      color: "#FFC000",
      label: {
        fr: "Avertissement",
        en: "Warning"
      }
    },
    yellow: {
      color: "#FFE599",
      label: {
        fr: "Attention",
        en: "Caution"
      }
    },
    green: {
      color: "#A8D08D",
      label: {
        fr: "OK",
        en: "OK"
      }
    },
    purple: DEFAULT_ERROR_TRAFFICLIGHT
  },
  colorerror: "purple"
};
