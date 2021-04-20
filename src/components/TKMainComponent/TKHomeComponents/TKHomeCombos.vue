<template>
  <div class="tk-home-combos">
    <p class="tk-home-combos-title">
      {{ $t("home.combosTitle").toUpperCase() }}
    </p>
    <v-select
      class="tk-autocomplete"
      flat
      dense
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
      :placeholder="$t('selectText') + ' ' + $t('camp').toLowerCase()"
      :v-model="dataset.currentCamp"
      :items="dataset.filteredCampsList"
      item-text="name"
      item-value="id"
      @change="campSelected"
    ></v-autocomplete>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKFilters, TKDatasetFilterer } from "@/domain/core/TKFilters";

@Component({})
export default class TKHomeCombos extends Vue {
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
.tk-home-combos {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: middle;
}

.tk-home-combos-title {
  color: var(--v-sectionTitle-base);
  letter-spacing: 0.86px;
  font-size: 12px;
}
</style>
