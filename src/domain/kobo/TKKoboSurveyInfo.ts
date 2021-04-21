import { TKFDFInfos } from "@/domain/fdf/TKFDF";

export interface TKKoboSurveyInfo {
  name: string;
  fdf: TKFDFInfos;
  url: string;
  token: string;
}