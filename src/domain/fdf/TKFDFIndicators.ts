import { TKLabel } from "@/domain/utils/TKLabel";

export enum TKFDFIndicatorType {
  SITE_COUNT = "site_count",
  PEOPLE_COUNT = "people_count",
  STANDARD = "standard",
  OCCUPATION = "site_occupation"
}

export interface TKFDFIndicatorStandard {
  readonly type: TKFDFIndicatorType.STANDARD;
  readonly name: TKLabel;
  readonly entryCode: string;
  readonly iconOchaName: string;
}

export interface TKFDFIndicatorSiteCount {
  readonly type: TKFDFIndicatorType.SITE_COUNT;
}

export interface TKFDFIndicatorPeopleCount {
  readonly type: TKFDFIndicatorType.PEOPLE_COUNT;
  readonly entryCode: string;
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

export type TKFDFIndicatorCamp =
  | TKFDFIndicatorStandard
  | TKFDFIndicatorSiteOccupation;

export type TKFDFIndicator =
  | TKFDFIndicatorSiteCount
  | TKFDFIndicatorPeopleCount
  | TKFDFIndicatorStandard
  | TKFDFIndicatorSiteOccupation;
export interface TKFDFIndicators {
  home: [
    TKFDFIndicatorSiteCount,
    TKFDFIndicatorPeopleCount,
    TKFDFIndicatorStandard
  ];
  site: [TKFDFIndicatorCamp, TKFDFIndicatorCamp, TKFDFIndicatorCamp];
}
