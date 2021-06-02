import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKFDFInfos } from "../fdf/TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for CSV Inputs
// ////////////////////////////////////////////////////////////////////////////

export class TKSurveyInfosGSheet extends TKSurveyInfos {
  submissionsUrl: string;

  constructor(name: string, fdf: TKFDFInfos, submissionsUrl: string) {
    super(name, fdf);
    this.submissionsUrl = submissionsUrl;
  }
}
