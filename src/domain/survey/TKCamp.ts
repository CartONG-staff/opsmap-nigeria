import { TKFDFSiteType } from "../fdf/TKFDFSiteTypes";
import { TKLabel } from "../utils/TKLabel";
import { TKBoundaries } from "./TKBoundaries";
import { TKSubmission } from "./TKSubmission";

// ////////////////////////////////////////////////////////////////////////////
// Camp Type definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKCampCoordinates {
  lat: number;
  lng: number;
}
export interface TKCamp {
  id: string;
  name: string;
  type: TKFDFSiteType; // from fdf
  coordinates: TKCampCoordinates;
  admin1: TKBoundaries;
  admin2: TKBoundaries;
  managedBy: TKLabel;

  submissions: [TKSubmission, ...TKSubmission[]]; // At least one element!
}
