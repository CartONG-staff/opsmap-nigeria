import { TKFDFInfos } from "@/domain/fdf/TKFDFInfos";
export interface TKKoboSurveyInfo {
  name: string;
  fdf: TKFDFInfos;
  url: string;
  token: string;
}