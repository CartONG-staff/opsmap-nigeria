import { TKIndicatorType } from "../opsmapConfig/TKIndicatorsDescription";
import { TKLabel } from "./TKLabel";

export interface TKIndicator {
  readonly type: TKIndicatorType;
  readonly nameLabel: TKLabel;
  readonly valueLabel: TKLabel;
  readonly iconOchaName: string;
}
