<template lang="html">
  <div class="tk-camp-selector">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" class="tk-autocomplete-container">
          <transition mode="out-in" name="fade-in">
            <v-autocomplete
              class="tk-autocomplete"
              :key="$root.$i18n.locale"
              flat
              dense
              :label="$t('survey')"
              v-model="currentSurvey"
              :items="dataset.surveyList"
              @change="surveySelected"
              :disabled="dataset.surveyList.length < 2"
            ></v-autocomplete>
          </transition>
        </div>
      </template>
      <span>{{ $t("selectText") }} {{ $t("survey").toLowerCase() }}</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" class="tk-autocomplete-container">
          <transition mode="out-in" name="fade-in">
            <v-autocomplete
              class="tk-autocomplete"
              :key="$root.$i18n.locale"
              flat
              dense
              :label="$t('infosAdmin1')"
              v-model="currentAdmin1"
              :items="dataset.filteredAdmin1List"
              item-text="name"
              item-value="pcode"
              @change="admin1Selected"
              clearable
            ></v-autocomplete>
          </transition>
        </div>
      </template>
      <span>{{ $t("selectText") }} {{ $t("infosAdmin1").toLowerCase() }}</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" class="tk-autocomplete-container">
          <transition mode="out-in" name="fade-in">
            <v-autocomplete
              class="tk-autocomplete"
              :key="$root.$i18n.locale"
              flat
              dense
              :label="$t('infosAdmin2')"
              v-model="currentAdmin2"
              :items="dataset.filteredAdmin2List"
              item-text="name"
              item-value="pcode"
              @change="admin2Selected"
              clearable
            ></v-autocomplete>
          </transition>
        </div>
      </template>
      <span>{{ $t("selectText") }} {{ $t("infosAdmin2").toLowerCase() }}</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" class="tk-autocomplete-container">
          <transition mode="out-in" name="fade-in">
            <v-autocomplete
              class="tk-autocomplete"
              :key="$root.$i18n.locale"
              flat
              dense
              :label="$t('camp')"
              v-model="currentCamp"
              :items="dataset.filteredCampsList"
              item-text="name"
              item-value="id"
              @change="campSelected"
              clearable
            ></v-autocomplete>
          </transition>
        </div>
      </template>
      <span>{{ $t("selectText") }} {{ $t("camp").toLowerCase() }}</span>
    </v-tooltip>
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
  padding-top: 12px;
}
.tk-autocomplete-container {
  width: 20%;
  margin: 0 15px;
  height: 30px;
}
</style>
