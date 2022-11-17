/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Module,
  VuexModule,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { TKSurveyAnonymousType } from "@/domain/survey/TKSurvey";
import { computeCentroid } from "@/domain/map/TKMapCamps";

@Module({ dynamic: true, store, name: "TKDatasetModule" })
class TKDatasetModule extends VuexModule {
  _dataset: TKDataset = new TKDataset([]);
  _isDatasetInitialized: boolean = false;

  @Mutation
  setDataset(dataset: TKDataset) {
    this._dataset = dataset;
    this._isDatasetInitialized = true;
  }

  @Mutation
  updateCampCoordinates(geoDataset: TKGeoDataset) {
    this._dataset.surveys.forEach(survey => {
      if (survey.options.anonymousMode === TKSurveyAnonymousType.GLOBAL) {
        for (let i = 0; i < survey.camps.length; i++) {
          const camp = survey.camps[i];
          const centroid = computeCentroid(camp, geoDataset);
          if (centroid) {
            survey.camps[i].coordinates = centroid;
          }
        }
      }
    });
  }

  get dataset() {
    return this._dataset;
  }
  get isDatasetInitialized() {
    return this._isDatasetInitialized;
  }
}

export default getModule(TKDatasetModule);
