<template lang="html">
  <div class="tk-camp-selector">
    <v-select
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('selectText') + ' ' + $t('survey').toLowerCase()"
      v-model="currentSurvey"
      :items="dataset.surveyList"
      @change="surveySelected"
      single-line
    ></v-select>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('selectText') + ' ' + $t('infosAdmin1').toLowerCase()"
      :items="dataset.admin1List"
      v-model="currentAdmin1"
      item-text="name"
      item-value="pcode"
      @change="admin1Selected"
      clearable
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('selectText') + ' ' + $t('infosAdmin2').toLowerCase()"
      v-model="currentAdmin2"
      :items="dataset.admin2List"
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
      :placeholder="$t('selectText') + ' ' + $t('camp').toLowerCase()"
      v-model="currentCamp"
      :items="dataset.filteredCampsList"
      item-text="name"
      item-value="id"
      @change="campSelected"
    ></v-autocomplete>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TKDatasetFilterer, TKFilters } from "@/domain/survey/TKFilters";

@Component
export default class TKCampSelector extends Vue {
  @Prop({ default: () => [] })
  dataset!: TKDatasetFilterer;

  currentSurvey = this.dataset.currentSurvey;
  @Watch("dataset.currentSurvey")
  onCurrentSurveyChanged() {
    this.currentSurvey = this.dataset.currentSurvey;
  }

  currentAdmin1 = this.dataset.currentAdmin1;
  @Watch("dataset.currentAdmin1")
  onCurrentAdmin1Changed() {
    this.currentAdmin1 = this.dataset.currentAdmin1;
  }

  currentAdmin2 = this.dataset.currentAdmin2;
  @Watch("dataset.currentAdmin2")
  onCurrentAdmin2Changed() {
    this.currentAdmin2 = this.dataset.currentAdmin2;
  }

  currentCamp = this.dataset.currentCamp;
  @Watch("dataset.currentCamp")
  onCurrentCampChanged() {
    this.currentCamp = this.dataset.currentCamp;
  }

  surveySelected(year: string) {
    if (this.dataset.currentSurvey !== year) {
      this.dataset.setFiltersValue(TKFilters.SURVEY, year ? year : null);
    }
  }
  admin1Selected(pcode: string) {
    if (this.dataset.currentAdmin1?.pcode !== pcode) {
      this.dataset.setFiltersValue(TKFilters.ADMIN1, pcode ? pcode : null);
    }
  }
  admin2Selected(pcode: string) {
    if (this.dataset.currentAdmin2?.pcode !== pcode) {
      this.dataset.setFiltersValue(TKFilters.ADMIN2, pcode ? pcode : null);
    }
  }
  campSelected(campId: string) {
    if (this.dataset.currentCamp?.id !== campId) {
      this.dataset.setFiltersValue(TKFilters.CAMP, campId ? campId : null);
    }
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
