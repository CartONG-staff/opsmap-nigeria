<template>
  <div class="tk-home-combos">
    <p class="tk-home-combos-title">
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
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";

@Component({})
export default class TKHomeCombos extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
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
