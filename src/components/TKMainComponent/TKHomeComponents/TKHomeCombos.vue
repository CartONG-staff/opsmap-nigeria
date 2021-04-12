<template>
  <div class="tk-home-combos">
    <p class="tk-home-combos-title">
      {{ $t("home.combosTitle").toUpperCase() }}
    </p>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('home.comboSurveyPlaceholder')"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('home.comboStatePlaceholder')"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('home.comboLGAPlaceholder')"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('home.comboCampPlaceholder')"
      v-model="campListModel"
      :items="campList"
      item-text="name"
      item-value="id"
      @change="campSelected"
    ></v-autocomplete>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue, Watch } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/config/TKGeneralConfiguration";

import { CampDescription } from "@/domain/data/survey/merged_dataset/TKSubmissionsByCampsGrouper";

@Component({})
export default class TKHomeCombos extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
  @Prop({ default: () => [] })
  readonly campList!: CampDescription[];

  // Hold the app current camp property
  @Prop()
  readonly currentCampId!: string;
  campListModel = this.currentCampId;
  @Watch("currentCampId")
  currentCampIdChanged() {
    this.campListModel = this.currentCampId;
  }

  // Hold the current camp at an app level
  // BEHAVIOR
  campSelected(campId: string) {
    if (campId != null) {
      this.campSelectionChanged(campId);
    } else {
      this.campSelectionCleared();
    }
  }

  @Emit("camp-selection-changed")
  campSelectionChanged(id: string): void {
    console.log("campSelected: " + id);
  }
  @Emit("camp-selection-cleared")
  campSelectionCleared() {
    console.log("Camp Selectio cleared");
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
