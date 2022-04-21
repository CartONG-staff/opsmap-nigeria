import {
  Module,
  VuexModule,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";

const DEFAULT_HIDE_UNANSWERED = false;
const DEFAULT_SORT_BY_TRAFFICLIGHT = false;
const DEFAULT_FILTER_VALUE = "";

@Module({ dynamic: true, store, name: "TKVisualizerOptionsModule" })
class TKVisualizerOptionsModule extends VuexModule {
  _hideUnanswered = DEFAULT_HIDE_UNANSWERED;
  _sortByTrafficLight = DEFAULT_SORT_BY_TRAFFICLIGHT;
  _searchFilter = DEFAULT_FILTER_VALUE;

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

  @Mutation
  resetSortByTrafficLight() {
    this._sortByTrafficLight = DEFAULT_SORT_BY_TRAFFICLIGHT;
  }

  @Mutation
  setSortByTrafficLight(sort: boolean) {
    this._sortByTrafficLight = sort;
  }

  get sortByTrafficLigh(): boolean {
    return this._sortByTrafficLight;
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
