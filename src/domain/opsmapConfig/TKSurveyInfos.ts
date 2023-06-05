import { TKFDFInfos } from "../fdf/TKFDFInfos";
import { TKFDFSpatialDescription } from "../fdf/TKFDFSpatialDescription";
import { TKSurveyOptions } from "../survey/TKSurvey";
import { TKFDFIndicators } from "../fdf/TKFDFIndicators";
import { TKAdditionalFilterDescription } from "../survey/TKAdditionalFilter";

export enum TKSurveyInfosType {
  KOBO = "kobo",
  CSV = "csv",
  GSHEET = "gsheet",
  RIDL = "ridl"
}

// ////////////////////////////////////////////////////////////////////////////
// infos
// ////////////////////////////////////////////////////////////////////////////

export interface TKAbstractSurveyInfos {
  readonly name: string;
  readonly fdf: TKFDFInfos;
  options: TKSurveyOptions;
  additionalFiltersDescription: TKAdditionalFilterDescription[];
  readonly spatial: TKFDFSpatialDescription;
  readonly indicators: TKFDFIndicators;
}

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for KOBO Inputs
// ////////////////////////////////////////////////////////////////////////////
export interface TKSurveyInfosKobo extends TKAbstractSurveyInfos {
  readonly type: TKSurveyInfosType.KOBO;
  readonly url: string;
  readonly token: string;
}

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for CSV Inputs
// ////////////////////////////////////////////////////////////////////////////

export interface TKSurveyInfosCSV extends TKAbstractSurveyInfos {
  readonly type: TKSurveyInfosType.CSV;
  readonly submissionsLocalUrl: string;
  readonly submissionsTrLocalUrl: string;
}

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for CSV Inputs
// ////////////////////////////////////////////////////////////////////////////

export interface TKSurveyInfosGSheet extends TKAbstractSurveyInfos {
  readonly type: TKSurveyInfosType.GSHEET;

  readonly submissionsUrl: string;
  readonly submissionsTrUrl: string;
}

export interface TKSurveyInfosRidl extends TKAbstractSurveyInfos {
  readonly type: TKSurveyInfosType.RIDL;
  readonly url: string;
  readonly submissionsTrLocalUrl: string;
}

// ////////////////////////////////////////////////////////////////////////////
// Alltogether type
// ////////////////////////////////////////////////////////////////////////////

export type TKSurveyInfos =
  | TKSurveyInfosKobo
  | TKSurveyInfosGSheet
  | TKSurveyInfosCSV
  | TKSurveyInfosRidl;
