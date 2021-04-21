import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKFDFInfos } from "./TKFDF";

export enum TKFDFSubmissionItemType {
  STRING = "string",
  INTEGER = "integer",
  LIST = "list",
  DATE = "date",
  CALCUL = "calcul"
}

export interface TKFDFSubmissionRule {
  field_name: string;
  type: TKFDFSubmissionItemType;
  thematic_group: string;
  traffic_light_name: string;
  chart_id: string;
  chart_data: string;
  display_condition: string;
  indicator_operation: string;
}

export interface TKFDFSubmissionsRulesCollection {
  [propName: string]: TKFDFSubmissionRule;
}

// ////////////////////////////////////////////////////////////////////////////
// Submission rules
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadSubmissionsRulesCollection(infos: TKFDFInfos): Promise<TKFDFSubmissionsRulesCollection> {
  const rawSubmissionsRules: TKFDFSubmissionRule[] = await TKCSVRead<TKFDFSubmissionRule[]>("submissions_rules", infos.folder, true);
  const submissionsRules: TKFDFSubmissionsRulesCollection = {};
  rawSubmissionsRules.map((item) => {
    submissionsRules[item.field_name] = { ...item };
  });
  return submissionsRules;
}
