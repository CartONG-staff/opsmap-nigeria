import { TKTrafficLightColors } from "./TKTrafficLightColors";
export interface TKSubmissionItem {
    field: string;
    fieldLabel_en: string;
    fieldLabel_fr?: string;
    fieldLabel_pt?: string;
    answerLabel_en: string;
    answerLabel_fr?: string;
    answerLabel_pt?: string;
    trafficLight: boolean;
    trafficLightColor: TKTrafficLightColors;
  }

  export function isAnswered(item: TKSubmissionItem){
    return item.answerLabel_en !== "";
  }