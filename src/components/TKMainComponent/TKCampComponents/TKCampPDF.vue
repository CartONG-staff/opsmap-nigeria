<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <img src="@/assets/LogoOpsmap.png" class="header-opsmap-logo" />
        <h3>
          <span class="header-opsmap-title">DEMO</span>
          <span class="header-opsmap-subtitle">Nova Canaã - 05/07/21</span>
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
            Site Tracker
          </span>
        </div>
        <div class="headlines-left-infos"></div>
      </div>
      <div class="headlines-right"></div>
    </div>
    <div class="content"></div>
    <div class="footer"></div>
  </div>
</template>

<script lang="ts">
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { Component, Vue, Prop } from "vue-property-decorator";
import { TKSubmissionVisualizerOptions } from "./TKSubmissionVisualizer";

@Component({
  components: {}
})
export default class TKCampToolbar extends Vue {
  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;

  @Prop()
  readonly dataset!: TKDatasetFilterer;
}
</script>

<style scopde>
.container {
  background-color: red;
  display: flex;
  flex-flow: column nowrap;
  padding: 0.5cm;
  font-family: "Arial";
}

.header {
  display: flex;
  flex-flow: row nowrap;
  padding-left: 0.5cm;
  padding-right: 0.5cm;
  background-color: #fff;
  height: 1.3cm;
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
  background-color: aqua;
  width: 100%;
  height: 5cm;
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
