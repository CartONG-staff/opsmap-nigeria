import {
  Module,
  VuexModule,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";

const DEFAULT_HIDE_UNANSWERED = true;
const DEFAULT_SORT_BY_TRAFFICLIGHT = false;
const DEFAULT_FILTER_VALUE = "";
const DEFAULT_SHOW_VISUALIZER_OPTIONS = false;

@Module({ dynamic: true, store, name: "TKVisualizerOptionsModule" })
class TKVisualizerOptionsModule extends VuexModule {
  // //////////////////////////////////////////////////////////////////////////
  // Show options
  // //////////////////////////////////////////////////////////////////////////
  _showVisualizerOptions = DEFAULT_SHOW_VISUALIZER_OPTIONS;

  @Mutation
  setShowVisualizerOptions(show: boolean) {
    this._showVisualizerOptions = show;
  }

  get showVisualizerOptions(): boolean {
    return this._showVisualizerOptions;
  }

  // //////////////////////////////////////////////////////////////////////////
  // Hide Unanswered
  // //////////////////////////////////////////////////////////////////////////
  _hideUnanswered = DEFAULT_HIDE_UNANSWERED;

  @Mutation
  resetHideUnanswered() {
    this._hideUnanswered = DEFAULT_HIDE_UNANSWERED;
  }

  @Mutation
  setHideUnanswered(hide: boolean) {
    this._hideUnanswered = hide;
  }

  get hideUnanswered(): boolean {
    return this._hideUnanswered;
  }

  // //////////////////////////////////////////////////////////////////////////
  // Sort by Traffic Light
  // //////////////////////////////////////////////////////////////////////////
  _sortByTrafficLight = DEFAULT_SORT_BY_TRAFFICLIGHT;

  @Mutation
  resetSortByTrafficLight() {
    this._sortByTrafficLight = DEFAULT_SORT_BY_TRAFFICLIGHT;
  }

  @Mutation
  setSortByTrafficLight(sort: boolean) {
    this._sortByTrafficLight = sort;
  }

  get sortByTrafficLight(): boolean {
    return this._sortByTrafficLight;
  }

  // //////////////////////////////////////////////////////////////////////////
  // Search Filter
  // //////////////////////////////////////////////////////////////////////////
  _searchFilter = DEFAULT_FILTER_VALUE;
  @Mutation
  resetSearchFilter() {
    this._searchFilter = DEFAULT_FILTER_VALUE;
  }

  @Mutation
  setSearchFilter(searchFilter: string) {
    this._searchFilter = searchFilter;
  }

  get searchFilter(): string {
    return this._searchFilter;
  }
}

export default getModule(TKVisualizerOptionsModule);
