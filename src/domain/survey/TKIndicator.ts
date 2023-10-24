import { TKLabel } from "@/domain/utils/TKLabel";
import {
  TKFDFIndicator,
  TKFDFIndicatorArea,
  TKFDFIndicatorType
} from "@/domain/fdf/TKFDFIndicators";
import { TKSite } from "./TKSite";
import { TKSubmissionEntryTextType } from "./TKSubmissionEntry";
import { TKSurvey } from "./TKSurvey";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

export enum TKIndicatorType {
  STANDARD = "standard",
  OCCUPATION = "site_occupation"
}

export interface TKIndicatorStandard {
  readonly type: TKIndicatorType.STANDARD;
  readonly nameLabel: TKLabel | string;
  readonly valueLabel: TKLabel;
  readonly iconOchaName: string;
}

export interface TKIndicatorSiteOccupation {
  readonly type: TKIndicatorType.OCCUPATION;
  readonly nameLabel: TKLabel;
  readonly valueNumber: number; // percentage: 12
  readonly valueLabel: TKLabel; // like : Yes (12%)tooltip, displayable, etC.
  readonly valueYesNoLabel: TKLabel | null; // Yes or No. nullable
  readonly iconOchaName: string;
}

export const SITE_COUNT_ICON = "IDP-refugee-camp";
export const PEOPLE_COUNT_ICON = "People-in-need";

export type TKIndicator = TKIndicatorStandard | TKIndicatorSiteOccupation;

export type TKIndicators = [TKIndicator, TKIndicator, TKIndicator];

export function TKIndicatorDefault(ref: TKFDFIndicator): TKIndicator {
  switch (ref.type) {
    case TKFDFIndicatorType.OCCUPATION:
      return {
        type: TKIndicatorType.OCCUPATION,
        valueNumber: -1,
        valueYesNoLabel: {
          [TKConfigurationModule.configuration.locale.default]: "-"
        },
        nameLabel: ref.name,
        valueLabel: {
          [TKConfigurationModule.configuration.locale.default]: "-"
        },
        iconOchaName: ref.iconOchaName
      };
    case TKFDFIndicatorType.SITE_COUNT:
      return {
        type: TKIndicatorType.STANDARD,
        nameLabel: "indicator.siteCount",
        valueLabel: {
          [TKConfigurationModule.configuration.locale.default]: "-"
        },
        iconOchaName: SITE_COUNT_ICON
      };
    case TKFDFIndicatorType.PEOPLE_COUNT:
      return {
        type: TKIndicatorType.STANDARD,
        nameLabel: "indicator.peopleCount",
        valueLabel: {
          [TKConfigurationModule.configuration.locale.default]: "-"
        },
        iconOchaName: PEOPLE_COUNT_ICON
      };

    case TKFDFIndicatorType.STANDARD:
    case TKFDFIndicatorType.VALUE_COUNT:
    case TKFDFIndicatorType.COMPUTATION:
    default:
      return {
        type: TKIndicatorType.STANDARD,
        nameLabel: ref.name,
        valueLabel: {
          [TKConfigurationModule.configuration.locale.default]: "-"
        },
        iconOchaName: ref.iconOchaName
      };
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Compute Area indicator
// ////////////////////////////////////////////////////////////////////////////

export function computeAreaIndicator(
  descr: TKFDFIndicatorArea,
  sites: TKSite[]
): TKIndicator {
  // Handle Site Count
  if (descr.type === TKFDFIndicatorType.SITE_COUNT) {
    return {
      type: TKIndicatorType.STANDARD,
      nameLabel: "indicator.siteCount",
      valueLabel: {
        [TKConfigurationModule.configuration.locale.default]: String(
          sites.length
        )
      },
      iconOchaName: SITE_COUNT_ICON
    };
  }

  // Accumulate results
  const results = [];
  for (const site of sites) {
    if (site.submissions.length > 0) {
      const submission = site.submissions[0];

      const item = submission.entries[descr.entryCode];
      if (
        item &&
        item.type === TKSubmissionEntryTextType.TEXT &&
        item.answerLabel
      ) {
        results.push(
          item.answerLabel[TKConfigurationModule.configuration.locale.default]
        );
      }
    }
  }

  // Process Results
  let result = "-";
  if (results.length > 0) {
    if (
      descr.type === TKFDFIndicatorType.PEOPLE_COUNT ||
      descr.type === TKFDFIndicatorType.STANDARD
    ) {
      // Do the sum of numeric value
      result = String(
        results.reduce(
          (sum, current) =>
            sum +
            (!isNaN(parseFloat(current)) ? Math.floor(parseFloat(current)) : 0),
          0
        )
      );
    } else if (descr.type === TKFDFIndicatorType.VALUE_COUNT) {
      result = String(results.filter(item => item === descr.refValue).length);
    }
  }

  if (descr.type === TKFDFIndicatorType.PEOPLE_COUNT) {
    return {
      type: TKIndicatorType.STANDARD,
      nameLabel: "indicator.peopleCount",
      valueLabel: {
        [TKConfigurationModule.configuration.locale.default]: result
      },
      iconOchaName: PEOPLE_COUNT_ICON
    };
  }

  return {
    type: TKIndicatorType.STANDARD,
    iconOchaName: descr.iconOchaName,
    nameLabel: descr.name,
    valueLabel: { [TKConfigurationModule.configuration.locale.default]: result }
  };
}

// ////////////////////////////////////////////////////////////////////////////
// Compute Area indicator
// ////////////////////////////////////////////////////////////////////////////

export function computeAreaIndicators(
  survey: TKSurvey,
  sites: TKSite[]
): TKIndicators {
  return [
    computeAreaIndicator(survey.fdf.indicators.area[0], sites),
    computeAreaIndicator(survey.fdf.indicators.area[1], sites),
    computeAreaIndicator(survey.fdf.indicators.area[2], sites)
  ];
}
