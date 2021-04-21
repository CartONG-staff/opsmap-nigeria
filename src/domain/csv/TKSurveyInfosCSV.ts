import { TKSurveyInfos } from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKFDFInfos } from "../fdf/TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for CSV Inputs
// ////////////////////////////////////////////////////////////////////////////

export class TKSurveyInfosCSV extends TKSurveyInfos {
  submissionsFolder: string;
  submissionsFile: string;

  constructor(name: string, fdf: TKFDFInfos, submissionFolder: string, submissionFile: string){
    super(name, fdf);
    this.submissionsFile = submissionFile;
    this.submissionsFolder = submissionFolder;
  }
}