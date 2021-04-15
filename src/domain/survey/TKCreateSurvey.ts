import { TKCreateSubmission } from "./surveyRawData/TKCreateSubmission";
import { TKSpatialDescription } from "@/domain/core/TKSpatialDescription";
import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";

import { TKBoundariesCollection } from "@/domain/core/TKBoundariesCollection";
import { TKSurvey } from "@/domain/core/TKSurvey";
import { TKCampDescription } from "@/domain/core/TKCampDescription";
import { TKLanguageDescription } from "@/domain/core/TKLanguageDescription";
import { TKSubmission } from "@/domain/core/TKSubmission";
import { TKIndicator } from "@/domain/core/TKIndicator";
import { TKIndicatorsDescription, TKIndicatorDescription, TKIndicatorComputationType } from "@/domain/core/TKIndicatorsDescription";
import { isNumber } from "@turf/helpers";

// import { spatialDescription } from "@/app-demo/appConfiguration";
// const siteIDField: string = spatialDescription.siteIDField;
// const siteNameField = spatialDescription.siteNameField;
// const siteTypeField = spatialDescription.siteTypeField;
// const siteLastUpdateField = spatialDescription.siteLastUpdateField;
// const siteLatitudeField = spatialDescription.siteLatitudeField;
// const siteLongitudeField = spatialDescription.siteLongitudeField;

// type Submission {
//   [siteIDField]: string;
//   [siteNameField]: string;
//   [siteTypeField]: string;
//   [siteLastUpdateField]: string;
//   [siteLatitudeField]: string;
//   [siteLongitudeField]: string;
//   [propName: string]: string | number;
// }

function computeSurveyIndicator(descr: TKIndicatorDescription, data: {[campId: string]: { [date: string]: TKSubmission }}) : TKIndicator{

  if(descr.entryCode === "mp_site_id"){
    return {
      iconOchaName: descr.iconOchaName,
      nameEn: descr.name,
      namePt: descr.name,
      valueEn: String(Object.keys(data).length),
      valuePt: String(Object.keys(data).length)
    }
  }

  const splitted = descr.entryCode.split("_")
  if(splitted){
    const thematic = "group_"+splitted[0];
    let sum = 0;
    for (const camp in data) {
      const last = Object.keys(data[camp])[0];
      const submission = data[camp][last];
      if(submission){
        const them = submission.thematics[thematic];
        if(them){
          const item = them.data.find(item => item.field === descr.entryCode);
          if(item && isNumber(item.answerLabelEn)){
            sum +=  Number(item.answerLabelEn)
          }

        }
      }
    }
    if(!descr.computationType){
      return {
        iconOchaName: descr.iconOchaName,
        nameEn: descr.name,
        namePt: descr.name,
        valueEn: String(sum),
        valuePt: String(sum)
      }
    }
    if(descr.computationType === TKIndicatorComputationType.MEAN){
      return {
        iconOchaName: descr.iconOchaName,
        nameEn: descr.name,
        namePt: descr.name,
        valueEn: String( (sum / Object.keys(data).length).toFixed(2) ),
        valuePt: String( (sum / Object.keys(data).length).toFixed(2) )
      }
    } else if (descr.computationType === TKIndicatorComputationType.SUM) {
      return {
        iconOchaName: descr.iconOchaName,
        nameEn: descr.name,
        namePt: descr.name,
        valueEn: String(sum),
        valuePt: String(sum)
      }
    }
  }
  return {
    iconOchaName: descr.iconOchaName,
    nameEn: "NptFound",
    namePt: "NptFound",
    valueEn: descr.name,
    valuePt: descr.name
  }
}


function computeSurveyIndicators(descr: TKIndicatorsDescription, data: {[campId: string]: { [date: string]: TKSubmission }}) : [TKIndicator, TKIndicator, TKIndicator] {
  return [
    computeSurveyIndicator(descr.home[0], data),
    computeSurveyIndicator(descr.home[1], data),
    computeSurveyIndicator(descr.home[2], data)
  ];
}
export function TKCreateSurvey(
  sumbmissions: any[],
  surveyConfig: TKSurveyConfiguration,
  spatialDescription: TKSpatialDescription,
  indicatorsDescription: TKIndicatorsDescription,
  languages: TKLanguageDescription[]
): TKSurvey {
  const submissionsByCamps: {
    [campId: string]: { [date: string]: TKSubmission };
  } = {};
  const campsList: TKCampDescription[] = [];
  const boundariesList: TKBoundariesCollection = {
    admin1: [],
    admin2: []
  };
  for (const submission of sumbmissions) {
    if (submissionsByCamps[submission[spatialDescription.siteIDField]]) {
      campsList.map((x) => {
        if (x.id === submission[spatialDescription.siteIDField]) {
          x.submissionsDates.push(
            submission[spatialDescription.siteLastUpdateField]
          );
        }
      });
      submissionsByCamps[submission[spatialDescription.siteIDField]][
        submission[spatialDescription.siteLastUpdateField]
      ] = TKCreateSubmission(submission, surveyConfig, indicatorsDescription, languages);
    } else {
      campsList.push({
        id: submission[spatialDescription.siteIDField],
        name: submission[spatialDescription.siteNameField],
        type: submission[spatialDescription.siteTypeField],
        submissionsDates: [submission[spatialDescription.siteLastUpdateField]],
        coordinates: [
          Number(
            submission[spatialDescription.siteLatitudeField].replace(",", ".")
          ),
          Number(
            submission[spatialDescription.siteLongitudeField].replace(",", ".")
          )
        ],
        admin1: {
          pcode: submission[spatialDescription.adm1Pcode],
          name: submission[spatialDescription.adm1Name]
        },
        admin2: {
          pcode: submission[spatialDescription.adm2Pcode],
          name: submission[spatialDescription.adm2Name]
        },
        admin3: {
          pcode: submission[spatialDescription.adm3Pcode],
          name: submission[spatialDescription.adm3Name]
        }
      });
      if (
        !boundariesList.admin2
          .map((x) => x.pcode)
          .includes(submission[spatialDescription.adm2Pcode])
      ) {
        boundariesList.admin2.push({
          pcode: submission[spatialDescription.adm2Pcode],
          name: submission[spatialDescription.adm2Name]
        });
        if (
          !boundariesList.admin1
            .map((x) => x.pcode)
            .includes(submission[spatialDescription.adm1Pcode])
        ) {
          boundariesList.admin1.push({
            pcode: submission[spatialDescription.adm1Pcode],
            name: submission[spatialDescription.adm1Name]
          });
        }
      }

      submissionsByCamps[submission[spatialDescription.siteIDField]] = {
        [submission[
          spatialDescription.siteLastUpdateField
        ]]: TKCreateSubmission(submission, surveyConfig, indicatorsDescription, languages)
      };
    }
  }

  return {
    submissionsByCamps: submissionsByCamps,
    campsList: campsList,
    boundariesList: boundariesList,
    indicators: computeSurveyIndicators(indicatorsDescription, submissionsByCamps)
  };
}
