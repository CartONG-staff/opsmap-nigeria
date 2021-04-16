import { TKFieldLabel } from "../survey/surveyConfiguration/TKLabelsCollectionBuilder";
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

export class TKSubmissionEntryAgePyramid extends TKSubmissionEntry {

  malesEntries: Array<number>;
  femalesEntries: Array<number>;
  malesLabels: Array<TKFieldLabel>;
  femalesLabels: Array<TKFieldLabel>;

  constructor(
    field: string,
    fieldLabelEn: string,
    fieldLabelPt: string,
    malesEntries: Array<number>,
    femalesEntries: Array<number>,
    malesLabels: Array<TKFieldLabel>,
    femalesLabels: Array<TKFieldLabel>

  ) {
    super(field, fieldLabelEn, fieldLabelPt);
    this.malesEntries = malesEntries;
    this.femalesEntries = femalesEntries;
    this.malesLabels = malesLabels;
    this.femalesLabels = femalesLabels;
  }
}

