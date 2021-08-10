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
  COMPUTED = "computed"
}
interface TKFDFSubmissionRuleRaw {
  field_name: string;
  type: TKFDFSubmissionItemType;
  thematic_group: string;
  traffic_light_name: string;
  chart_id: string;
  chart_data: string;
  display_condition: string;
  computed_rule: string;
}

export interface TKFDFSubmissionRule {
  fieldName: string;
  type: TKFDFSubmissionItemType;
  thematicGroup: string;
  trafficLightName: string;
  chartId: string;
  chartData: string;
  displayCondition?: {
    field: string;
    operator: string;
    value: string;
  };
  computed?: {
    field1: string;
    operator: string;
    field2: string;
  };
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
    // Parse computed rule and condition
    let displayCondition = undefined;
    const condition = item.display_condition.split("#");
    if (condition.length === 3) {
      displayCondition = {
        field: condition[0],
        operator: condition[1],
        value: condition[2]
      };
    }

    let computedRule = undefined;
    if (item.type === TKFDFSubmissionItemType.COMPUTED) {
      const rule = item.computed_rule.split("#");
      if (rule.length === 3) {
        computedRule = {
          field1: rule[0],
          operator: rule[1],
          field2: rule[2]
        };
      }
    }

    submissionsRules[item.field_name] = {
      fieldName: item.field_name,
      type: item.type,
      thematicGroup: item.thematic_group,
      trafficLightName: item.traffic_light_name,
      chartId: item.chart_id,
      chartData: item.chart_data,
      displayCondition: displayCondition,
      computed: computedRule
    };
  });
  return submissionsRules;
}
