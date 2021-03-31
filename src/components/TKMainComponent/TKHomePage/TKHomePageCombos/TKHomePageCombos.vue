<template>
  <div class="tk-homepage-combos">
    <p class="tk-homepage-combos-title">
      {{ $t("home.combosTitle") }}
    </p>
    <v-combobox
      class="tk-home-select"
      color="discrete"
      item-color="quaternary"
      flat
      dense
      :ripple="false"
      :placeholder="$t('home.comboStatePlaceholder')"
    ></v-combobox>
    <v-combobox
      class="tk-home-select"
      color="discrete"
      dense
      :ripple="false"
      :placeholder="$t('home.comboLGAPlaceholder')"
    ></v-combobox>
    <v-combobox
      class="tk-home-select"
      color="discrete"
      dense
      :ripple="false"
      :placeholder="$t('home.comboCampPlaceholder')"
    ></v-combobox>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/TKGeneralConfiguration";

@Component({})
export default class TKHomePageCombos extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-homepage-combos {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: middle;
}

.tk-homepage-combos-title {
  color: var(--v-sectionTitle-base);
  letter-spacing: 0.86px;
  font-size: 12px;
}
</style>
