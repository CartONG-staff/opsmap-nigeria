/* eslint-disable @typescript-eslint/no-explicit-any */
import { TKFDF } from "@/domain/fdf/TKFDF";
import {
  TKCreateSubmissionEntryText,
  TKCreateSubmissionEntryList,
  TKCreateSubmissionEntryBullet,
  TKSubmissionRawEntries,
  TKSubmissionEntryTextType
} from "./TKSubmissionEntry";
import {
  TKChartData,
  TKCreateSubmissionChart
} from "./TKCreateSubmissionChart";
import {
  TKSubmissionThematic,
  TKCreateSubmissionThematic
} from "./TKSubmissionThematic";
import {
  TKIndicator,
  TKIndicatorType,
  TKIndicators
} from "@/domain/survey/TKIndicator";
import { TKLabel } from "@/domain/utils/TKLabel";
import {
  TKFDFSubmissionItemType,
  TKFDFSubmissionRule
} from "@/domain/fdf/TKFDFSubmissionsRules";
import { TKCompare, TKCompute } from "@/domain/utils/TKOperator";
import { TKOperatorComputation } from "@/domain/utils/TKOperator";
import { TKOperatorComparison } from "@/domain/utils/TKOperator";
import {
  TKFDFIndicatorSite,
  TKFDFIndicatorType
} from "@/domain/fdf/TKFDFIndicators";
import { evaluate, round } from "mathjs";
import { TKSurveyOptions } from "./TKSurvey";
import { TKSubmissionEntries } from "./TKSubmissionEntries";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

// ////////////////////////////////////////////////////////////////////////////
//  Submission concept definition
// ////////////////////////////////////////////////////////////////////////////

export interface TKSubmission {
  date: string;
  entries: TKSubmissionEntries;
  thematics: Array<TKSubmissionThematic>;
  indicators: TKIndicators;
}

// ////////////////////////////////////////////////////////////////////////////
// indicators management
// ////////////////////////////////////////////////////////////////////////////

function getValueForIndicator(
  data: TKSubmissionEntries,
  entryCode: string
): number | undefined {
  const entry = data[entryCode];
  if (
    entry &&
    entry.type === TKSubmissionEntryTextType.TEXT &&
    entry.answerLabel &&
    !isNaN(
      parseFloat(
        entry.answerLabel[TKConfigurationModule.configuration.locale.default]
      )
    )
  ) {
    return Number(
      entry.answerLabel[TKConfigurationModule.configuration.locale.default]
    );
  }

  return undefined;
}

function getLabelForIndicator(
  data: TKSubmissionEntries,
  entryCode: string
): TKLabel {
  const entry = data[entryCode];
  if (
    entry &&
    entry.type === TKSubmissionEntryTextType.TEXT &&
    entry.answerLabel
  ) {
    return entry.answerLabel;
  }
  return { [TKConfigurationModule.configuration.locale.default]: "-" };
}

function computeSubmissionIndicator(
  descr: TKFDFIndicatorSite,
  data: TKSubmissionEntries
): TKIndicator {
  if (descr.type === TKFDFIndicatorType.OCCUPATION) {
    // Should be two integers
    const peopleCount = getValueForIndicator(data, descr.entryCodePeopleCount);
    const maxPeopleCount = getValueForIndicator(
      data,
      descr.entryCodeMaxPeopleCount
    );

    if (
      peopleCount !== undefined &&
      maxPeopleCount !== undefined &&
      maxPeopleCount !== 0
    ) {
      const percentValue = Math.round((peopleCount / maxPeopleCount) * 100);
      const percentText = percentValue.toString();
      const valueLabel: TKLabel = {};
      Object.keys(descr.name).map(key => {
        valueLabel[key] = "";
      });

      const labelIsMaxCapacity = descr.entryCodeMaxCapacity
        ? getLabelForIndicator(data, descr.entryCodeMaxCapacity)
        : null;
      for (const k in valueLabel) {
        valueLabel[k] = labelIsMaxCapacity
          ? labelIsMaxCapacity[k] + " (" + percentText + "%)"
          : percentText;
      }
      return {
        type: TKIndicatorType.OCCUPATION,
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueNumber: percentValue,
        valueLabel: valueLabel,
        valueYesNoLabel: labelIsMaxCapacity
      };
    } else {
      return {
        type: TKIndicatorType.OCCUPATION,
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueLabel: {
          [TKConfigurationModule.configuration.locale.default]: "-"
        },
        valueNumber: -1,
        valueYesNoLabel: {
          [TKConfigurationModule.configuration.locale.default]: "-"
        }
      };
    }
  } else {
    if (descr.type === TKFDFIndicatorType.COMPUTATION) {
      const entry1Value = getValueForIndicator(data, descr.entryCode1) ?? 0;
      const entry2Value = getValueForIndicator(data, descr.entryCode2) ?? 0;
      const operation = `${entry1Value} ${descr.operator} ${entry2Value}`;
      let result = evaluate(operation);

      if (descr.numberStrategy && descr.numberStrategy === "round") {
        result = round(result);
      }

      return {
        type: TKIndicatorType.STANDARD,
        iconOchaName: descr.iconOchaName,
        nameLabel: descr.name,
        valueLabel: {
          [TKConfigurationModule.configuration.locale.default]: result
        }
      };
    }
    const label = getLabelForIndicator(data, descr.entryCode);
    return {
      type: TKIndicatorType.STANDARD,
      iconOchaName: descr.iconOchaName,
      nameLabel: descr.name,
      valueLabel: label
    };
  }
}

// ////////////////////////////////////////////////////////////////////////////
// displayStatus
// ////////////////////////////////////////////////////////////////////////////
function handleDisplayStatus(
  rawEntries: TKSubmissionRawEntries,
  rule: TKFDFSubmissionRule
): boolean {
  // Handle display status
  let display = true;
  if (rule.displayCondition) {
    try {
      display = TKCompare(
        rawEntries[rule.displayCondition.field],
        rule.displayCondition.operator as TKOperatorComparison,
        rule.displayCondition.value
      );
    } catch (error) {
      display = false;
    }
  }
  return display;
}
// ////////////////////////////////////////////////////////////////////////////
// Create the submission
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSubmission(
  submissionRawEntries: TKSubmissionRawEntries,
  fdf: TKFDF,
  options: TKSurveyOptions,
  locale: string[]
): TKSubmission {
  // Init all the thematics
  const thematics: Record<
    string,
    {
      thematic: TKSubmissionThematic;
      isInEntries: boolean;
    }
  > = {};
  for (const thematic in fdf.thematics) {
    thematics[thematic] = {
      thematic: TKCreateSubmissionThematic(fdf.thematics[thematic]),
      isInEntries: false
    };
  }

  // Init all the entries
  const entries: TKSubmissionEntries = {};

  // Init chart accumulator
  const charts: Record<string, TKChartData> = {};

  // Iterate through all submission rules
  for (const key in fdf.submissionsRules) {
    const rule = fdf.submissionsRules[key];
    const thematic = thematics[rule.thematicGroup];

    // If a thematic is defined
    // TODO: could be used to hide a field ?
    if (thematic) {
      // Handle display status
      const display = handleDisplayStatus(submissionRawEntries, rule);
      if (display) {
        thematic.isInEntries = true;
        // If charts: fill the charts record
        if (rule.chartId) {
          const value = submissionRawEntries[rule.fieldName];

          // Init currentChart
          if (!charts[rule.chartId]) {
            charts[rule.chartId] = {
              id: rule.chartId,
              thematic: thematic.thematic,
              data: []
            };
          }

          // Accumulate Chart data
          charts[rule.chartId].data.push({
            field: rule.fieldName,
            value: value,
            type: rule.chartData
          });
        }

        // If text item
        else {
          let value = "";
          switch (rule.type) {
            case TKFDFSubmissionItemType.COMPUTED:
              try {
                if (rule.computed) {
                  value = Math.round(
                    TKCompute(
                      Number(submissionRawEntries[rule.computed.field1]),
                      rule.computed.operator as TKOperatorComputation,
                      Number(submissionRawEntries[rule.computed.field2])
                    )
                  ).toString();
                } else {
                  value = submissionRawEntries[rule.fieldName];
                }
              } catch (error) {
                value = "";
              }

              entries[rule.fieldName] = TKCreateSubmissionEntryText(
                value,
                rule,
                fdf,
                submissionRawEntries,
                thematic.thematic
              );

              break;
            case TKFDFSubmissionItemType.LIST:
              value = submissionRawEntries[rule.fieldName];
              if (value !== undefined) {
                entries[rule.fieldName] = TKCreateSubmissionEntryList(
                  value,
                  rule,
                  fdf,
                  thematic.thematic,
                  options.listSeparator,
                  locale
                );
              }
              break;
            case TKFDFSubmissionItemType.BULLET:
              value = submissionRawEntries[rule.fieldName];
              if (value !== undefined) {
                entries[rule.fieldName] = TKCreateSubmissionEntryBullet(
                  value,
                  rule,
                  fdf,
                  thematic.thematic,
                  options.listSeparator
                );
              }
              break;

            case TKFDFSubmissionItemType.DATE:
            case TKFDFSubmissionItemType.INTEGER:
            case TKFDFSubmissionItemType.STRING:
              value = submissionRawEntries[rule.fieldName];
              if (value !== undefined) {
                entries[rule.fieldName] = TKCreateSubmissionEntryText(
                  value,
                  rule,
                  fdf,
                  submissionRawEntries,
                  thematic.thematic
                );
              }
              break;
          }
        }
      }
    }
  }

  // if a current chart is ongoing - push it before ending
  for (const chart of Object.values(charts)) {
    TKCreateSubmissionChart(chart, fdf, entries);
  }

  //  Solution to filter thematics if nothing has been answered. ////////////////////////
  const thematicsFiltered: Array<TKSubmissionThematic> = Object.values(
    thematics
  )
    .filter(thematic => thematic.isInEntries)
    .map(thematic => thematic.thematic);

  return {
    date: submissionRawEntries[fdf.spatial.siteFields.lastUpdate],
    entries: entries,
    thematics: thematicsFiltered,
    indicators: [
      computeSubmissionIndicator(fdf.indicators.site[0], entries),
      computeSubmissionIndicator(fdf.indicators.site[1], entries),
      computeSubmissionIndicator(fdf.indicators.site[2], entries)
    ]
  };
}
