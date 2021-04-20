<template lang="html">
  <div class="tk-camp-selector">
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
import { TKCampDescription } from "@/domain/core/TKCampDescription";
import { TKDatasetFilterer } from "@/domain/core/TKFilters";
import { TKBoundarieDescription } from "@/domain/core/TKBoundarieDescription";

@Component
export default class TKCampSelector extends Vue {
  @Prop({ default: () => [] })
  dataset!: TKDatasetFilterer;

  surveySelected(year: string) {
    this.dataset.currentSurvey = year;
    console.log(this.dataset);
  }

  admin1Selected(pcode: string) {
    this.dataset.currentAdmin1 = pcode
      ? (this.dataset.admin1List.find(
          (a) => a.pcode === pcode
        ) as TKBoundarieDescription)
      : null;
    console.log(this.dataset);
  }

  admin2Selected(pcode: string) {
    this.dataset.currentAdmin2 = pcode
      ? (this.dataset.admin2List.find(
          (a) => a.pcode === pcode
        ) as TKBoundarieDescription)
      : null;
  }
  campSelected(campId: string) {
    this.dataset.currentCamp = campId
      ? (this.dataset.campsList.find(
          (c) => c.id === campId
        ) as TKCampDescription)
      : null;
    console.log(this.dataset);
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
}

.tk-autocomplete {
  margin: 0 15px;
  height: 30px;
  width: 20%;
}
</style>
