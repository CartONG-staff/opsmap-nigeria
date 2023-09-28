// ////////////////////////////////////////////////////////////////////////////
// Description of the spatial configuration
// field name, etc.

import { TKAdminLevel } from "@/domain/opsmapConfig/TKAdminLevel";

// ////////////////////////////////////////////////////////////////////////////

// TODO: rename this
export interface TKFDFSpatialDescription {
  siteFields: {
    id: string;
    manageBy: string;
    manageByAlt?: string;
    name: string;
    lastUpdate: string;
    latitude?: string;
    longitude?: string;
    type: string;
  };
  admins: Partial<Record<TKAdminLevel, { pcode: string; name: string }>>;
}
