<template>
  <transition mode="out-in" name="fade">
    <div :key="$root.$i18n.locale" class="tk-home-combos">
      <transition mode="out-in" name="fade-in">
        <p :key="$root.$i18n.locale" class="tk-home-combos-title">
          {{
            $t("home.combosTitle")
              .toString()
              .toUpperCase()
          }}
        </p>
      </transition>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <div multiple v-on="on" v-bind="attrs">
            <v-autocomplete
              class="tk-autocomplete"
              flat
              dense
              :label="$t('survey')"
              v-model="dataset.currentSurvey"
              :items="dataset.surveys"
              item-text="name"
              :disabled="dataset.surveys.length < 2"
              return-object
            ></v-autocomplete>
          </div>
        </template>
        <span
          >{{ $t("selectText") }}
          {{
            $t("survey")
              .toString()
              .toLowerCase()
          }}</span
        >
      </v-tooltip>

      <v-tooltip v-for="level in levels" :key="level" top>
        <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
            class="tk-autocomplete"
            flat
            dense
            :label="$t(`infosAdmins.${level}`)"
            :value="currentAdmins[level]"
            @input="currentAdminsChanged(level, $event)"
            :items="filteredAdminList[level]"
            :disabled="!filteredAdminList[level]"
            item-text="name"
            return-object
            clearable
            v-bind="attrs"
            v-on="on"
          ></v-autocomplete>
        </template>
        <span
          >{{ $t("selectText") }}
          {{
            $t(`infosAdmins.${level}`)
              .toString()
              .toLowerCase()
          }}</span
        >
      </v-tooltip>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <div multiple v-on="on" v-bind="attrs">
            <v-autocomplete
              class="tk-autocomplete"
              flat
              dense
              clearable
              :label="$t('infosSite')"
              v-model="dataset.currentSite"
              :items="dataset.filteredTypedSitesList"
              item-text="name"
              return-object
            ></v-autocomplete>
          </div>
        </template>
        <span
          >{{ $t("selectText") }}
          {{
            $t("infosSite")
              .toString()
              .toLowerCase()
          }}</span
        >
      </v-tooltip>
    </div>
  </transition>
</template>

<script lang="ts">
import { TKAdminLevel } from "@/domain/opsmapConfig/TKAdminLevel";
import { TKBoundaries } from "@/domain/survey/TKBoundaries";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class TKHomeCombos extends Vue {
  get dataset() {
    return TKDatasetModule.dataset;
  }

  get levels(): Array<TKAdminLevel> {
    return TKConfigurationModule.configuration.adminLevels;
  }

  get currentAdmins() {
    return this.dataset.currentAdmins;
  }

  currentAdminsChanged(level: TKAdminLevel, value: TKBoundaries | null) {
    this.dataset.setCurrentAdmin(level, value);
  }

  get filteredAdminList() {
    return this.dataset.filteredAdminList;
  }
}
</script>

<style scoped>
.tk-home-combos {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: middle;
  row-gap: 6px;
  position: relative;
}

.tk-home-combos-title {
  color: var(--v-sectionTitle-base);
  letter-spacing: 0.86px;
  font-size: 12px;
}

.tk-autocomplete {
  position: relative;
}
</style>
