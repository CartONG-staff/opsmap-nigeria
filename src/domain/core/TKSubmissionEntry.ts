import { TKAnswerLabel } from "./TKAnswerLabel";
import { TKFieldLabel } from "./TKFieldLabel";
import { TKTrafficLightColors } from "./TKTrafficLight";

export class TKSubmissionEntry {
  field = "";
  fieldLabel: TKFieldLabel;
  fieldLabelEn = "";
  fieldLabelPt? = "";

  constructor(
    field: string,
    fieldLabel: TKFieldLabel
  ){
    this.field = field;
    this.fieldLabel = fieldLabel;
  }

  public isAnswered() {
    return true;
  }
}

export class TKSubmissionEntryText extends TKSubmissionEntry {
  answerLabel: TKFieldLabel;
  trafficLight = false;
  trafficLightColor: TKTrafficLightColors = TKTrafficLightColors.UNDEFINED;

  constructor(
    field: string,
    fieldLabel: TKFieldLabel,
    answerLabel: TKFieldLabel,
    trafficLight: boolean,
    trafficLightColor: TKTrafficLightColors
  ) {
    super(field, fieldLabel);
    this.answerLabel = answerLabel;
    this.trafficLight = trafficLight;
    this.trafficLightColor = trafficLightColor;
  }

  public isAnswered() {
    return this.answerLabel ? this.answerLabel.field_label_en !== "" : false;
  }
}

export class TKSubmissionEntryAgePyramid extends TKSubmissionEntry {

  malesEntries: Array<number>;
  femalesEntries: Array<number>;
  malesLabels: Array<TKFieldLabel>;
  femalesLabels: Array<TKFieldLabel>;

  constructor(
    field: string,
    fieldLabel: TKFieldLabel,
    malesEntries: Array<number>,
    femalesEntries: Array<number>,
    malesLabels: Array<TKFieldLabel>,
    femalesLabels: Array<TKFieldLabel>

  ) {
    super(field, fieldLabel);
    this.malesEntries = malesEntries;
    this.femalesEntries = femalesEntries;
    this.malesLabels = malesLabels;
    this.femalesLabels = femalesLabels;
  }
}

