<template lang="html">
  <div class="tk-camp-selector">
    <v-select
      class="tk-autocomplete"
      flat
      dense
      readonly
      :key="dataset.currentSurvey"
      :placeholder="$t('selectText') + ' ' + $t('survey').toLowerCase()"
      v-model="dataset.currentSurvey"
      :items="dataset.surveyList"
      @change="surveySelected"
      single-line
    ></v-select>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :key="dataset.currentAdmin1"
      :placeholder="$t('selectText') + ' ' + $t('infosAdmin1').toLowerCase()"
      v-model="dataset.currentAdmin1"
      :items="dataset.filteredAdmin1List"
      item-text="name"
      item-value="pcode"
      @change="admin1Selected"
      clearable
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :key="dataset.currentAdmin2"
      :placeholder="$t('selectText') + ' ' + $t('infosAdmin2').toLowerCase()"
      v-model="dataset.currentAdmin2"
      :items="dataset.filteredAdmin2List"
      item-text="name"
      item-value="pcode"
      @change="admin2Selected"
      clearable
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      clearable
      :key="dataset.currentCamp"
      :placeholder="$t('selectText') + ' ' + $t('camp').toLowerCase()"
      v-model="dataset.currentCamp"
      :items="dataset.filteredCampsList"
      item-text="name"
      item-value="id"
      @change="campSelected"
    ></v-autocomplete>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { TKDatasetFilterer, TKFilters } from "@/domain/survey/TKFilters";

@Component
export default class TKCampSelector extends Vue {
  @Prop({ default: () => [] })
  dataset!: TKDatasetFilterer;

  surveySelected(year: string) {
    this.dataset.setFiltersValue(TKFilters.SURVEY, year ? year : null);
  }
  admin1Selected(pcode: string) {
    this.dataset.setFiltersValue(TKFilters.ADMIN1, pcode ? pcode : null);
  }
  admin2Selected(pcode: string) {
    this.dataset.setFiltersValue(TKFilters.ADMIN2, pcode ? pcode : null);
  }
  campSelected(campId: string) {
    this.dataset.setFiltersValue(TKFilters.CAMP, campId ? campId : null);
  }
}
</script>

<style scoped>
.tk-camp-selector {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  border-radius: 8px;
  height: 100%;
  align-items: center;
  background-color: #f0fbffcc;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 3000;
  box-shadow: 0 0 20px 2px rgba(58, 158, 211, 0.15);
}

.tk-autocomplete {
  margin: 0 15px;
  height: 30px;
  width: 20%;
}
</style>
