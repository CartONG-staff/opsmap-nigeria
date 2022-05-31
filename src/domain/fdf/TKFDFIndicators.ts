import { TKLabel } from "@/domain/utils/TKLabel";

export enum TKFDFIndicatorType {
  SITE_COUNT = "site_count",
  PEOPLE_COUNT = "people_count",
  STANDARD = "standard",
  OCCUPATION = "site_occupation",
  VALUE_COUNT = "value_count"
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

export interface TKFDFIndicatorValueCount {
  readonly type: TKFDFIndicatorType.VALUE_COUNT;
  readonly name: TKLabel;
  readonly entryCode: string;
  readonly refValue: string;
  readonly iconOchaName: string;
}
export interface TKFDFIndicatorSiteOccupation {
  // In the case of occupation:
  // - entryCode is supposed to be Site max capicity
  // - entryCodeSecond is supposed to be People
  readonly type: TKFDFIndicatorType.OCCUPATION;
  readonly name: TKLabel;
  readonly entryCodeMaxCapacity?: string;
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
  | TKFDFIndicatorValueCount
  | TKFDFIndicatorStandard
  | TKFDFIndicatorSiteOccupation;
export interface TKFDFIndicators {
  home: [
    TKFDFIndicatorSiteCount,
    TKFDFIndicatorPeopleCount,
    TKFDFIndicatorStandard | TKFDFIndicatorValueCount
  ];
  site: [TKFDFIndicatorCamp, TKFDFIndicatorCamp, TKFDFIndicatorCamp];
}
