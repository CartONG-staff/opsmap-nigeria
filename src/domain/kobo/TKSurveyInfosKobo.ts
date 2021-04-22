import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKFDFInfos } from "../fdf/TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for KOBO Inputs
// ////////////////////////////////////////////////////////////////////////////
export class TKSurveyInfosKobo extends TKSurveyInfos {
  url: string;
  token: string;

  constructor(name: string, fdf: TKFDFInfos, url: string, token: string) {
    super(name, fdf);
    this.url = url;
    this.token = token;
  }
}