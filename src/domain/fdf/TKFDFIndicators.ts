import { TKLabel } from "@/domain/utils/TKLabel";
import { TKIndicatorType } from "@/domain/survey/TKIndicator";

export interface TKFDFIndicatorStandard {
  readonly type: TKIndicatorType.STANDARD;
  readonly name: TKLabel;
  readonly entryCode: string;
  readonly iconOchaName: string;
}
export interface TKFDFIndicatorSiteOccupation {
  // In the case of occupation:
  // - entryCode is supposed to be Site max capicity
  // - entryCodeSecond is supposed to be People
  readonly type: TKIndicatorType.OCCUPATION;
  readonly name: TKLabel;
  readonly entryCodeMaxCapacity: string;
  readonly iconOchaName: string;
  readonly entryCodePeopleCount: string;
  readonly entryCodeMaxPeopleCount: string;
}

export interface TKFDFIndicators {
  home: [
    TKFDFIndicatorStandard,
    TKFDFIndicatorStandard,
    TKFDFIndicatorStandard
  ];
  site: [
    TKFDFIndicatorStandard | TKFDFIndicatorSiteOccupation,
    TKFDFIndicatorStandard | TKFDFIndicatorSiteOccupation,
    TKFDFIndicatorStandard | TKFDFIndicatorSiteOccupation
  ];
}
