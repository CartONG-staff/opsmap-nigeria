// ////////////////////////////////////////////////////////////////////////////
// Description of the spatial configuration
// field name, etc.

// ////////////////////////////////////////////////////////////////////////////
export interface TKFDFSpatialDescription {
  siteLatitudeField: string;
  siteLongitudeField: string;
  siteNameField: string;
  siteIDField: string;
  siteLastUpdateField: string;
  siteTypeField: string;
  adm1Pcode: string; //pcode field in dataset
  adm1Name: string;
  adm2Pcode: string; //pcode field in dataset
  adm2Name: string;
}
