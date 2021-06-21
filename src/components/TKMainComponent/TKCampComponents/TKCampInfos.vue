<template>
  <div class="tk-camp-infos">
    <!-- Site Type -->
    <div class="tk-camp-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-camp-infos-field-key">
          {{ $t("infosSiteType").toUpperCase() }}
        </div>
      </transition>

      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-camp-infos-field-value">
          <div v-if="isSitePlanned">
            {{ $t("infosSitePlanned").toUpperCase() }}
          </div>
          <div v-else>
            {{ $t("infosSiteSpontanneous").toUpperCase() }}
          </div>
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" />
    <!-- ADMIN1 -->
    <div class="tk-camp-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-camp-infos-field-key">
          {{ $t("infosAdmin1").toUpperCase() }}
        </div>
      </transition>
      <transition mode="out-in" name="fade-in">
        <div :key="admin1" class="tk-camp-infos-field-value">
          {{ admin1.toUpperCase() }}
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" />
    <!-- ADMIN2 -->
    <div class="tk-camp-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-camp-infos-field-key">
          {{ $t("infosAdmin2").toUpperCase() }}
        </div>
      </transition>
      <transition mode="out-in" name="fade-in">
        <div :key="admin2" class="tk-camp-infos-field-value">
          {{ admin2.toUpperCase() }}
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" />
    <!-- GPS COORDINATES -->
    <div class="tk-camp-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-camp-infos-field-key">
          {{ $t("site.infosCoordinates").toUpperCase() }}
        </div>
      </transition>
      <transition mode="out-in" name="fade-in">
        <div :key="coordinates" class="tk-camp-infos-field-value">
          {{ coordinates.toUpperCase() }}
        </div>
      </transition>
    </div>
    <div class="tk-hseparator" />
    <div class="tk-camp-infos-field">
      <transition mode="out-in" name="fade-in">
        <div :key="$root.$i18n.locale" class="tk-camp-infos-field-key">
          {{ $t("manageBy").toUpperCase() }}
        </div>
      </transition>

      <transition mode="out-in" name="fade-in">
        <div :key="manageBy" class="tk-camp-infos-field-value">
          <div v-if="manageByUrl">
            <a
              :href="manageByUrl"
              target="_blank"
              class="tk-camp-infos-field-value"
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
// Manage by: cccm_shelter__mangmt

import { TKCampTypesValues } from "@/domain/survey/TKCampTypesValues";
import { TKDatasetFilterer } from "@/domain/survey/TKFilters";
import { TKSubmission } from "@/domain/survey/TKSubmission";
import { TKSubmissionEntryText } from "@/domain/survey/TKSubmissionEntryText";
import { TKGetLocalValue, TKLabel } from "@/domain/ui/TKLabel";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class TKCampInfos extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  @Prop()
  readonly submission!: TKSubmission;

  manageByLabel!: TKLabel;

  admin1 = "-";
  admin2 = "-";
  isSitePlanned = true;
  coordinates = "-";
  manageBy = "";
  manageByUrl = "";

  @Watch("dataset.currentCamp", { immediate: true })
  onChange() {
    if (this.dataset) {
      this.admin1 = this.dataset.currentCamp
        ? this.dataset.currentCamp.admin1.name
        : "-";
      this.admin2 = this.dataset.currentCamp
        ? this.dataset.currentCamp.admin2.name
        : "-";
      this.isSitePlanned = this.dataset.currentCamp
        ? this.dataset.currentCamp.type === TKCampTypesValues.PLANNED
        : false;
      this.isSitePlanned = !this.isSitePlanned;
      this.coordinates = this.dataset.currentCamp
        ? this.dataset.currentCamp.lat + "," + this.dataset.currentCamp.lng
        : "-";
    }
  }

  @Watch("submission", { immediate: true })
  onSubmissionChange() {
    this.manageByLabel = (this.submission?.thematics["group_cccm"]?.data?.find(
      item => item.field === "cccm_shelter__mangmt"
    ) as TKSubmissionEntryText)?.answerLabel ?? { en: "-" };

    this.manageByUrl = this.dataset.surveys[
      this.dataset.currentSurvey
    ].fdf.urls[this.manageByLabel["en"]];

    this.handeLocale();
  }

  @Watch("$root.$i18n.locale")
  handeLocale() {
    this.manageBy = TKGetLocalValue(
      this.manageByLabel,
      this.$root.$i18n.locale
    );
  }
}
</script>

<style scoped>
.tk-camp-infos {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  width: 100%;
}

.tk-hseparator {
  height: 1px;
  width: 100%;
  background-color: #e0e0e0;
}

.tk-camp-infos-field {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
}

.tk-camp-infos-field-key {
  line-height: 3;
  font-size: 12px;
  font-weight: bold;
  color: #999;
  letter-spacing: 0.86;
}

.tk-camp-infos-field-value {
  line-height: 3;
  font-size: 12px;
  font-weight: bold;
  color: #418fde;
  letter-spacing: 0.86px;
}
</style>
