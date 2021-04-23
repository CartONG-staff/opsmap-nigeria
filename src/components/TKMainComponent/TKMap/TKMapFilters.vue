<template lang="html">
  <div class="tk-map-filters">
    <div class="tk-map-filters-item" id="myDiv">
      <div class="tk-map-filter">
        <img class="tk-indicator-icon" :src="plannedImgUrl" />

        <transition mode="out-in" name="fade-in">
          <div :key="$root.$i18n.locale" class="tk-map-filter-text">
            {{ $t("map.legendPlanned") }}
          </div>
        </transition>
        <transition mode="out-in" name="fade-in">
          <div :key="countCampPlanned" class="tk-map-filter-value">
            {{ countCampPlanned }}
          </div>
        </transition>
        <v-checkbox
          v-model="checkboxs.planned"
          class="tk-map-filter-checkbox"
          @change="checkboxChange('planned')"
          hide-details
        ></v-checkbox>
      </div>
      <div class="tk-map-filter">
        <img class="tk-indicator-icon" :src="spontaneousImgUrl" />
        <transition mode="out-in" name="fade-in">
          <div :key="$root.$i18n.locale" class="tk-map-filter-text">
            {{ $t("map.legendSpontaneous") }}
          </div>
        </transition>
        <transition mode="out-in" name="fade-in">
          <div :key="countCampSpontaneous" class="tk-map-filter-value">
            {{ countCampSpontaneous }}
          </div>
        </transition>
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TKDatasetFilterer, TKFilters } from "@/domain/survey/TKFilters";
import { TKCampTypesValues } from "@/domain/survey/TKCampTypesValues";

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
  countCampPlanned = 0;
  countCampSpontaneous = 0;

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

  @Watch("dataset.filteredCampsList", { immediate: true })
  datasetChanged() {
    this.countCampPlanned = this.dataset.filteredCampsList.filter(
      camp => camp.type === TKCampTypesValues.PLANNED
    ).length;

    this.countCampSpontaneous = this.dataset.filteredCampsList.filter(
      camp => camp.type === TKCampTypesValues.SPONTANEOUS
    ).length;
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
