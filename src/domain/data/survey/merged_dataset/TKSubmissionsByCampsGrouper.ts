import { TKGroupAnswersByThematics } from "./TKEntriesByThematicGrouper";
import { TKSpatialDescription } from "@/domain/config/TKSpatialDescription";
import { TKSurveyConfiguration } from "@/domain/data/survey/raw_data/TKSurveyConfigurationBuilder";
import { Dataset } from "@/domain/data/survey/TKDatasetBuilder";
// import { spatialDescription } from "@/app-demo/appConfiguration";

export interface CampDescription {
  id: string;
  name: string;
  type: string;
  submissionsDates: string[];
  coordinates: [number, number];
}

interface BoundarieDescription {
  pcode: string;
  name: string;
}

export interface BoundariesCollection {
  admin1: BoundarieDescription[];
  admin2: BoundarieDescription[];
}

// interface BoundariesCollection {
//   admin1:
// }

// const siteIDField: string = spatialDescription.siteIDField as string;
// const siteNameField = spatialDescription.siteNameField;
// const siteTypeField = spatialDescription.siteTypeField;
// const siteLastUpdateField = spatialDescription.siteLastUpdateField;
// const siteLatitudeField = spatialDescription.siteLatitudeField;
// const siteLongitudeField = spatialDescription.siteLongitudeField;

// interface Submission {
//   [siteIDField]: string;
//   [siteNameField]: string;
//   [siteTypeField]: string;
//   [siteLastUpdateField]: string;
//   [siteLatitudeField]: string;
//   [siteLongitudeField]: string;
//   [propName: string]: string | number;
// }

export function TKGroupSubmissionsByCamp(
  sumbmissions: any[],
  survey: TKSurveyConfiguration,
  spatialDescription: TKSpatialDescription
): Dataset {
  const submissionsByCamps: { [index: string]: any } = {};
  const campsList: CampDescription[] = [];
  const boundariesList: BoundariesCollection = {
    admin1: [],
    admin2: [],
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
      ] = TKGroupAnswersByThematics(submission, survey);
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
          ),
        ],
      });
      if (
        !boundariesList.admin2
          .map((x) => x.pcode)
          .includes(submission[spatialDescription.adm2Pcode])
      ) {
        boundariesList.admin2.push({
          pcode: submission[spatialDescription.adm2Pcode],
          name: submission[spatialDescription.adm2Name],
        });
        if (
          !boundariesList.admin1
            .map((x) => x.pcode)
            .includes(submission[spatialDescription.adm1Pcode])
        ) {
          boundariesList.admin1.push({
            pcode: submission[spatialDescription.adm1Pcode],
            name: submission[spatialDescription.adm1Name],
          });
        }
      }

      submissionsByCamps[submission[spatialDescription.siteIDField]] = {
        [submission[
          spatialDescription.siteLastUpdateField
        ]]: TKGroupAnswersByThematics(submission, survey),
      };
    }
  }
  return {
    submissionsByCamps: submissionsByCamps,
    campsList: campsList,
    boundariesList: boundariesList,
  };
}
