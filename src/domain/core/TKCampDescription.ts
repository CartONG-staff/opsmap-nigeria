import { TKCampTypesValues } from "@/domain/core/TKCampTypesValues";
import { TKBoundarieDescription } from "./TKBoundarieDescription";

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
