import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKFDFFiles, TKFDFInfos } from "./TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Submission rules datatype
// ////////////////////////////////////////////////////////////////////////////

export enum TKFDFSubmissionItemType {
  STRING = "string",
  INTEGER = "integer",
  LIST = "list",
  DATE = "date",
  CALCUL = "calcul"
}
interface TKFDFSubmissionRuleRaw {
  field_name: string;
  type: TKFDFSubmissionItemType;
  thematic_group: string;
  traffic_light_name: string;
  chart_id: string;
  chart_data: string;
  display_condition: string;
  indicator_operation: string;
}

export interface TKFDFSubmissionRule {
  fieldName: string;
  type: TKFDFSubmissionItemType;
  thematicGroup: string;
  trafficLightName: string;
  chartId: string;
  chartData: string;
  displayCondition: string;
  indicatorOperation: string;
}

export interface TKFDFSubmissionsRulesCollection {
  [propName: string]: TKFDFSubmissionRule;
}

// ////////////////////////////////////////////////////////////////////////////
// Submission rules collection reading
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadSubmissionsRulesCollection(
  infos: TKFDFInfos
): Promise<TKFDFSubmissionsRulesCollection> {
  const rawSubmissionsRules: TKFDFSubmissionRuleRaw[] = await TKCSVRead<
  TKFDFSubmissionRuleRaw[]
  >(TKFDFFiles.SUBMISSION_RULES, infos.folder, true);
  const submissionsRules: TKFDFSubmissionsRulesCollection = {};
  rawSubmissionsRules.map(item => {
    submissionsRules[item.field_name] = {
      fieldName: item.field_name,
      type: item.type,
      thematicGroup: item.thematic_group,
      trafficLightName: item.traffic_light_name,
      chartId: item.chart_id,
      chartData: item.chart_data,
      displayCondition: item.display_condition,
      indicatorOperation: item.indicator_operation
    };
  });
  return submissionsRules;
}
