import { TKLabel } from "@/domain/utils/TKLabel";
import {
  TKFDFIndicatorType,
  TKFDFIndicator
} from "@/domain/fdf/TKFDFIndicators";
import TKIndicatorType = TKFDFIndicatorType;

export interface TKIndicatorStandard {
  readonly type: TKIndicatorType.STANDARD;
  readonly nameLabel: TKLabel;
  readonly valueLabel: TKLabel;
  readonly iconOchaName: string;
}

export interface TKIndicatorSiteOccupation {
  readonly type: TKIndicatorType.OCCUPATION;
  readonly nameLabel: TKLabel;
  readonly valueNumber: number; // percentage: 12
  readonly valueLabel: TKLabel; // like : Yes (12%)tooltip, displayable, etC.
  readonly valueYesNoLabel: TKLabel; // Yes or No
  readonly iconOchaName: string;
}

export type TKIndicator = TKIndicatorStandard | TKIndicatorSiteOccupation;

export { TKIndicatorType };

export function TKIndicatorDefault(ref: TKFDFIndicator) {
  if (ref.type === TKIndicatorType.OCCUPATION) {
    return {
      type: ref.type,
      valueNumber: -1,
      valueYesNoLabel: { en: "-" },
      nameLabel: ref.name,
      valueLabel: { en: "-" },
      iconOchaName: ref.iconOchaName
    };
  }

  return {
    type: ref.type,
    nameLabel: ref.name,
    valueLabel: { en: "-" },
    iconOchaName: ref.iconOchaName
  };
}
