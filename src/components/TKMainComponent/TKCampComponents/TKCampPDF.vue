<template>
  <div class="pdf-document" ref="pdf-document">
    <div class="pdf-document-content">
      <div class="header">
        <div class="header-left">
          <img src="@/assets/LogoOpsmap.png" class="header-logo" />
          <h3>
            <span class="header-opsmap-title">{{ appName }}</span>
          </h3>
        </div>
        <div class="header-right">
          <img src="@/assets/LogoCluster.png" class="header-logo" />
        </div>
      </div>
      <div class="header-separator"></div>
      <div class="headlines">
        <div class="headlines-left">
          <div class="headlines-title">{{ siteName }} - {{ date }}</div>
          <div class="headlines-infos">
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
              <div class="tk-camp-infos-field">
                <div class="tk-camp-infos-field-key">
                  {{ $t("infosAdmin2").toUpperCase() }}
                </div>
                <div class="tk-camp-infos-field-value">
                  {{ admin2.toUpperCase() }}
                </div>
              </div>
              <div class="headlines-hseparator" />
              <!-- GPS COORDINATES -->
              <div class="tk-camp-infos-field">
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
              </div>
            </div>
          </div>
        </div>
        <div class="headlines-right">
          <img class="headlines-map-img" :src="mapImg" />
        </div>
      </div>
      <div class="header-separator"></div>
      <div class="indicators">
        <div class="indicator" />
        <div class="indicator" />
        <div class="indicator" />
      </div>
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
import { LngLat } from "mapbox-gl";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import TKCampIndicators from "@/components/TKMainComponent/TKCampComponents/TKCampIndicators.vue";

@Component({
  components: {
    TKCampIndicators
  }
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

  //Img src
  mapImg = "";

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

      this.initMap();

      this.exportToPDF();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // Export to pdf
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  exportToPDF() {
    const documentTitle = TKComputeExportFilename(this.dataset, "pdf");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    this.$nextTick(function() {
      const divContent = this.$refs["pdf-document"] as HTMLElement;
      pdf
        .html(divContent, {
          x: 0,
          y: 0,
          margin: 0,
          html2canvas: { scale: 0.75 }
        })
        .then(() => {
          pdf.save(documentTitle);
        });
    });
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // map object management method
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  initMap(): void {
    if (this.dataset && this.dataset.currentCamp) {
      let staticMapUrl = "https://api.mapbox.com/";

      // Style
      staticMapUrl += "styles/v1/unhcr/ckok20x8h03ma18qp76mxi3u4/";

      // static
      staticMapUrl += "static/";

      // Marker
      let markerUrl = "";
      if (this.dataset.currentCamp.type === TKCampTypesValues.PLANNED) {
        markerUrl = encodeURIComponent(TKIconUrl("planned_site_selected"));
      } else {
        markerUrl = encodeURIComponent(TKIconUrl("spontaneous_site_selected"));
      }
      console.log(markerUrl);
      staticMapUrl += `url-${markerUrl}(${this.dataset.currentCamp.lng},${this.dataset.currentCamp.lat})/`;

      // Bounds
      const bounds = new LngLat(
        this.dataset.currentCamp.lng,
        this.dataset.currentCamp.lat
      )
        .toBounds(5000)
        .toArray();
      staticMapUrl += `[${bounds[0][0]},${bounds[0][1]},${bounds[1][0]},${bounds[1][1]}]/`;

      // Dimension
      staticMapUrl += "640x480@2x";

      // Token
      staticMapUrl += `?access_token=${this.appConfig.mapConfig.token}`;

      // Upadte img URL
      this.mapImg = staticMapUrl;
    }
  }
}
</script>

<style>
#headlines-map canvas {
  outline: 0 !important;
}
</style>

<style scoped>
/* A4 = 8.27x11.69" x 72points/inch = 595x842 points */
/* 595x842 points */
.pdf-document {
  background-color: #fff;
  padding: 5mm;
  width: 210mm;
  height: 296mm; /* Exact 297mm creates an extra blank page. */
}

.pdf-document-content {
  background-color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  row-gap: 3mm;
  overflow: hidden;
}

/* HEADER ************************************************************/

.header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

.header-logo {
  text-decoration: none;
  height: 15mm;
}

.header > div {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 100%;
}

.header-separator {
  /* height: 0.1pt;
            border: 0;
            box-shadow: inset 0 0.1pt 0.1pt -0.1pt #428fdf88; */
  border: 0;
  height: 0;
  border-top: 1px solid #428fdf22;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.header-opsmap-date .header-opsmap-subtitle {
  color: #333333;
  letter-spacing: 1;
  font-weight: 700;
  font-size: 14px;
  text-align: left;
}

/* HEADLINES *********************************************************/
.headlines {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

.headlines-title {
  margin-top: 5mm;
  margin-bottom: 5mm;
  color: #333333;
  font-size: 25px;
  font-weight: bold;
  line-height: 1.467;
}

.headlines-infos {
  width: 80mm;
}

.headlines-map-img {
  width: 100mm;
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
}

/* HEADLINES *********************************************************/
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

/* INDICATORS ********************************************************/
.indicators {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: top;
}

.indicators > * {
  background-color: #fff;
  /* box-shadow: 0 0 20px 2px rgba(18, 63, 98, 0.15); */
  border: 1px solid #99999922;

  height: 20mm;
  width: 60mm;
  /* display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top; */
  border-radius: 15px;
}

/* CONTENT ***********************************************************/
.content {
  background-color: azure;
  width: 100%;
  height: 50mm;
}
.footer {
  background-color: bisque;
  width: 100%;
  height: 50mm;
}
</style>
