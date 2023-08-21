<template lang="html">
  <transition mode="out-in" name="fade">
    <div :key="$root.$i18n.locale" class="tk-site-selector">
      <div v-if="dataset.surveys.length > 1">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
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
              v-bind="attrs"
              v-on="on"
            ></v-autocomplete>
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
      </div>

      <v-tooltip
        v-for="filter in additionalFilters"
        :key="filter.description.field"
        top
      >
        <template v-slot:activator="{ on, attrs }">
          <div multiple v-on="on" v-bind="attrs">
            <v-autocomplete
              class="tk-autocomplete"
              flat
              dense
              clearable
              :label="getLocalValue(filter.description.name)"
              :items="filter.candidates"
              :value="filter.filterValues"
              @input="additionalFilterChanged(filter, $event)"
              :item-text="item => getLocalValue(item)"
              return-object
              multiple
            ></v-autocomplete>
          </div>
        </template>
        <span
          >{{ $t("selectText") }}
          {{ getLocalValue(filter.description.name) }}</span
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
            :filter="filterAdmin"
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

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
            class="tk-autocomplete"
            flat
            dense
            :label="$t('infosSite')"
            v-model="dataset.currentSite"
            :items="dataset.filteredTypedSitesList"
            :disabled="!dataset.filteredTypedSitesList.length"
            :filter="filterSite"
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
            $t("infosSite")
              .toString()
              .toLowerCase()
          }}
        </span>
      </v-tooltip>
    </div>
  </transition>
</template>

<script lang="ts">
import { TKAdminLevel } from "@/domain/opsmapConfig/TKAdminLevel";
import { TKAdditionalFilter } from "@/domain/survey/TKAdditionalFilter";
import { TKBoundaries } from "@/domain/survey/TKBoundaries";
import { TKSite } from "@/domain/survey/TKSite";
import { TKGetLocalValue, TKLabel } from "@/domain/utils/TKLabel";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class TKSiteSelector extends Vue {
  get currentLocale() {
    return this.$i18n.locale;
  }

  getLocalValue(label: TKLabel) {
    return TKGetLocalValue(label, this.$i18n.locale);
  }

  filterAdmin(item: TKBoundaries, queryText: string): boolean {
    return (
      item.pcode.toLowerCase().includes(queryText.toLowerCase()) ||
      item.name.toLowerCase().includes(queryText.toLowerCase())
    );
  }
  filterSite(item: TKSite, queryText: string): boolean {
    return (
      item.id.toLowerCase().includes(queryText.toLowerCase()) ||
      item.name.toLowerCase().includes(queryText.toLowerCase())
    );
  }

  get dataset() {
    return TKDatasetModule.dataset;
  }

  get levels(): Array<TKAdminLevel> {
    return TKConfigurationModule.configuration.spatial.adminLevels;
  }

  get currentAdmins() {
    return this.dataset.currentAdmins;
  }

  currentAdminsChanged(level: TKAdminLevel, value: TKBoundaries | null) {
    this.dataset.setCurrentAdmin(level, value);
  }

  get additionalFilters(): TKAdditionalFilter[] {
    return this.dataset.additionalFilters;
  }

  additionalFilterChanged(filter: TKAdditionalFilter, value: TKLabel[] | null) {
    if (!value) {
      filter.filterValues = [];
    } else {
      filter.filterValues = value;
    }

    this.dataset.setAdditionalFilter(filter);
  }

  get filteredAdminList() {
    return this.dataset.filteredAdminList;
  }
}
</script>
<style scoped>
.tk-site-selector {
  border-radius: 8px;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  width: 100%;
  height: 100%;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 12px;
  display: flex;
  flex-flow: row wrap;
  row-gap: 24px;
  justify-content: space-evenly;
}

.tk-autocomplete {
  opacity: 1 !important;

  margin: 0 15px;
  height: 30px;
}
</style>
