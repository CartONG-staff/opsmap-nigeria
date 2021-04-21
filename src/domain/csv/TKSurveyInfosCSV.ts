import { TKSurveyInfos } from "@/domain/core/TKSurveyInfos";
import { TKFDFInfos } from "../fdf/TKFDFInfos";

export class TKSurveyInfosCSV extends TKSurveyInfos {
  submissionsFolder: string;
  submissionsFile: string;

  constructor(name: string, fdf: TKFDFInfos, submissionFolder: string, submissionFile: string){
    super(name, fdf);
    this.submissionsFile = submissionFile;
    this.submissionsFolder = submissionFolder;
  }
}