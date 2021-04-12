<template>
  <div class="tk-camp-toolbar">
    <v-autocomplete
      background-color="#418fde"
      color="#ffffff"
      :items="surveysDate"
      v-model="surveysDateModel"
      flat
      filled
      solo
      dense
      class="tk-camp-toolbar-survey"
      height="44"
    ></v-autocomplete>
    <v-btn
      depressed
      color="#000"
      elevation="0"
      class="tk-camp-toolbar-export"
      height="44"
    >
      Export as CSV
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class TKCampToolbar extends Vue {
  @Prop({ default: {} })
  readonly survey!: object;

  surveysDate = [""];
  surveysDateModel = "";

  @Watch("survey")
  surveyChanged() {
    this.surveysDate = Object.keys(this.survey);
    this.surveysDateModel = this.surveysDate[0];
  }
}
</script>

<style>
.tk-camp-toolbar {
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  align-items: top;
  column-gap: 5%;
}

.tk-camp-toolbar-survey {
  width: 55%;
}
.tk-camp-toolbar-export {
  width: 40%;
}

.tk-camp-toolbar-export .v-btn__content {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar-survey input {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar-survey input::placeholder {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar-survey .v-icon.v-icon {
  color: #fff !important;
}
</style>
