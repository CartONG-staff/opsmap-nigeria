export interface TKSubmissionRule {
  field_name: string;
  type: "string" | "integer" | "list" | "date" | "calcul";
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

export function TKSubmissionsRulesCollectionBuilder(
  submissions: TKSubmissionRule[]
): TKSubmissionsRulesCollection {
  const submissionsRules: TKSubmissionsRulesCollection = {};
  submissions.map((item) => {
    if (item.field_name?.length > 0) {
      submissionsRules[item.field_name] = { ...item };
    }
  });
  return submissionsRules;
}
