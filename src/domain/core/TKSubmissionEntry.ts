import { TKAnswerLabel } from "./TKAnswerLabel";
import { TKLabel } from "./TKLabel";
import { TKTrafficLightColors } from "./TKTrafficLight";

export class TKSubmissionEntry {
  field = "";
  fieldLabel: TKLabel;
  fieldLabelEn = "";
  fieldLabelPt? = "";

  constructor(
    field: string,
    fieldLabel: TKLabel
  ){
    this.field = field;
    this.fieldLabel = fieldLabel;
  }

  public isAnswered() : boolean {
    return true;
  }
}

export class TKSubmissionEntryText extends TKSubmissionEntry {
  answerLabel: TKLabel;
  trafficLight = false;
  trafficLightColor: TKTrafficLightColors = TKTrafficLightColors.UNDEFINED;

  constructor(
    field: string,
    fieldLabel: TKLabel,
    answerLabel: TKLabel,
    trafficLight: boolean,
    trafficLightColor: TKTrafficLightColors
  ) {
    super(field, fieldLabel);
    this.answerLabel = answerLabel;
    this.trafficLight = trafficLight;
    this.trafficLightColor = trafficLightColor;
  }

  public isAnswered() : boolean{
    return this.answerLabel ? this.answerLabel.label_en !== "" : false;
  }
}

export class TKSubmissionEntryAgePyramid extends TKSubmissionEntry {

  malesEntries: Array<number>;
  femalesEntries: Array<number>;
  malesLabels: Array<TKLabel>;
  femalesLabels: Array<TKLabel>;

  constructor(
    field: string,
    fieldLabel: TKLabel,
    malesEntries: Array<number>,
    femalesEntries: Array<number>,
    malesLabels: Array<TKLabel>,
    femalesLabels: Array<TKLabel>

  ) {
    super(field, fieldLabel);
    this.malesEntries = malesEntries;
    this.femalesEntries = femalesEntries;
    this.malesLabels = malesLabels;
    this.femalesLabels = femalesLabels;
  }
}

