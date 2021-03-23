<template>
  <div class="tk-homepage-combos">
    <p class="tk-homepage-combos-title">
      {{ $t("home.combosTitle") }}
    </p>
    <v-combobox :placeholder="$t('home.comboStatePlaceholder')"></v-combobox>
    <v-combobox :placeholder="$t('home.comboLGAPlaceholder')"></v-combobox>
    <v-combobox :placeholder="$t('home.comboCampPlaceholder')"></v-combobox>
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
  font-size: 20px;
  color: var(--v-sectionTitle-base);
}
</style>
