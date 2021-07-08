<template>
  <transition mode="out-in" name="fade">
    <div :key="$root.$i18n.locale" class="tk-home-combos">
      <transition mode="out-in" name="fade-in">
        <p :key="$root.$i18n.locale" class="tk-home-combos-title">
          {{ $t("home.combosTitle").toUpperCase() }}
        </p>
      </transition>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <div multiple v-on="on" v-bind="attrs">
            <v-autocomplete
              class="tk-autocomplete"
              flat
              dense
              :label="$t('survey')"
              v-model="currentSurvey"
              :items="dataset.surveyList"
              @change="surveySelected"
              :disabled="dataset.surveyList.length < 2"
            ></v-autocomplete>
          </div>
        </template>
        <span>{{ $t("selectText") }} {{ $t("survey").toLowerCase() }}</span>
      </v-tooltip>

      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <div multiple v-on="on" v-bind="attrs">
            <v-autocomplete
              class="tk-autocomplete"
              flat
              dense
              :label="$t('infosAdmin1')"
              :items="dataset.filteredAdmin1List"
              item-text="name"
              item-value="pcode"
              v-model="currentAdmin1"
              @change="admin1Selected"
              clearable
            ></v-autocomplete>
          </div>
        </template>
        <span
          >{{ $t("selectText") }} {{ $t("infosAdmin1").toLowerCase() }}</span
        >
      </v-tooltip>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <div multiple v-on="on" v-bind="attrs">
            <v-autocomplete
              class="tk-autocomplete"
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
          </div>
        </template>
        <span
          >{{ $t("selectText") }} {{ $t("infosAdmin2").toLowerCase() }}</span
        >
      </v-tooltip>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <div multiple v-on="on" v-bind="attrs">
            <v-autocomplete
              class="tk-autocomplete"
              flat
              dense
              clearable
              :label="$t('camp')"
              :v-model="currentCamp"
              :items="dataset.filteredCampsList"
              item-text="name"
              item-value="id"
              @change="campSelected"
            ></v-autocomplete>
          </div>
        </template>
        <span>{{ $t("selectText") }} {{ $t("camp").toLowerCase() }}</span>
      </v-tooltip>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";

@Component({})
export default class TKHomeCombos extends Vue {
  @Prop({ default: () => [] })
  dataset!: TKDatasetFilterer;

  currentSurvey = this.dataset.currentSurvey;
  @Watch("dataset.currentSurvey")
  onCurrentSurveyChanged() {
    if (this.currentSurvey !== this.dataset.currentSurvey) {
      this.currentSurvey = this.dataset.currentSurvey;
    }
  }

  currentAdmin1 = this.dataset.currentAdmin1;
  @Watch("dataset.currentAdmin1")
  onCurrentAdmin1Changed() {
    if (this.currentAdmin1 !== this.dataset.currentAdmin1) {
      this.currentAdmin1 = this.dataset.currentAdmin1;
    }
  }

  currentAdmin2 = this.dataset.currentAdmin2;
  @Watch("dataset.currentAdmin2")
  onCurrentAdmin2Changed() {
    if (this.currentAdmin2 !== this.dataset.currentAdmin2) {
      this.currentAdmin2 = this.dataset.currentAdmin2;
    }
  }

  currentCamp = this.dataset.currentCamp;
  @Watch("dataset.currentCamp")
  onCurrentCampChanged() {
    if (this.currentCamp !== this.dataset.currentCamp) {
      this.currentCamp = this.dataset.currentCamp;
    }
    this.currentCamp = this.dataset.currentCamp;
  }

  surveySelected(id: string) {
    id ? this.dataset.setActiveSurvey(id) : this.dataset.resetActiveSurvey();
  }
  admin1Selected(pcode: string) {
    pcode
      ? this.dataset.setCurrentAdmin1(pcode)
      : this.dataset.clearCurrentAdmin1();
  }
  admin2Selected(pcode: string) {
    pcode
      ? this.dataset.setCurrentAdmin2(pcode)
      : this.dataset.clearCurrentAdmin2();
  }
  campSelected(campId: string) {
    campId
      ? this.dataset.setCurrentCamp(campId)
      : this.dataset.clearCurrentCamp();
  }
}
</script>

<style scoped>
.tk-home-combos {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: middle;
  row-gap: 6px;
  position: relative;
}

.tk-home-combos-title {
  color: var(--v-sectionTitle-base);
  letter-spacing: 0.86px;
  font-size: 12px;
}

.tk-autocomplete {
  position: relative;
}
</style>
