<template>
  <div class="tk-home-combos">
    <p class="tk-home-combos-title">
      {{ $t("home.combosTitle").toUpperCase() }}
    </p>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('home.comboStatePlaceholder')"
      :items="['Braaaaazil', 'Arjentina', 'Coloombia']"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('home.comboLGAPlaceholder')"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      flat
      dense
      :placeholder="$t('home.comboCampPlaceholder')"
    ></v-autocomplete>
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
