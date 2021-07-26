<template>
  <div class="pdf-document" ref="pdf-document">
    <div class="pdf-document-content">
      <div class="header">
        <div class="header-left">
          <img src="@/assets/LogoOpsmap.png" class="header-opsmap-logo" />
          <h3>
            <span class="header-opsmap-title">{{ appName }}</span>
            <span class="header-opsmap-subtitle"
              >{{ siteName }} - {{ date }}</span
            >
          </h3>
        </div>
        <div class="header-right">
          <img src="@/assets/LogoCluster.png" class="header-cccm-logo" />
        </div>
      </div>
      <div class="header-separator"></div>
      <div class="headlines">
        <div class="headlines-left">
          <div class="headlines-left-title">
            <span class="tk-title-base">
              {{ $t("main.title").toUpperCase() }}
            </span>
          </div>
          <div class="tk-camp-subtitle">{{ siteName }}</div>
          <div class="headlines-left-infos">
            <div class="tk-camp-infos">
              <!-- Site Type -->
              <div class="tk-camp-infos-field">
                <div class="tk-camp-infos-field-key">
                  {{ $t("infosSiteType").toUpperCase() }}
                </div>
                <div class="tk-camp-infos-field-value">
                  {{ siteType.toUpperCase() }}
                </div>
              </div>
              <div class="headlines-hseparator" />
              <!-- ADMIN1 -->
              <div class="tk-camp-infos-field">
                <div class="tk-camp-infos-field-key">
                  {{ $t("infosAdmin1").toUpperCase() }}
                </div>
                <div class="tk-camp-infos-field-value">
                  {{ admin1.toUpperCase() }}
                </div>
              </div>
              <div class="headlines-hseparator" />
              <!-- ADMIN2 -->
              <!-- <div class="tk-camp-infos-field">
                <div class="tk-camp-infos-field-key">
                  {{ $t("infosAdmin2").toUpperCase() }}
                </div>
                <div class="tk-camp-infos-field-value">
                  {{ admin2.toUpperCase() }}
                </div>
              </div>
              <div class="headlines-hseparator" /> -->
              <!-- GPS COORDINATES -->
              <!-- <div class="tk-camp-infos-field">
                <div class="tk-camp-infos-field-key">
                  {{ $t("site.infosCoordinates").toUpperCase() }}
                </div>
                <div class="tk-camp-infos-field-value">
                  {{ coordinates.toUpperCase() }}
                </div>
              </div>
              <div class="headlines-hseparator" />
              <div class="tk-camp-infos-field">
                <div class="tk-camp-infos-field-key">
                  {{ $t("manageBy").toUpperCase() }}
                </div>
                <div class="tk-camp-infos-field-value">
                  {{ manageBy.toUpperCase() }}
                </div>
              </div> -->
            </div>
          </div>
        </div>
        <div class="headlines-right"></div>
      </div>
      <div class="content"></div>
      <div class="footer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { TKOpsmapConfiguration } from "@/domain";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { Component, Vue, Prop } from "vue-property-decorator";
import { TKSubmissionVisualizerOptions } from "./TKSubmissionVisualizer";
import { toTitleCase } from "@/domain/ui/TKStringUtils";
import { TKCampTypesValues } from "@/domain/survey/TKCampDescription";
import { TKSubmissionEntryText } from "@/domain/survey/TKSubmissionEntryText";
import jsPDF from "jspdf";
import { TKComputeExportFilename } from "@/domain/export/TKExportCommon";

@Component({
  components: {}
})
export default class TKCampToolbar extends Vue {
  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;

  @Prop()
  readonly dataset!: TKDatasetFilterer;

  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  // Global infos
  appName = "";
  siteName = "";
  date = "";

  // Camp infos
  admin1 = "-";
  admin2 = "-";
  siteType = "-";
  coordinates = "-";
  manageBy = "";

  mounted() {
    if (this.appConfig && this.dataset && this.dataset.currentCamp) {
      this.appName = TKGetLocalValue(
        this.appConfig.name,
        this.$root.$i18n.locale
      ).toUpperCase();
      this.siteName = toTitleCase(this.dataset.currentCamp.name.toUpperCase());
      this.date = this.dataset.currentDate;
      this.admin1 = this.dataset.currentCamp.admin1.name;
      this.admin2 = this.dataset.currentCamp.admin2.name;
      if (this.dataset.currentCamp.type === TKCampTypesValues.PLANNED) {
        this.siteType = this.$root.$i18n
          .t("infosSitePlanned")
          .toString()
          .toUpperCase();
      } else {
        this.siteType = this.$root.$i18n
          .t("infosSiteSpontanneous")
          .toString()
          .toUpperCase();
      }
      // TODO  move this comutation elsewhere
      const manageByLabel = (this.dataset.currentSubmission?.thematics[
        "group_cccm"
      ]?.data?.find(
        item => item.field === "cccm_shelter__mangmt"
      ) as TKSubmissionEntryText)?.answerLabel ?? { en: "-" };
      this.manageBy = TKGetLocalValue(manageByLabel, this.$root.$i18n.locale);

      this.coordinates =
        this.dataset.currentCamp.lat + "," + this.dataset.currentCamp.lng;
    }

    console.log("After render!");
    const documentTitle = TKComputeExportFilename(this.dataset, "pdf");
    const pdf = new jsPDF();
    this.$nextTick(function() {
      const divContent = this.$refs["pdf-document"] as HTMLElement;
      pdf
        .html(divContent, {
          x: 0,
          y: 0
        })
        .then(() => {
          pdf.save(documentTitle);
        });
    });
  }
}
</script>

<style scoped>
.pdf-document {
  background-color: #fff;
  max-width: 21cm;
  padding: 0.5cm;
}
.pdf-document-content {
  display: flex;
  flex-flow: column nowrap;
  row-gap: 0.3cm;
}

.header {
  height: 1cm;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

/* HEADER ************************************************************/
.header-separator {
  /* height: 0.1cm;
            border: 0;
            box-shadow: inset 0 0.1cm 0.1cm -0.1cm #428fdf88; */
  border: 0;
  height: 0;
  border-top: 1px solid #428fdf22;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.header-left {
  /* background-color: #fff; */
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 100%;
}
.header-opsmap-logo {
  text-decoration: none;
  width: 1cm;
  height: 1cm;
}
.header-opsmap-title {
  color: #428fdf;
  letter-spacing: 1.5;
  font-weight: 700;
  font-size: 18px;
  text-align: left;
  margin-right: 0.3cm;
}

.header-opsmap-date .header-opsmap-subtitle {
  color: #333333;
  letter-spacing: 1.5;
  font-weight: 700;
  font-size: 18px;
  text-align: left;
}

.header-center {
  flex-grow: 2;
  text-align: center;
}

.header-right {
  flex-flow: row nowrap;
  justify-content: right;
  height: 1cm;
}
.header-cccm-logo {
  text-decoration: none;
  height: 1cm;
}

/* HEADLINES *********************************************************/
.headlines {
  width: 100%;
}

.headlines-left-infos {
  width: 8cm;
}

.tk-camp-subtitle {
  color: var(--v-campTitle-base);
  font-size: 30px;
  line-height: 1.467;
}

.tk-title-base {
  color: #428fdf;
  font-size: 30px;
}

.headlines-hseparator {
  width: 100%;
  border: 0;
  height: 0;
  border-top: 1px solid #99999922;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
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

/* CONTENT ***********************************************************/
.content {
  background-color: azure;
  width: 100%;
  height: 5cm;
}
.footer {
  background-color: bisque;
  width: 100%;
  height: 5cm;
}
</style>
