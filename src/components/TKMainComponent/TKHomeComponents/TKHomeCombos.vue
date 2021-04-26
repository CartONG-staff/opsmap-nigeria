<template>
  <div class="tk-home-combos">
    <transition mode="out-in" name="fade-in">
      <p :key="$root.$i18n.locale" class="tk-home-combos-title">
        {{ $t("home.combosTitle").toUpperCase() }}
      </p>
    </transition>

    <transition mode="out-in" name="fade-in">
      <v-select
        class="tk-autocomplete"
        flat
        dense
        :key="$root.$i18n.locale"
        :placeholder="$t('selectText') + ' ' + $t('survey').toLowerCase()"
        v-model="currentSurvey"
        :items="dataset.surveyList"
        @change="surveySelected"
      ></v-select>
    </transition>
    <transition mode="out-in" name="fade-in">
      <v-autocomplete
        class="tk-autocomplete"
        flat
        dense
        :key="$root.$i18n.locale"
        :placeholder="$t('selectText') + ' ' + $t('infosAdmin1').toLowerCase()"
        :items="dataset.filteredAdmin1List"
        item-text="name"
        item-value="pcode"
        v-model="currentAdmin1"
        @change="admin1Selected"
        clearable
      ></v-autocomplete>
    </transition>
    <transition mode="out-in" name="fade-in">
      <v-autocomplete
        class="tk-autocomplete"
        flat
        dense
        :key="$root.$i18n.locale"
        :placeholder="$t('selectText') + ' ' + $t('infosAdmin2').toLowerCase()"
        v-model="currentAdmin2"
        :items="dataset.filteredAdmin2List"
        item-text="name"
        item-value="pcode"
        @change="admin2Selected"
        clearable
      ></v-autocomplete>
    </transition>
    <transition mode="out-in" name="fade-in">
      <v-autocomplete
        class="tk-autocomplete"
        flat
        dense
        :key="$root.$i18n.locale"
        clearable
        :placeholder="$t('selectText') + ' ' + $t('camp').toLowerCase()"
        :v-model="currentCamp"
        :items="dataset.filteredCampsList"
        item-text="name"
        item-value="id"
        @change="campSelected"
      ></v-autocomplete>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TKFilters, TKDatasetFilterer } from "@/domain/survey/TKFilters";

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
