import { TKCampTypesValues } from "@/domain/survey/TKCampTypesValues";
import { TKBoundarieDescription } from "@/domain/opsmapConfig/TKBoundarieDescription";

// ////////////////////////////////////////////////////////////////////////////
// Camp desription
// ////////////////////////////////////////////////////////////////////////////
export interface TKCampDescription {
  id: string;
  name: string;
  type: TKCampTypesValues.PLANNED | TKCampTypesValues.SPONTANEOUS;
  submissionsDates: string[];
  lat: number;
  lng: number;
  admin1: TKBoundarieDescription;
  admin2: TKBoundarieDescription;
  admin3: TKBoundarieDescription;
}
