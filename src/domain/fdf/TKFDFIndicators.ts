import { TKLabel } from "@/domain/utils/TKLabel";

export enum TKFDFIndicatorType {
  STANDARD = "standard",
  OCCUPATION = "site_occupation"
}

export interface TKFDFIndicatorStandard {
  readonly type: TKFDFIndicatorType.STANDARD;
  readonly name: TKLabel;
  readonly entryCode: string;
  readonly iconOchaName: string;
}
export interface TKFDFIndicatorSiteOccupation {
  // In the case of occupation:
  // - entryCode is supposed to be Site max capicity
  // - entryCodeSecond is supposed to be People
  readonly type: TKFDFIndicatorType.OCCUPATION;
  readonly name: TKLabel;
  readonly entryCodeMaxCapacity: string;
  readonly iconOchaName: string;
  readonly entryCodePeopleCount: string;
  readonly entryCodeMaxPeopleCount: string;
}

export type TKFDFIndicatorHome = TKFDFIndicatorStandard;
export type TKFDFIndicatorCamp =
  | TKFDFIndicatorStandard
  | TKFDFIndicatorSiteOccupation;

export type TKFDFIndicator =
  | TKFDFIndicatorStandard
  | TKFDFIndicatorSiteOccupation;
export interface TKFDFIndicators {
  home: [TKFDFIndicatorHome, TKFDFIndicatorHome, TKFDFIndicatorHome];
  site: [TKFDFIndicatorCamp, TKFDFIndicatorCamp, TKFDFIndicatorCamp];
}
