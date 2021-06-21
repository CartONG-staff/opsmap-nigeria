import { TKLabel } from "@/domain/ui/TKLabel";

export enum TKIndicatorComputationType {
  SUM,
  MEAN
}

export class TKIndicatorDescription {
  readonly name: TKLabel;
  readonly entryCode: string;
  readonly iconOchaName: string;

  constructor(
    name: TKLabel,
    entryCode: string,
    iconOchaName: string
  ) {
    this.name = name;
    this.entryCode = entryCode;
    this.iconOchaName = iconOchaName;
  }
}
export class TKIndicatorDescriptionSiteOccupation extends TKIndicatorDescription {
  // In the case of occupation:
  // - entryCode is supposed to be Site max capicity
  // - entryCodeSecond is supposed to be People
  readonly entryCodePeopleCount: string;
  readonly entryCodeMaxPeopleCount: string;
  constructor(
    name: TKLabel,
    entryCode: string,
    entryCodePeopleCount: string,
    entryCodeMaxPeopleCount: string,
    iconOchaName: string
  ) {
    super(name, entryCode, iconOchaName);
    this.entryCodePeopleCount = entryCodePeopleCount;
    this.entryCodeMaxPeopleCount = entryCodeMaxPeopleCount;
  }
}

export interface TKIndicatorsDescription {
  home: [
    TKIndicatorDescription,
    TKIndicatorDescription,
    TKIndicatorDescription
  ];
  site: [
    TKIndicatorDescription,
    TKIndicatorDescription,
    TKIndicatorDescription
  ];
}
