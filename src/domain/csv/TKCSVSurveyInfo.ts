import { TKFDFInfos } from "@/domain/fdf/TKFDFInfos";
export interface TKCSVSurveyInfo {
  name: string;
  fdf: TKFDFInfos;
  submissionsFolder: string;
  submissionsFile: string;
}
