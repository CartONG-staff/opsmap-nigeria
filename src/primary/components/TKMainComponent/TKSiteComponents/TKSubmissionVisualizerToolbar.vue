<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-submissionvisualizer-toolbar">
      <v-text-field
        class="search-field"
        :label="$t('site.filter')"
        solo
        dense
        flat
        single-line
        hide-details
        clearable
        v-model="search"
        @keydown.enter="setSearchImmediate"
        prepend-inner-icon="mdi-chart-timeline-variant"
        height="44"
      ></v-text-field>
      <v-btn-toggle
        class="tk-submissionvisualizer-toggle"
        color="selectedButton"
        v-model="hideUnanswered"
      >
        <v-btn class="toggle-button" plain>
          <v-icon left>mdi-draw-pen</v-icon
          >{{ $t("site.hideUnanswered") }}</v-btn
        >
      </v-btn-toggle>
      <v-btn-toggle
        class="tk-submissionvisualizer-toggle"
        color="selectedButton"
        v-model="sortByTrafficLight"
      >
        <v-btn class="toggle-button" plain>
          <v-icon left>mdi-traffic-light-outline</v-icon
          >{{ $t("site.sortByTrafficLight") }}
        </v-btn>
      </v-btn-toggle>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";
@Component({
  components: {}
})
export default class TKSubmissionVisualizerToolbar extends Vue {
  // search
  timeOutID = 0;
  _search = "";

  get search(): string {
    return TKVisualizerOptionsModule.searchFilter;
  }

  set search(search: string) {
    this._search = search;
    window.clearTimeout(this.timeOutID);
    if (search) {
      // text is typed
      this.timeOutID = window.setTimeout(() => {
        this.triggerSearch();
      }, 1000);
    } else {
      // test is cleared
      this.triggerSearch();
    }
  }

  setSearchImmediate() {
    window.clearTimeout(this.timeOutID);
    this.triggerSearch();
  }

  triggerSearch() {
    TKVisualizerOptionsModule.setSearchFilter(this._search);
  }

  get sortByTrafficLight(): number | undefined {
    return TKVisualizerOptionsModule.sortByTrafficLight ? 0 : undefined;
  }

  set sortByTrafficLight(value: number | undefined) {
    TKVisualizerOptionsModule.setSortByTrafficLight(value !== undefined);
  }

  get hideUnanswered(): number | undefined {
    return TKVisualizerOptionsModule.hideUnanswered ? 0 : undefined;
  }

  set hideUnanswered(value: number | undefined) {
    TKVisualizerOptionsModule.setHideUnanswered(value !== undefined);
  }
}
</script>
<style scoped>
.search-field {
  border-radius: 8px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  border: 1px solid rgba(44, 44, 44, 0.2);
  width: 100%;
  background-color: var(--v-thematicBackground-base);
  overflow: hidden;
}
.tk-submissionvisualizer-toolbar {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  align-items: center;
  column-gap: 20px;
}

.tk-submissionvisualizer-toggle .v-btn {
  border: none !important;
  background-color: var(--v-appBackground-base) !important;
}
</style>
