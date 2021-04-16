<template>
  <div class="tk-camp-infos">
    <!-- ADMIN1 -->
    <div class="tk-camp-infos-field">
      <div class="tk-camp-infos-field-key">
        {{ $t("infosAdmin1").toUpperCase() }}
      </div>
      <div class="tk-camp-infos-field-value">
        {{ admin1.toUpperCase() }}
      </div>
    </div>
    <div class="tk-hseparator" />
    <!-- ADMIN2 -->
    <div class="tk-camp-infos-field">
      <div class="tk-camp-infos-field-key">
        {{ $t("infosAdmin2").toUpperCase() }}
      </div>
      <div class="tk-camp-infos-field-value">
        {{ admin2.toUpperCase() }}
      </div>
    </div>
    <div class="tk-hseparator" />
    <!-- ADMIN3 -->
    <div class="tk-camp-infos-field">
      <div class="tk-camp-infos-field-key">
        {{ $t("infosAdmin3").toUpperCase() }}
      </div>
      <div class="tk-camp-infos-field-value">
        {{ admin3.toUpperCase() }}
      </div>
    </div>
    <div class="tk-hseparator" />
    <!-- GPS COORDINATES -->
    <div class="tk-camp-infos-field">
      <div class="tk-camp-infos-field-key">
        {{ $t("site.infosCoordinates").toUpperCase() }}
      </div>
      <div class="tk-camp-infos-field-value">
        {{ coordinates.toUpperCase() }}
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

  admin1 = this.camp.admin1.name;
  admin2 = this.camp.admin2.name;
  admin3 = this.camp.admin3.name;
  name = this.camp.name;
  coordinates = this.camp.coordinates[0] + "," + this.camp.coordinates[1];

  @Watch("camp")
  onChange() {
    this.admin1 = this.camp ? this.camp.admin1.name : "";
    this.admin2 = this.camp ? this.camp.admin2.name : "";
    this.admin3 = this.camp ? this.camp.admin3.name : "";
    this.name = this.camp ? this.camp.name : "";
    this.coordinates = this.camp
      ? this.camp.coordinates[0] + "," + this.camp.coordinates[1]
      : "";
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
