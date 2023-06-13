<template>
  <div class="tk-router-handler"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { headerLogoBus } from "@/primary/components/TKHeaderLogoBus";
import { Component, Watch } from "vue-property-decorator";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { root, TKAdminLevel } from "@/domain/opsmapConfig/TKAdminLevel";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

@Component
export default class TKRouteHandler extends Vue {
  currentRoute = "/";

  created() {
    headerLogoBus.$on("switchToHomePage", () => {
      if (this.$route.path !== "/") {
        if (TKDatasetModule.dataset) {
          const rootLevel = root();
          if (rootLevel) {
            TKDatasetModule.dataset.setCurrentAdmin(rootLevel, null);
          }
        }

        this.currentRoute = "/";
        this.$router.push({
          name: "home"
        });
      }
    });
  }

  get dataset() {
    return TKDatasetModule.dataset;
  }

  // Trigger at startup or when the changes comes from the URL
  @Watch("dataset")
  onDatasetChanged() {
    this.updateDatasetFromUrl();
  }

  // Triggered when a site is selected
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
      TKDatasetModule.dataset.setCurrentAdmin(TKAdminLevel.ADMIN1, null);
    } else if (this.$route.name === "site") {
      const survey: string = this.$route.params["survey"] ?? "";

      const site: string = this.$route.params["site"] ?? "";
      const date: string = this.$route.params["date"]?.replaceAll("-", "/");
      if (survey) {
        TKDatasetModule.dataset.setCurrentSurveyByName(survey);
        if (site) {
          TKDatasetModule.dataset.setCurrentSiteByName(site);
          if (date) {
            TKDatasetModule.dataset.setSubmissionByDate(date);
          }
        } else {
          for (const level of [
            ...TKConfigurationModule.configuration.spatial.adminLevels
          ].reverse()) {
            const adminName: string = this.$route.params[level] ?? "";
            if (adminName) {
              TKDatasetModule.dataset.setCurrentAdminByName(level, adminName);
              return;
            }
          }
        }
      }
    }
  }

  // Adjust URL from a given dataset
  updateUrlFromDataset() {
    const pathItems: Array<string> = [];
    let path = "/";
    // add survey
    pathItems.push(
      encodeURIComponent(TKDatasetModule.dataset.currentSurvey?.name ?? "")
    );
    // add admins subpath
    const adminsSubpath = TKConfigurationModule.configuration.spatial.adminLevels
      .map(level =>
        encodeURIComponent(
          TKDatasetModule.dataset.getCurrentAdmin(level)?.name ?? ""
        )
      )
      .filter(item => item !== "");

    if (adminsSubpath.length) {
      pathItems.push(...adminsSubpath);

      // add site subpath
      pathItems.push(
        encodeURIComponent(TKDatasetModule.dataset.currentSite?.name ?? "")
      );

      // add date subpath
      pathItems.push(
        encodeURIComponent(
          TKDatasetModule.dataset.currentSubmission?.date.replaceAll(
            "/",
            "-"
          ) ?? ""
        )
      );
      path = "/site/" + pathItems.filter(item => item !== "").join("/");
    }
    if (
      this.$route.path !== path &&
      this.$route.path !== path + "/" &&
      !(!TKDatasetModule.dataset.currentSite && this.$route.name === "home") // Prevent to site page when no site is selected
    ) {
      this.currentRoute = path;
      this.$router.push({
        path: path
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
