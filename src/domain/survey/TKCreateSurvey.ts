import { TKCreateSubmissionThematics } from "./surveyraw/TKCreateSubmissionThematics";
import { TKSpatialDescription } from "@/domain/core/TKSpatialDescription";
import { TKSurveyConfiguration } from "@/domain/core/TKSurveyConfiguration";

import { TKBoundariesCollection } from "@/domain/core/TKBoundariesCollection";
import { TKSurvey } from "@/domain/core/TKSurvey";
import { TKCampDescription } from "@/domain/core/TKCampDescription";
import { TKLanguageDescription } from "@/domain/core/TKLanguageDescription";

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

export function TKCreateSurvey(
  sumbmissions: any[],
  surveyConfig: TKSurveyConfiguration,
  spatialDescription: TKSpatialDescription,
  languages: TKLanguageDescription[]
): TKSurvey {
  const submissionsByCamps: { [index: string]: any } = {};
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
      ] = TKCreateSubmissionThematics(submission, surveyConfig, languages);
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
        ]]: TKCreateSubmissionThematics(submission, surveyConfig, languages)
      };
    }
  }
  return {
    submissionsByCamps: submissionsByCamps,
    campsList: campsList,
    boundariesList: boundariesList
  };
}
