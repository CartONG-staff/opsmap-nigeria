<template>
  <div class="tk-site-infos">
    <!-- Site Type -->
    <div class="tk-site-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-site-infos-field-key">
          {{
            $t("infosSiteType")
              .toString()
              .toUpperCase()
          }}
        </div>
      </transition>
      <transition mode="out-in" name="fade-in">
        <div :key="siteType" class="tk-site-infos-field-value-with-icon">
          <img
            class="tk-site-infos-field-icon"
            :src="siteTypeIcon"
            v-if="siteTypeIcon"
          />
          <div class="tk-site-infos-field-value">
            {{ siteType.toUpperCase() }}
          </div>
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" />
    <!-- ADMIN1 -->
    <div class="tk-site-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-site-infos-field-key">
          {{
            $t("infosAdmins.admin1")
              .toString()
              .toUpperCase()
          }}
        </div>
      </transition>
      <transition mode="out-in" name="fade-in">
        <div :key="admin1" class="tk-site-infos-field-value">
          {{ admin1.toUpperCase() }}
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" />
    <!-- ADMIN2 -->
    <div class="tk-site-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-site-infos-field-key">
          {{
            $t("infosAdmins.admin2")
              .toString()
              .toUpperCase()
          }}
        </div>
      </transition>
      <transition mode="out-in" name="fade-in">
        <div :key="admin2" class="tk-site-infos-field-value">
          {{ admin2.toUpperCase() }}
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" v-if="displaySiteInfos" />
    <!-- GPS COORDINATES -->
    <div class="tk-site-infos-field" v-if="displaySiteInfos">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-site-infos-field-key">
          {{
            $t("site.infosCoordinates")
              .toString()
              .toUpperCase()
          }}
        </div>
      </transition>
      <transition mode="out-in" name="fade-in">
        <div :key="coordinates" class="tk-site-infos-field-value">
          {{ coordinates.toUpperCase() }}
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" />
    <div class="tk-site-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-site-infos-field-key">
          {{
            $t("manageBy")
              .toString()
              .toUpperCase()
          }}
        </div>
      </transition>

      <transition mode="out-in" name="fade-in">
        <div :key="manageBy" class="tk-site-infos-field-value">
          <div v-if="manageByUrl">
            <a
              :href="manageByUrl"
              target="_blank"
              class="tk-site-infos-field-value"
            >
              {{ manageBy.toUpperCase() }}
            </a>
          </div>
          <div v-else>
            {{ manageBy.toUpperCase() }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { TKAdminLevel } from "@/domain/opsmapConfig/TKAdminLevel";
import { TKSurveyAnonymousType } from "@/domain/survey/TKSurvey";
import { TKIconUrl } from "@/domain/utils/TKIconUrl";
import { TKGetLocalValue, TKLabel } from "@/domain/utils/TKLabel";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class TKSiteInfos extends Vue {
  get dataset() {
    return TKDatasetModule.dataset;
  }

  manageByLabel!: TKLabel;

  admin1 = "-";
  admin2 = "-";
  siteType = "-";
  siteTypeIcon = "-";
  coordinates = "-";
  manageBy = "";
  manageByUrl = "";

  @Watch("dataset.currentSite", { immediate: true })
  onChange() {
    if (this.dataset) {
      this.admin1 = TKGetLocalValue(
        this.dataset.currentSite?.adminsLabels[TKAdminLevel.ADMIN1],
        this.$root.$i18n.locale
      );
      this.admin2 = TKGetLocalValue(
        this.dataset.currentSite?.adminsLabels[TKAdminLevel.ADMIN2],
        this.$root.$i18n.locale
      );

      this.coordinates = this.dataset.currentSite
        ? this.dataset.currentSite.coordinates.lat +
          "," +
          this.dataset.currentSite.coordinates.lng
        : "-";
      this.handeLocale();
    }
  }

  @Watch("dataset.currentSubmission", { immediate: true })
  onSubmissionChange() {
    this.manageByLabel = this.dataset.currentSite
      ? this.dataset.currentSite.managedBy
      : { [TKConfigurationModule.configuration.locale.default]: "-" };

    if (this.dataset && this.dataset.currentSurvey) {
      this.manageByUrl = this.dataset.currentSurvey.fdf.urls[
        this.manageByLabel[TKConfigurationModule.configuration.locale.default]
      ];
    } else {
      this.manageByUrl = "";
    }

    this.siteTypeIcon = this.dataset.currentSite
      ? TKIconUrl(this.dataset.currentSite.type.iconFileName.normal)
      : "";

    this.handeLocale();
  }

  @Watch("$root.$i18n.locale")
  handeLocale() {
    if (!this.dataset || !this.dataset.currentSite) {
      this.siteType = "-";
      this.manageBy = "-";
    } else {
      this.manageBy = TKGetLocalValue(
        this.manageByLabel,
        this.$root.$i18n.locale
      );

      this.siteType = TKGetLocalValue(
        this.dataset.currentSite.type.thematicLabel,
        this.$root.$i18n.locale
      ).toUpperCase();

      this.admin1 = TKGetLocalValue(
        this.dataset.currentSite?.adminsLabels[TKAdminLevel.ADMIN1],
        this.$root.$i18n.locale
      );
      this.admin2 = TKGetLocalValue(
        this.dataset.currentSite?.adminsLabels[TKAdminLevel.ADMIN2],
        this.$root.$i18n.locale
      );
    }
  }

  get displaySiteInfos(): boolean {
    return (
      this.dataset.currentSurvey.options.anonymousMode ===
      TKSurveyAnonymousType.NONE
    );
  }
}
</script>

<style scoped>
.tk-site-infos {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  width: 100%;
}

.tk-hseparator {
  height: 1px;
  width: 100%;
  background-color: var(--v-discrete-base);
}

.tk-site-infos-field {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.tk-site-infos-field-key {
  line-height: 3;
  font-size: 12px;
  font-weight: bold;
  color: var(--v-secondary-base);
  letter-spacing: 0.86;
}

.tk-site-infos-field-value {
  line-height: 3;
  font-size: 12px;
  font-weight: bold;
  color: var(--v-accent-base);
  letter-spacing: 0.86px;
}

.tk-site-infos-field-value-with-icon {
  display: flex;
  flex-flow: row nowrap;
  column-gap: 5px;
  align-items: baseline;
}

.tk-site-infos-field-icon {
  height: 12px;
  display: block;
}
</style>
