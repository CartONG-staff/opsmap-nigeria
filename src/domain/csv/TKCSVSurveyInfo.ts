import { TKFDFInfos } from "@/domain/fdf/TKFDF";
export interface TKCSVSurveyInfo {
  name: string;
  fdf: TKFDFInfos;
  submissionsFolder: string;
  submissionsFile: string;
}
