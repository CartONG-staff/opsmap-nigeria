import { TKTrafficLightColors } from "./TKTrafficLight";

export class TKSubmissionEntry {
  field = "";
  fieldLabelEn = "";
  fieldLabelPt? = "";

  constructor(
    field: string,
    fieldLabelEn: string,
    fieldLabelPt: string,
  ){
    this.field = field;
    this.fieldLabelEn = fieldLabelEn;
    this.fieldLabelPt = fieldLabelPt;
  }
}

export class TKSubmissionEntryText extends TKSubmissionEntry {
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
    super(field, fieldLabelEn, fieldLabelPt);
    this.answerLabelEn = answerLabelEn;
    this.answerLabelPt = answerLabelPt;
    this.trafficLight = trafficLight;
    this.trafficLightColor = trafficLightColor;
  }

  public isAnswered() {
    return this.answerLabelEn !== "";
  }
}

export class TKSubmissionEntryChart extends TKSubmissionEntry {
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
    super(field, fieldLabelEn, fieldLabelPt);
    this.answerLabelEn = answerLabelEn;
    this.answerLabelPt = answerLabelPt;
    this.trafficLight = trafficLight;
    this.trafficLightColor = trafficLightColor;
  }

  public isAnswered() {
    return this.answerLabelEn !== "";
  }
}

