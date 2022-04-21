<template>
  <div class="tk-submissionvisualizer-toolbar">
    <TKSearchfield :label="$t('site.filter')" v-model="search"> </TKSearchfield>
    <v-btn-toggle class="tk-submissionvisualizer-toggle">
      <v-btn
        class="toggle-button"
        v-model="hideUnanswered"
        color="#919191"
        plain
      >
        <v-icon left>mdi-file-sign</v-icon>Only answered entries</v-btn
      >
    </v-btn-toggle>
    <v-btn-toggle class="tk-submissionvisualizer-toggle">
      <v-btn
        class="toggle-button"
        v-model="sortByTrafficLight"
        color="#919191"
        plain
      >
        <v-icon left>mdi-traffic-light-outline</v-icon>Sort by traffic
        lights</v-btn
      >
    </v-btn-toggle>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TKSearchfield from "@/primary/TKSearchField.vue";
import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";
@Component({
  components: { TKSearchfield }
})
export default class TKSubmissionVisualizerToolbar extends Vue {
  get search(): string {
    return TKVisualizerOptionsModule.searchFilter;
  }
  set search(search: string) {
    TKVisualizerOptionsModule.setSearchFilter(search);
  }

  get hideUnanswered() {
    return TKVisualizerOptionsModule.hideUnanswered;
  }

  set hideUnanswered(value: boolean) {
    TKVisualizerOptionsModule.setHideUnanswered(value);
  }

  get sortByTrafficLight() {
    return TKVisualizerOptionsModule.sortByTrafficLigh;
  }

  set sortByTrafficLight(value: boolean) {
    TKVisualizerOptionsModule.setSortByTrafficLight(value);
  }
}
</script>

<style>
.tk-submissionvisualizer-toggle .v-btn--active > .v-btn__content {
  color: var(--v-accent-base) !important;
}
</style>

<style scoped>
.tk-submissionvisualizer-toolbar {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  align-items: center;
  column-gap: 20px;
}

.toggle-button {
  border: none !important;
}
</style>
