import {
  Module,
  VuexModule,
  getModule,
  Mutation
} from "vuex-module-decorators";
import store from "@/store";

const DEFAULT_HIDE_UNANSWERED = false;

@Module({ dynamic: true, store, name: "TKVisualizerOptionsModule" })
class TKVisualizerOptionsModule extends VuexModule {
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
}

export default getModule(TKVisualizerOptionsModule);
