// ////////////////////////////////////////////////////////////////////////////
// Definition of the FDF object
// this is a description of the submission data structure
// It is needed to create an actual survey

import { TKFDFIndicators } from "./TKFDFIndicators";
import { TKFDFLabelCollection } from "./TKFDFParseMultiLang";
import { TKFDFSpatialDescription } from "./TKFDFSpatialDescription";
import { TKFDFSubmissionsRulesCollection } from "./TKFDFSubmissionsRules";
import { TKFDFSiteTypeCollection } from "./TKFDFSiteTypes";
import { TKFDFTerminologyCollection } from "./TKFDFTerminology";
import { TKTFDFhematicsCollection } from "./TKFDFThematics";

import { TKFDFUrlsCollection } from "./TKFDFURLs";
import { TKFDFTrafficLightsConfiguration } from "./TKFDFTrafficLights/TKFDFTrafficLightsConfiguration";

// ////////////////////////////////////////////////////////////////////////////
export interface TKFDF {
  name: string;
  terminology: TKFDFTerminologyCollection;
  thematics: TKTFDFhematicsCollection;
  trafficLights: TKFDFTrafficLightsConfiguration;
  fieldsLabels: TKFDFLabelCollection;
  answersLabels: TKFDFLabelCollection;
  submissionsRules: TKFDFSubmissionsRulesCollection;
  urls: TKFDFUrlsCollection;
  indicators: TKFDFIndicators;
  spatial: TKFDFSpatialDescription;
  siteTypes: TKFDFSiteTypeCollection;
}
