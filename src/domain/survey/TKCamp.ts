import { TKLabel } from "../utils/TKLabel";
import { TKBoundaries } from "./TKBoundaries";
import { TKSubmission } from "./TKSubmission";

// ////////////////////////////////////////////////////////////////////////////
// Camp Types
// ////////////////////////////////////////////////////////////////////////////

export enum TKCampType {
  PLANNED = "site_planned",
  SPONTANEOUS = "site_spontaneous"
}

// ////////////////////////////////////////////////////////////////////////////
// Camp Type definition
// ////////////////////////////////////////////////////////////////////////////

export interface TKCamp {
  id: string;
  name: string;
  type: TKCampType;
  lat: number;
  lng: number;
  admin1: TKBoundaries;
  admin2: TKBoundaries;
  admin3: TKBoundaries;
  managedBy: TKLabel;

  submissions: [TKSubmission, ...TKSubmission[]]; // At least one element!
}
