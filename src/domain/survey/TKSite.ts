import { TKFDFSiteType } from "../fdf/TKFDFSiteTypes";
import { TKAdminLevel } from "../opsmapConfig/TKAdminLevel";
import { TKLabel } from "../utils/TKLabel";
import { TKBoundaries } from "./TKBoundaries";
import { TKSubmission } from "./TKSubmission";

// ////////////////////////////////////////////////////////////////////////////
// Site Type definition
// ////////////////////////////////////////////////////////////////////////////
export interface TKSiteCoordinates {
  lat: number;
  lng: number;
}

export type TKSiteBoundaries = {
  [key in TKAdminLevel]?: TKBoundaries;
};
export interface TKSite {
  id: string;
  name: string;
  type: TKFDFSiteType; // from fdf
  coordinates: TKSiteCoordinates;
  admins: TKSiteBoundaries;
  managedBy: TKLabel;

  submissions: [TKSubmission, ...TKSubmission[]]; // At least one element!
}
