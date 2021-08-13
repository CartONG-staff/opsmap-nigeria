<template lang="html">
  <transition mode="out-in" name="fade">
    <div :key="$root.$i18n.locale" class="tk-camp-selector">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
            class="tk-autocomplete"
            flat
            dense
            :label="$t('survey')"
            v-model="currentSurvey"
            :items="dataset.surveys"
            item-text="name"
            @change="surveySelected"
            :disabled="dataset.surveys.length < 2"
            return-object
            v-bind="attrs"
            v-on="on"
          ></v-autocomplete>
        </template>
        <span>{{ $t("selectText") }} {{ $t("survey").toLowerCase() }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
            class="tk-autocomplete"
            flat
            dense
            :label="$t('infosAdmin1')"
            v-model="currentAdmin1"
            :items="dataset.filteredAdmin1List"
            :disabled="!dataset.filteredAdmin1List.length"
            item-text="name"
            item-value="pcode"
            @change="admin1Selected"
            clearable
            v-bind="attrs"
            v-on="on"
          ></v-autocomplete>
        </template>
        <span
          >{{ $t("selectText") }} {{ $t("infosAdmin1").toLowerCase() }}</span
        >
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
            class="tk-autocomplete"
            flat
            dense
            :label="$t('infosAdmin2')"
            v-model="currentAdmin2"
            :items="dataset.filteredAdmin2List"
            :disabled="!dataset.filteredAdmin2List.length"
            item-text="name"
            item-value="pcode"
            @change="admin2Selected"
            clearable
            v-bind="attrs"
            v-on="on"
          ></v-autocomplete>
        </template>
        <span
          >{{ $t("selectText") }} {{ $t("infosAdmin2").toLowerCase() }}</span
        >
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
            class="tk-autocomplete"
            flat
            dense
            :label="$t('camp')"
            v-model="currentCamp"
            :items="dataset.filteredCampsList"
            :disabled="!dataset.filteredCampsList.length"
            item-text="camp.name"
            item-value="camp.id"
            @change="campSelected"
            clearable
            v-bind="attrs"
            v-on="on"
          ></v-autocomplete>
        </template>
        <span>{{ $t("selectText") }} {{ $t("camp").toLowerCase() }}</span>
      </v-tooltip>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKSurvey } from "@/domain/survey/TKSurvey";

@Component
export default class TKCampSelector extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

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

  surveySelected(survey: TKSurvey) {
    if (survey) {
      this.dataset.setActiveSurvey(survey);
    } else {
      this.dataset.resetActiveSurvey();
    }
  }

  admin1Selected(pcode: string) {
    if (pcode !== this.dataset.currentAdmin1?.pcode) {
      pcode
        ? this.dataset.setCurrentAdmin1(pcode)
        : this.dataset.clearCurrentAdmin1();
    }
  }
  admin2Selected(pcode: string) {
    if (pcode !== this.dataset.currentAdmin2?.pcode) {
      pcode
        ? this.dataset.setCurrentAdmin2(pcode)
        : this.dataset.clearCurrentAdmin2();
    }
  }
  campSelected(campId: string) {
    if (campId !== this.dataset.currentCamp?.camp.id) {
      campId
        ? this.dataset.setCurrentCamp(campId)
        : this.dataset.clearCurrentCamp();
    }
  }
}
</script>
<style scoped>
.tk-camp-selector {
  border-radius: 8px;
  align-items: center;
  background-color: #f0fbffcc;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 3000;
  box-shadow: 0 0 20px 2px rgba(58, 158, 211, 0.15);
  width: 100%;
  height: 100%;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 12px;
  display: flex;
  flex-flow: row wrap;
  row-gap: 24px;
  justify-content: space-evenly;
}

.tk-autocomplete {
  width: 20%;
  margin: 0 15px;
  height: 30px;
  min-width: 200px;
}
</style>
