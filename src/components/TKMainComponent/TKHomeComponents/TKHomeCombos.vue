<template>
  <div class="tk-home-combos">
    <p class="tk-home-combos-title">
      {{ $t("home.combosTitle").toUpperCase() }}
    </p>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('selectText') + ' ' + $t('survey').toLowerCase()"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('selectText') + ' ' + $t('infosAdmin1').toLowerCase()"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('selectText') + ' ' + $t('infosAdmin2').toLowerCase()"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('selectText') + ' ' + $t('camp').toLowerCase()"
      :v-model="campModel"
      :items="campList"
      item-text="name"
      item-value="id"
      @change="campSelected"
    ></v-autocomplete>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/core/TKGeneralConfiguration";

import { TKCampDescription } from "@/domain/core/TKCampDescription";

@Component({})
export default class TKHomeCombos extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
  @Prop({ default: () => [] })
  readonly campList!: TKCampDescription[];

  // Hold the app current camp property
  @Prop()
  readonly currentCamp!: TKCampDescription;
  campModel = "";

  @Watch("currentCamp", { immediate: true })
  onChange() {
    this.campModel = this.currentCamp ? this.currentCamp.id : "";
  }

  // Hold the current camp at an app level
  // BEHAVIOR
  campSelected(campId: string) {
    if (campId) {
      this.$emit("camp-selection-changed", campId);
    } else {
      this.$emit("camp-selection-cleared");
    }
  }
}
</script>

<style scoped>
.tk-home-combos {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: middle;
}

.tk-home-combos-title {
  color: var(--v-sectionTitle-base);
  letter-spacing: 0.86px;
  font-size: 12px;
}
</style>
