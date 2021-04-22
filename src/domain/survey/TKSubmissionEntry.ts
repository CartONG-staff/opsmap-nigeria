import { TKLabel } from "../ui/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// Entry abstract concept definition
// ////////////////////////////////////////////////////////////////////////////

export class TKSubmissionEntry {
  field = "";
  fieldLabel: TKLabel;

  constructor(field: string, fieldLabel: TKLabel) {
    this.field = field;
    this.fieldLabel = fieldLabel;
  }

  public isAnswered(): boolean {
    return true;
  }
}
