/* eslint-disable @typescript-eslint/camelcase */

import { TKSubmission } from "@/domain/core/TKSubmission";
import { TKSubmissionThematic, TKSUbmissionThematicfromThematic } from "@/domain/core/TKSubmissionThematic";

import { TKIndicator } from "@/domain/core/TKIndicator";
import { TKIndicatorsDescription, TKIndicatorDescription } from "@/domain/core/TKIndicatorsDescription";
import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";
import { TKSubmissionsRulesCollection } from "../surveyConfiguration/TKSubmissionsRulesBuilder";
import { TKCreateSubmissionEntryAgePyramid, TKSubmissionEntryAgePyramidItem } from "./TKCreateSubmissionEntryAgePyramid";
import { TKCreateSubmissionEntryText } from "./TKCreateSubmissionEntryText";
import { findPoint } from "@turf/meta";
import { TKSubmissionEntryText } from "@/domain/core/TKSubmissionEntry";
import { VAlert } from "vuetify/lib";

// ////////////////////////////////////////////////////////////////////////////
// checks
// ////////////////////////////////////////////////////////////////////////////

// TO DEVELOP
function isSubmissionRelevant(): boolean {
  return true;
}

function isSubmissionInThematic(
  submission: string,
  thematic: string,
  submissionsRules: TKSubmissionsRulesCollection
): boolean {
  return submissionsRules[submission]
    ? submissionsRules[submission].thematic_group === thematic
      ? true
      : false
    : false;
}

function isSubmissionAnAgePyramid(surveyConfiguration: TKSurveyConfiguration,field: string){
  return surveyConfiguration.submissionsRules[field].chart_id && surveyConfiguration.submissionsRules[field].chart_id.includes("age_pyramid");
}

// ////////////////////////////////////////////////////////////////////////////
// indicators management
// ////////////////////////////////////////////////////////////////////////////

function computeSubmissionIndicator(descr: TKIndicatorDescription, data: Record<string, TKSubmissionThematic>) : TKIndicator{
  const splitted = descr.entryCode.split("_")
  if(splitted){
    const thematic = "group_"+splitted[0];
    const entry = data[thematic].data.find(item => item.field === descr.entryCode);
    if(entry instanceof TKSubmissionEntryText){
      return {
        iconOchaName: descr.iconOchaName,
        nameLabel: entry.fieldLabel,
        valueLabel: entry.answerLabel
      }
    }
  }
  return {
    iconOchaName: descr.iconOchaName,
    nameLabel: {field_name: "", field_label_en: ""},
    valueLabel: {field_name: "", field_label_en: ""}
  }
}

function computeSubmissionIndicators(descr: TKIndicatorsDescription, data: Record<string, TKSubmissionThematic>) : [TKIndicator, TKIndicator, TKIndicator] {
  return [
    computeSubmissionIndicator(descr.site[0], data),
    computeSubmissionIndicator(descr.site[1], data),
    computeSubmissionIndicator(descr.site[2], data)
  ];
}

// ////////////////////////////////////////////////////////////////////////////
// Create the submission
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSubmission(
  submissionItem: any,
  surveyConfiguration: TKSurveyConfiguration,
  indicatorsDescription: TKIndicatorsDescription
) : TKSubmission {
  const submission: Record<string, TKSubmissionThematic> = {};
  for (const thematic in surveyConfiguration.thematics) {
    submission[thematic] = TKSUbmissionThematicfromThematic(surveyConfiguration.thematics[thematic]);
    let agePyramidId = "";
    let agePyramidData : Array<TKSubmissionEntryAgePyramidItem> = [];
    for (const field in submissionItem) {
      if (
        isSubmissionInThematic(
          field,
          thematic,
          surveyConfiguration.submissionsRules
        )
      ) {
        if (isSubmissionRelevant()) {

          // If age pyramid -- accumulate process
          if(isSubmissionAnAgePyramid(surveyConfiguration, field)){

            // If it's a new chart - create current chart, then cleanup
            if(agePyramidId && agePyramidId !== surveyConfiguration.submissionsRules[field].chart_id){
              submission[thematic].data.push(
                TKCreateSubmissionEntryAgePyramid(
                  agePyramidData,
                  surveyConfiguration
                )
              );
              agePyramidId = "";
              agePyramidData = [];
            }

            // If no previous chart, init
            if(!agePyramidId){
              agePyramidId = surveyConfiguration.submissionsRules[field].chart_id;
              agePyramidData = [];
            }

            // accumulate
            agePyramidData.push( {field: field, value: submissionItem[field], type: surveyConfiguration.submissionsRules[field].chart_data } );
          }
          else {
            // if a current pyramid is ongoing - push it before switching to text item
            if(agePyramidId){
              submission[thematic].data.push(
                TKCreateSubmissionEntryAgePyramid(
                  agePyramidData,
                  surveyConfiguration
                )
              );
              agePyramidId = "";
              agePyramidData = [];
            }
            submission[thematic].data.push(
              TKCreateSubmissionEntryText(
                submissionItem[field],
                field,
                surveyConfiguration
              )
            );
          }
        }
      }
    }
  }

  //  Solution to filter thematics if nothing has been answered. ////////////////////////
  // Object.entries(submission).filter(item => item.length > 0)
  // const submissionFiltered: Record<string, TKSubmissionThematic> = {};
  // for(const key of Object.keys(submission)){
  //   if(submission[key].data.filter(item => item.isAnswered()).length > 0){
  //     submissionFiltered[key] = submission[key];
  //   }
  // }

//  Solution to filter thematics if nothing has been answered. ////////////////////////
  Object.entries(submission).filter(item => item.length > 0)
  const submissionFiltered: Record<string, TKSubmissionThematic> = {};
  for(const key of Object.keys(submission)){
    if(submission[key].data.length > 0){
      submissionFiltered[key] = submission[key];
    }
  }

  const result: TKSubmission = {
    thematics: submissionFiltered,
    indicators: computeSubmissionIndicators(indicatorsDescription, submission)
  }

  return result;
}
