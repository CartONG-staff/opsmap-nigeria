<template>
  <div class="tk-router-handler"></div>
</template>

<script lang="ts">
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import Vue from "vue";
import { headerLogoBus } from "@/components/TKHeaderLogoBus";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class TKRouteHandler extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  currentRoute = "";

  created() {
    headerLogoBus.$on("switchToHomePage", () => {
      if (this.$route.path !== "/") {
        this.dataset.clearCurrentAdmin1();
        this.currentRoute = "/";
        this.$router.push({
          name: "home",
          params: {
            dataset: "dataset",
            appConfig: "appConfig",
            visualizerOptions: "visualizerOptions"
          }
        });
      }
    });
  }

  // Trigger at startup or when the changes comes from the URL
  @Watch("dataset")
  onDatasetChanged() {
    this.updateDatasetFromUrl();
  }

  // Triggered when a camp is selected
  @Watch("dataset.lastModification")
  onLastModificationChange() {
    this.updateUrlFromDataset();
  }

  @Watch("$route.path")
  onRouteChangedInTheNavbar() {
    if (
      this.currentRoute !== this.$route.path &&
      this.currentRoute !== this.$route.path + "/"
    ) {
      this.updateDatasetFromUrl();
      this.currentRoute = this.$route.path;
    }
  }

  // Adjust dataset from a given URL
  updateDatasetFromUrl() {
    if (this.$route.name === "home") {
      this.dataset.clearCurrentAdmin1();
    } else if (this.$route.name === "camp") {
      const survey: string = this.$route.params["survey"] ?? "";
      const admin1: string = this.$route.params["admin1"] ?? "";
      const admin2: string = this.$route.params["admin2"] ?? "";
      const camp: string = this.$route.params["camp"] ?? "";
      const date: string = this.$route.params["date"]?.replaceAll("-", "/");
      if (survey) {
        this.dataset.setActiveSurvey(survey);
        if (camp) {
          this.dataset.setCurrentCampName(camp);
          if (date) {
            this.dataset.setCurrentDate(date);
          }
        } else if (admin2) {
          this.dataset.setCurrentAdmin2Name(admin2);
        } else if (admin1) {
          this.dataset.setCurrentAdmin1Name(admin1);
        }
        // if (
        //   admin1 !== this.dataset.currentAdmin1?.name ||
        //   admin2 !== this.dataset.currentAdmin2?.name ||
        //   camp !== this.dataset.currentCamp?.name ||
        //   date !== this.dataset.currentDate
        // ) {
        //   console.log("- requires update");
        //   console.log(admin1);
        //   console.log(this.dataset.currentAdmin1?.name);
        //   console.log(admin2);
        //   console.log(this.dataset.currentAdmin2?.name);
        //   console.log(camp);
        //   console.log(this.dataset.currentCamp?.name);
        //   console.log(date);
        //   console.log(this.dataset.currentDate);
        //   // URL requires update
        //   this.updateUrlFromDataset();
        // }
      }
    }
  }

  // Adjust URL from a given dataset
  updateUrlFromDataset() {
    // upadte URL
    const surveyE = encodeURIComponent(this.dataset.currentSurvey);
    const admin1E = encodeURIComponent(this.dataset.currentAdmin1?.name ?? "");
    const admin2E = encodeURIComponent(this.dataset.currentAdmin2?.name ?? "");
    const campE = encodeURIComponent(this.dataset.currentCamp?.name ?? "");
    const dateE = encodeURIComponent(
      this.dataset.currentDate?.replaceAll("/", "-") ?? ""
    );

    let path = `/camp`;
    if (surveyE) {
      path += `/${surveyE}`;
      if (admin1E) {
        path += `/${admin1E}`;
        if (admin2E) {
          path += `/${admin2E}`;
          if (campE) {
            path += `/${campE}`;
            if (dateE) {
              path += `/${dateE}`;
            }
          }
        }
      } else {
        path = "/";
      }
    }

    if (this.$route.path !== path && this.$route.path !== path + "/") {
      this.currentRoute = path;
      this.$router.push({
        path: path,
        params: {
          dataset: "dataset",
          visualizerOptions: "visualizerOptions",
          appConfig: "appConfig"
        }
      });
    }
  }
}
</script>

<style scoped>
.tk-router-handler {
  visibility: hidden;
}
</style>
