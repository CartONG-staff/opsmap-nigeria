import { TKLabel } from "@/domain/utils/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////
export interface TKFDFThematic {
  id: string;
  iconFileName: string;
  thematicLabel: TKLabel;
}

export type TKTFDFhematicsCollection = Record<string, TKFDFThematic>;
