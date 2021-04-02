<template>
  <div class="tk-home-combos">
    <p class="tk-home-combos-title">
      {{ $t("home.combosTitle") }}
    </p>
    <v-autocomplete
      class="tk-home-select"
      flat
      dense
      :placeholder="$t('home.comboStatePlaceholder')"
      :items="['Braaaaazil', 'Arjentina', 'Coloombia']"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-home-select"
      flat
      dense
      :placeholder="$t('home.comboLGAPlaceholder')"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-home-select"
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

<style>
.tk-home-combos input {
  color: #000 !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 16px !important;
}

.tk-home-combos input::placeholder {
  color: #000 !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 16px !important;
}

.tk-home-combos .theme--light.v-icon {
  color: #d8d8d8 !important;
}

.tk-home-combos .v-input__slot {
  border-color: #d8d8d8 !important;
  transition: none !important;
}

.tk-home-combos .v-input__slot:before {
  border-color: #d8d8d8 !important;
  transition: none !important;
}

.tk-home-combos .v-input__slot:after {
  border-color: #d8d8d8 !important;
  transition: none !important;
}
</style>
