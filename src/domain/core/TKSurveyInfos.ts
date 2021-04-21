import { TKFDFInfos } from "@/domain/fdf/TKFDFInfos";

export class TKSurveyInfos {
  name: string;
  fdf: TKFDFInfos;

  constructor(name: string, fdf: TKFDFInfos){
    this.name = name;
    this.fdf = fdf;
  }
}