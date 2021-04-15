import { TKTrafficLightColors } from "./TKTrafficLight";
export class TKSubmissionEntry {
  field = "";
  fieldLabelEn = "";
  fieldLabelPt? = "";
  answerLabelEn = "";
  answerLabelPt? = "";
  trafficLight = false;
  trafficLightColor: TKTrafficLightColors = TKTrafficLightColors.UNDEFINED;

  constructor(
    field: string,
    fieldLabelEn: string,
    fieldLabelPt: string,
    answerLabelEn: string,
    answerLabelPt: string,
    trafficLight: boolean,
    trafficLightColor: TKTrafficLightColors
  ) {
    this.field = field;
    this.fieldLabelEn = fieldLabelEn;
    this.fieldLabelPt = fieldLabelPt;

    this.answerLabelEn = answerLabelEn;
    this.answerLabelPt = answerLabelPt;

    this.trafficLight = trafficLight;
    this.trafficLightColor = trafficLightColor;
  }

  public isAnswered() {
    return this.answerLabelEn !== "";
  }
}
