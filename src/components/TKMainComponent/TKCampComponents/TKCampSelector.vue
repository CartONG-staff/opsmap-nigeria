<template lang="html">
  <div class="tk-camp-selector">
    <v-autocomplete
      class="tk-autocomplete"
      color="discrete"
      dense
      :placeholder="$t('camp.comboSurveyPlaceholder')"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      color="discrete"
      dense
      :placeholder="$t('camp.comboStatePlaceholder')"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      color="discrete"
      dense
      :placeholder="$t('camp.comboLGAPlaceholder')"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      color="discrete"
      dense
      clearable
      v-model="campModel"
      :items="campList"
      item-text="name"
      item-value="id"
      @change="campSelected"
      :placeholder="$t('camp.comboCampPlaceholder')"
    ></v-autocomplete>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { CampDescription } from "@/domain/data/survey/merged_dataset/TKSubmissionsByCampsGrouper";

@Component
export default class TKCampSelector extends Vue {
  @Prop({ default: () => [] })
  readonly campList!: CampDescription[];

  // Hold the app current camp property
  @Prop()
  readonly currentCamp!: CampDescription;
  campModel = this.currentCamp ? this.currentCamp.id : "";

  // Hold the current camp at an app level
  // BEHAVIOR
  campSelected(campId: string) {
    if (campId) {
      this.$emit("camp-selection-changed", campId);
    } else {
      this.$emit("camp-selection-cleared");
    }
  }

  // @Emit("camp-selection-changed")
  // campSelectionChanged(id: string): void {
  //   console.log("campSelected: " + id);
  // }
  // @Emit("camp-selection-cleared")
  // campSelectionCleared() {
  //   console.log("Camp Selectio cleared");
  // }
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
