<template>
  <div class="tk-camp-infos">
    <div v-for="info in campsInfos" :key="info.name" class="tk-camp-info">
      <div class="tk-camp-infos-field">
        <div class="tk-camp-infos-field-key">{{ info.name.toUpperCase() }}</div>
        <div class="tk-camp-infos-field-value">
          {{ info.longName.toUpperCase() }}
        </div>
      </div>
      <div class="tk-hseparator" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKCampInfos extends Vue {
  readonly campsInfos = [
    { name: "STATE", longName: "adamaya" },
    { name: "LGA", longName: "yola south " },
    { name: "WARD", longName: "ngurore" },
    { name: "GPS COORDINATES", longName: "12.233223, 12.233223" },
    { name: "SITE manage BY", longName: "name" }
  ];
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
