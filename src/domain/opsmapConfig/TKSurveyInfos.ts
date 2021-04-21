import { TKFDFInfos } from "@/domain/fdf/TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Generic approach for suvey configuration: name + FDF
// ////////////////////////////////////////////////////////////////////////////
export class TKSurveyInfos {
  name: string;
  fdf: TKFDFInfos;

  constructor(name: string, fdf: TKFDFInfos){
    this.name = name;
    this.fdf = fdf;
  }
}