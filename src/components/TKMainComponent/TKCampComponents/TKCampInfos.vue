<template>
  <div class="tk-camp-infos">
    <!-- STATE -->
    <div class="tk-camp-infos-field">
      <div class="tk-camp-infos-field-key">
        {{ $t("camp.infosState").toUpperCase() }}
      </div>
      <div class="tk-camp-infos-field-value">
        {{ state.toUpperCase() }}
      </div>
    </div>
    <div class="tk-hseparator" />
    <!-- LGA -->
    <div class="tk-camp-infos-field">
      <div class="tk-camp-infos-field-key">
        {{ $t("camp.infosLGA").toUpperCase() }}
      </div>
      <div class="tk-camp-infos-field-value">
        {{ lga.toUpperCase() }}
      </div>
    </div>
    <div class="tk-hseparator" />
    <!-- WARD -->
    <div class="tk-camp-infos-field">
      <div class="tk-camp-infos-field-key">
        {{ $t("camp.infosWard").toUpperCase() }}
      </div>
      <div class="tk-camp-infos-field-value">
        {{ name.toUpperCase() }}
      </div>
    </div>
    <div class="tk-hseparator" />
    <!-- GPS COORDINATES -->
    <div class="tk-camp-infos-field">
      <div class="tk-camp-infos-field-key">
        {{ $t("camp.infosCoordinates").toUpperCase() }}
      </div>
      <div class="tk-camp-infos-field-value">
        {{ coordinates.toUpperCase() }}
      </div>
    </div>
    <div class="tk-hseparator" />
    <!-- Manage BY -->
    <div class="tk-camp-infos-field">
      <div class="tk-camp-infos-field-key">
        {{ $t("camp.infosManageBy").toUpperCase() }}
      </div>
      <div class="tk-camp-infos-field-value">
        {{ manageby.toUpperCase() }}
      </div>
    </div>
    <div class="tk-hseparator" />
  </div>
</template>

<script lang="ts">
import { TKCampDescription } from "@/domain/core/TKCampDescription";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class TKCampInfos extends Vue {
  @Prop()
  readonly camp!: TKCampDescription;

  state = "";
  lga = "";
  name = "";
  coordinates = "";
  manageby = "";

  @Watch("camp", { immediate: true })
  onChange() {
    this.state = "";
    this.lga = "";
    this.name = this.camp ? this.camp.name : "";
    this.coordinates = this.camp
      ? this.camp.coordinates[0] + "," + this.camp.coordinates[1]
      : "";
    this.manageby = "";
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
