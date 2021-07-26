<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-camp-toolbar-container">
      <v-autocomplete
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
        :prefix="$t('site.exportPreffix').toUpperCase()"
        v-model="exportModel"
        @change="onExportTriggered"
      ></v-autocomplete>
      <v-autocomplete
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
      ></v-autocomplete>
    </div>
  </transition>
</template>

<script lang="ts">
import { TKCSVWrite } from "@/domain/csv/TKCSVWriter";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TKCampToolbarExportButton extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  model = "";
  readonly exportFormats = ["PDF", "CSV"];
  exportModel = "PDF";

  onExportTriggered(type: string) {
    if (this.dataset && this.dataset.currentSubmission) {
      switch (type) {
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
