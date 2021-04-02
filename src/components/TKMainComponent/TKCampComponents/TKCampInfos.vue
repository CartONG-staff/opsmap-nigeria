<template>
  <div class="tk-camp-infos">
    <div v-for="info in this.campsInfos" :key="info" class="tk-camp-info">
      <div class="tk-camp-infos-field">
        <div class="tk-camp-infos-field-key">{{ info.key }}</div>
        <div class="tk-camp-infos-field-value">{{ info.value }}</div>
      </div>
      <div class="tk-hseparator" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TKCampSubtitle extends Vue {
  @Prop()
  readonly campsInfos = [
    { key: "PROSPER", value: "prosper" },
    { key: "HOP", value: "hop" },
    { key: "LA", value: "la" },
    { key: "BOUM", value: "boum" }
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
