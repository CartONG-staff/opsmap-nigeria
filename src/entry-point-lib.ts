/**
 * This the entry point of the project. Only what's exported here is acccessible though the lib
 * @module
 * @internal
 */

import TKFooter from "./components/TKFooter/TKFooter.vue";
import TKHeader from "./components/TKHeader.vue";
import TKCampSelector from "./components/TKDashBoard/TKCampSelector";
import TKSurveyVisualizer from "./components/TKDashBoard/TKSurveyVisualizer";

export { TKFooter };
export { TKHeader };
export { TKCampSelector };
export { TKSurveyVisualizer };

export default { TKFooter, TKHeader, TKCampSelector, TKSurveyVisualizer };
