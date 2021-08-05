import { TKLabel } from "@/domain/ui/TKLabel";

export enum TKIndicatorComputationType {
  SUM,
  MEAN
}

export interface TKIndicatorDescription {
  readonly type: "standard";
  readonly name: TKLabel;
  readonly entryCode: string;
  readonly iconOchaName: string;
}
export interface TKIndicatorDescriptionSiteOccupation {
  // In the case of occupation:
  // - entryCode is supposed to be Site max capicity
  // - entryCodeSecond is supposed to be People
  readonly type: "site_occupation";
  readonly name: TKLabel;
  readonly entryCodeMaxCapacity: string;
  readonly iconOchaName: string;
  readonly entryCodePeopleCount: string;
  readonly entryCodeMaxPeopleCount: string;
}

export interface TKIndicatorsDescription {
  home: [
    TKIndicatorDescription,
    TKIndicatorDescription,
    TKIndicatorDescription
  ];
  site: [
    TKIndicatorDescription | TKIndicatorDescriptionSiteOccupation,
    TKIndicatorDescription | TKIndicatorDescriptionSiteOccupation,
    TKIndicatorDescription | TKIndicatorDescriptionSiteOccupation
  ];
}
