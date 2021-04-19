<template lang="html">
  <div class="tk-map-filters">
    <div class="tk-map-filter">
      <v-checkbox
        v-model="checkboxs.planned"
        class="tk-map-filter-checkbox"
        @change="checkboxChange('planned')"
        hide-details
      ></v-checkbox>
      <img class="tk-indicator-icon" :src="plannedImgUrl" />
      <div classs="tk-map-filter-text">Planned site</div>
    </div>
    <div class="tk-map-filter">
      <v-checkbox
        v-model="checkboxs.spontaneous"
        @change="checkboxChange('spontaneous')"
        class="tk-map-filter-checkbox"
        hide-details
      ></v-checkbox>
      <img class="tk-indicator-icon" :src="spontaneousImgUrl" />
      <div class="tk-map-filter-text">Spontaneous site</div>
    </div>
  </div>
</template>

<script lang="ts">
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import {
  TKDatasetFilterer,
  TKFilters,
  TKFiltersTypes,
} from "@/domain/core/TKFilters";

@Component
export default class TKMapFilter extends Vue {
  @Prop()
  dataset!: TKDatasetFilterer;
  plannedImgUrl = TKIconUrl("planned_site");
  spontaneousImgUrl = TKIconUrl("spontaneous_site");
  checkboxs = {
    planned: true,
    spontaneous: true,
  };

  // @Emit("camps-filters-changed")
  // campsFiltersChanged(filter: string, value: TKFiltersTypes) {
  //   console.log("Change on filter component: " + filter);
  // }

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
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: left;
  padding: 5px;
  row-gap: 10px;
  background-color: #fff;
}
.tk-map-filter {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  column-gap: 10px;
}

.tk-map-filter-checkbox {
  padding: 0px;
  margin: 0px;
  width: 20px;
  height: 20px;
}

.tk-indicator-icon {
  display: block;
  width: 20px;
  height: 20px;
}

.tk-icon-container {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tk-hseparator {
  height: 1px;
  width: 100%;
  background-color: #dddddd;
}
</style>
