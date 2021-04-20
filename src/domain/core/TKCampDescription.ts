import { TKCampTypesValues } from "@/domain/core/TKCampTypesValues";

export interface TKCampDescription {
  id: string;
  name: string;
  type: TKCampTypesValues.PLANNED | TKCampTypesValues.SPONTANEOUS;
  submissionsDates: string[];
  lat: number;
  lng: number;
  admin1: {
    pcode: string;
    name: string;
  };
  admin2: {
    pcode: string;
    name: string;
  };
  admin3: {
    pcode: string;
    name: string;
  };
}
