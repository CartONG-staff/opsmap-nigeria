/* eslint-disable @typescript-eslint/camelcase */
import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";
import {
  TKTrafficLightColors,
  TKTrafficLightGrouped,
  TrafficLightTypes
} from "@/domain/core/TKTrafficLight";

import {
  LanguageCode,
  TKLanguageDescription
} from "@/domain/core/TKLanguageDescription";
import { TKSubmissionEntryAgePyramid } from "@/domain/core/TKSubmissionEntry";

function getTrafficLightColor(
  value: string,
  trafficLight: TKTrafficLightGrouped
): TKTrafficLightColors {
  if (trafficLight.type === TrafficLightTypes.STRING) {
    const match = trafficLight.values
      .filter(x => x.value.toLowerCase() === value.toLowerCase())
      .map(x => x.color)
      .pop();
    return match === undefined ? TKTrafficLightColors.UNDEFINED : match;
  }
  return TKTrafficLightColors.UNDEFINED;
}
export interface TKSubmissionEntryAgePyramidItem{
  field: string;
  value: string;
  type: string;
}

export function TKCreateSubmissionEntryAgePyramid(
  chartdata: Array<TKSubmissionEntryAgePyramidItem>,
  surveyConfiguration: TKSurveyConfiguration,
  languages: TKLanguageDescription[]
): TKSubmissionEntryAgePyramid {
  const languagesList = [...new Set(languages.map(x => x.code))];

  const malesEntries = chartdata.filter(item => item.type === 'm');
  const femalesEntries = chartdata.filter(item => item.type === 'f');

  const malesDataset = malesEntries.map(item => Number(item.value));
  const femalesDataset = femalesEntries.map(item => Number(item.value));

  const malesLabel = malesEntries.map(item => surveyConfiguration.fieldsLabels[item.field]);
  const femalesLabel = femalesEntries.map(item => surveyConfiguration.fieldsLabels[item.field]);

  console.log(malesLabel);
  console.log(femalesLabel);

  return new TKSubmissionEntryAgePyramid("agepyramid", "agepyramiden", "agepyramidpt", malesDataset, femalesDataset);
  // return new TKSubmissionEntryText(
  //   field,
  //   surveyConfiguration.fieldsLabels[field].field_label_en,
  //   languagesList.includes(LanguageCode.PT)
  //     ? surveyConfiguration.fieldsLabels[field]?.field_label_pt || value
  //     : "",
  //   surveyConfiguration.answersLabels[field]?.choice_name_en || value,
  //   languagesList.includes(LanguageCode.PT)
  //     ? surveyConfiguration.answersLabels[field]?.choice_name_pt || value
  //     : "",
  //   surveyConfiguration.submissionsRules[field].traffic_light_name.length > 0,
  //   surveyConfiguration.submissionsRules[field].traffic_light_name.length > 0
  //     ? getTrafficLightColor(
  //         value,
  //         surveyConfiguration.trafficLights[
  //           surveyConfiguration.submissionsRules[field].traffic_light_name
  //         ]
  //       )
  //     : TKTrafficLightColors.UNDEFINED
  // );
}
