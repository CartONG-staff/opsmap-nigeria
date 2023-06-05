import { TKFDFSpatialDescription } from "../fdf/TKFDFSpatialDescription";
import { TKSurveyOptions } from "../survey/TKSurvey";
import { TKFDFIndicators } from "../fdf/TKFDFIndicators";
import { TKAdditionalFilterDescription } from "../survey/TKAdditionalFilter";
import { TKFDFInfos } from "../fdf/TKFDFInfos";

export enum TKSurveyInfosType {
  CSV = "csv",
  GSHEET = "gsheet",
  KOBO = "kobo",
  RIDL = "ridl"
}

// ////////////////////////////////////////////////////////////////////////////
// infos
// ////////////////////////////////////////////////////////////////////////////

export interface TKAbstractSurveyInfos {
  readonly name: string;
  fdf: TKFDFInfos;
  options: TKSurveyOptions;
  additionalFiltersDescription: TKAdditionalFilterDescription[];
  readonly spatial: TKFDFSpatialDescription;
  readonly indicators: TKFDFIndicators;
}

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for CSV inputs
// ////////////////////////////////////////////////////////////////////////////

export interface TKSurveyInfosCSV extends TKAbstractSurveyInfos {
  readonly type: TKSurveyInfosType.CSV;
  readonly submissionsLocalUrl: string;
  readonly submissionsTrLocalUrl: string;
}

// ////////////////////////////////////////////////////////////////////////////
// Specialization of TKSurveyInfo for gsheet inputs
// ////////////////////////////////////////////////////////////////////////////

export interface TKSurveyInfosGSheet extends TKAbstractSurveyInfos {
  readonly type: TKSurveyInfosType.GSHEET;
  readonly submissionsUrl: string;
  readonly submissionsTrUrl: string;
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
// Specialization of TKSurveyInfo for ridl inputs
// ////////////////////////////////////////////////////////////////////////////
export interface TKSurveyInfosRidl extends TKAbstractSurveyInfos {
  readonly type: TKSurveyInfosType.RIDL;
  readonly url: string;
  readonly submissionsTrLocalUrl: string;
}

// ////////////////////////////////////////////////////////////////////////////
// Alltogether type
// ////////////////////////////////////////////////////////////////////////////

export type TKSurveyInfos =
  | TKSurveyInfosCSV
  | TKSurveyInfosGSheet
  | TKSurveyInfosKobo
  | TKSurveyInfosRidl;
