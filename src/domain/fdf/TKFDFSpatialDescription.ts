// ////////////////////////////////////////////////////////////////////////////
// Description of the spatial configuration
// field name, etc.

import { TKAdminLevel } from "../opsmapConfig/TKAdminLevel";

// ////////////////////////////////////////////////////////////////////////////

// TODO: rename this
export interface TKFDFSpatialDescription {
  siteIDField: string;
  siteManageByField: string;
  siteManageByAltValue?: string;
  siteNameField: string;
  siteLastUpdateField: string;
  siteLatitudeField?: string;
  siteLongitudeField?: string;
  siteTypeField: string;
  admins: Partial<Record<TKAdminLevel, { pcode: string; name: string }>>;
}
