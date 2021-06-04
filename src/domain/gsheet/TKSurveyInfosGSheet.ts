import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKFDFInfos } from "../fdf/TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for CSV Inputs
// ////////////////////////////////////////////////////////////////////////////

export class TKSurveyInfosGSheet extends TKSurveyInfos {
  submissionsUrl: string;
  submissionsTrUrl: string;

  constructor(
    name: string,
    fdf: TKFDFInfos,
    submissionsUrl: string,
    submissionsTrUrl: string
  ) {
    super(name, fdf);
    this.submissionsUrl = submissionsUrl;
    this.submissionsTrUrl = submissionsTrUrl;
  }
}
