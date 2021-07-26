<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-camp-toolbar-container">
      <v-select
        v-if="dataset.currentCamp"
        key="1"
        class="tk-camp-toolbar-item"
        background-color="#000"
        color="#ffffff"
        flat
        filled
        solo
        dense
        height="44"
        :items="exportFormats"
        :label="exportModel"
        :prefix="$t('site.exportPreffix').toUpperCase()"
        v-model="exportModel"
        @click="resetSelected()"
      ></v-select>
      <v-select
        v-else
        key="2"
        class="tk-camp-toolbar-item-disabled"
        background-color="#000"
        color="#ffffff"
        disabled
        readonly
        flat
        filled
        solo
        dense
        height="44"
      ></v-select>
    </div>
  </transition>
</template>

<script lang="ts">
import { TKCSVWrite } from "@/domain/csv/TKCSVWriter";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class TKCampToolbarExportButton extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;
  readonly exportFormats = ["PDF", "CSV"];
  exportModel = "PDF";

  resetSelected() {
    this.exportModel = "";
  }

  @Watch("exportModel")
  onExportTriggered() {
    if (this.dataset && this.dataset.currentSubmission) {
      switch (this.exportModel) {
        case "":
          console.log("Break because empty");
          break;
        case "PDF":
          console.log("Export to PDF");
          break;
        case "CSV":
          TKCSVWrite(this.dataset, this.$root.$i18n.locale);
          break;
        default:
          console.log("Unkknow Output format");
      }
    }
  }
}
</script>
