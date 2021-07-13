// ////////////////////////////////////////////////////////////////////////////
// Camp Types
// ////////////////////////////////////////////////////////////////////////////

export enum TKCampTypesValues {
  PLANNED = "Planned Site",
  SPONTANEOUS = "Informal"
}
// ////////////////////////////////////////////////////////////////////////////
// Camp desription
// ////////////////////////////////////////////////////////////////////////////

import { TKBoundarieDescription } from "@/domain/opsmapConfig/TKBoundarieDescription";
export interface TKCampDescription {
  id: string;
  name: string;
  type: TKCampTypesValues.PLANNED | TKCampTypesValues.SPONTANEOUS;
  lat: number;
  lng: number;
  admin1: TKBoundarieDescription;
  admin2: TKBoundarieDescription;
  admin3: TKBoundarieDescription;
  lastSubmission: string; // Used for popup in the map
}
