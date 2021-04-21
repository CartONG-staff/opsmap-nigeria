export enum TKSubmissionItemType {
  STRING = "string",
  INTEGER = "integer",
  LIST = "list",
  DATE = "date",
  CALCUL = "calcul"
}
export interface TKSubmissionRule {
  field_name: string;
  type: TKSubmissionItemType;
  thematic_group: string;
  traffic_light_name: string;
  chart_id: string;
  chart_data: string;
  display_condition: string;
  indicator_operation: string;
}

export interface TKSubmissionsRulesCollection {
  [propName: string]: TKSubmissionRule;
}

export function TKSubmissionsRulesCollectionBuild(
  submissions: TKSubmissionRule[]
): TKSubmissionsRulesCollection {
  const submissionsRules: TKSubmissionsRulesCollection = {};
  submissions.map((item) => {
    submissionsRules[item.field_name] = { ...item };
  });
  return submissionsRules;
}
