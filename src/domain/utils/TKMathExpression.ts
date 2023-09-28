import { evaluate } from "mathjs";
import { TKSubmissionRawEntries } from "../survey/TKSubmissionEntry";

export type TKMathExpressionScope = Record<string, number>;

const DEFAULT_SCOPE_VARIABLE = "x";

export function TKMathExpressionBuildDefaultScope(
  value: number
): TKMathExpressionScope {
  return { [DEFAULT_SCOPE_VARIABLE]: value };
}
export function TKMathExpressionBuildScope(
  scopeDescription: Record<string, string>,
  rawEntries: TKSubmissionRawEntries
): TKMathExpressionScope {
  const scope: TKMathExpressionScope = {};
  for (const scopeVariableName in scopeDescription) {
    const scopeVariableKey = scopeDescription[scopeVariableName];
    if (scopeVariableKey in rawEntries) {
      scope[scopeVariableName] = parseFloat(rawEntries[scopeVariableKey]);
    }
  }
  return scope;
}

export function TKMathExpressionEvaluate(
  expression: string,
  scope: TKMathExpressionScope
) {
  return evaluate(expression, scope);
}
