import { TKCSVSurveyInfo } from "../csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "../kobo/TKKoboSurveyInfo";
import { TKSurveyConfigurationBuild } from "./raw_data/TKSurveyConfigurationBuilder";
import { TKCSVSubmissionsGet } from "@/domain/data/csv/TKCSVSubmissionsGetter";
import { TKKoboSubmissionsGet } from "../kobo/TKKoboSubmissionsGetter";
import { TKSpatialDescription } from "@/domain/config/TKSpatialDescription";
import { TKGroupSubmissionsByCamp } from "./merged_dataset/TKSubmissionsByCampsGrouper";
import {
  CampDescription,
  BoundariesCollection,
} from "./merged_dataset/TKSubmissionsByCampsGrouper";

export interface Dataset {
  submissionsByCamps: object;
  campsList: CampDescription[];
  boundariesList: BoundariesCollection;
}

interface DatasetCollection {
  [fdf: string]: Dataset;
}

export async function TKDatasetBuild(
  surveyDescription: TKKoboSurveyInfo[] | TKCSVSurveyInfo[],
  surveyFormat: "csv" | "kobo",
  spatialDescription: TKSpatialDescription
): DatasetCollection {
  const datasetCollection: DatasetCollection = {};
  for (const item of surveyDescription) {
    let rawData;
    if (surveyFormat === "csv") {
      rawData = await TKCSVSubmissionsGet(item as TKCSVSurveyInfo);
    } else {
      rawData = await TKKoboSubmissionsGet(item as TKKoboSurveyInfo);
    }
    const surveyConfig = await TKSurveyConfigurationBuild(item);
    datasetCollection[item.name] = TKGroupSubmissionsByCamp(
      rawData,
      surveyConfig,
      spatialDescription
    );
  }
  return datasetCollection;
}
