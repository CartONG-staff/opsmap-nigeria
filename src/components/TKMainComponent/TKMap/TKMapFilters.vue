<template lang="html">
  <div class="tk-map-filters">
    <div class="tk-map-filters-item" id="myDiv">
      <div class="tk-map-filter">
        <img class="tk-indicator-icon" :src="plannedImgUrl" />
        <div class="tk-map-filter-text">{{ $t("map.legendPlanned") }}</div>
        <v-checkbox
          v-model="checkboxs.planned"
          class="tk-map-filter-checkbox"
          @change="checkboxChange('planned')"
          hide-details
        ></v-checkbox>
      </div>
      <div class="tk-map-filter">
        <img class="tk-indicator-icon" :src="spontaneousImgUrl" />
        <div class="tk-map-filter-text">{{ $t("map.legendSpontaneous") }}</div>
        <v-checkbox
          v-model="checkboxs.spontaneous"
          @change="checkboxChange('spontaneous')"
          class="tk-map-filter-checkbox"
          hide-details
        ></v-checkbox>
      </div>
    </div>
    <div class="tk-vseparator" />
    <v-btn icon color="primary" @click="toggleChanged">
      <v-icon>mdi-map-legend</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import {
  TKDatasetFilterer,
  TKFilters,
  TKFiltersTypes
} from "@/domain/core/TKFilters";

@Component
export default class TKMapFilter extends Vue {
  @Prop()
  dataset!: TKDatasetFilterer;
  plannedImgUrl = TKIconUrl("planned_site");
  spontaneousImgUrl = TKIconUrl("spontaneous_site");
  checkboxs = {
    planned: true,
    spontaneous: true
  };

  toggleChanged(): void {
    const x = document.getElementById("myDiv");
    if (x) {
      x.classList.toggle("transform-active");
    }
  }

  checkboxChange(checkbox: string): void {
    checkbox === "planned"
      ? this.dataset.setFiltersValue(
          TKFilters.PLANNED_SITE,
          this.checkboxs.planned
        )
      : this.dataset.setFiltersValue(
          TKFilters.SPONTANEOUS_SITE,
          this.checkboxs.spontaneous
        );
  }
}
</script>
<style scoped>
.tk-map-filters {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #00000011;
  background-color: #fff;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  row-gap: 10px;
  height: 75px;
}

.tk-map-filters-item {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: left;
  row-gap: 10px;
  flex-grow: 1;
  max-width: 300px;
  transition: all 0.5s ease;
  overflow: hidden;
}

.transform-active {
  max-width: 0px;
}

.tk-map-filter {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  column-gap: 10px;
}

.tk-map-filter-text {
  flex-grow: 1;
  font-size: 13px;
}

.tk-map-filter-checkbox {
  padding: 0px;
  margin: auto;
}

.tk-indicator-icon {
  display: block;
  width: 20px;
  height: 20px;
  margin-left: 5px;
}

.tk-vseparator {
  background-color: #00000011;
  width: 1px;
  height: 100%;
  margin-left: -1px;
}
</style>
