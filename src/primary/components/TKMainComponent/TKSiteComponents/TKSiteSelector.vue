<template lang="html">
  <transition mode="out-in" name="fade">
    <div :key="$root.$i18n.locale" class="tk-site-selector">
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
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
            class="tk-autocomplete"
            flat
            dense
            :label="$t('infosAdmin1')"
            v-model="currentAdmin1"
            :items="filteredAdmin1List"
            :disabled="!filteredAdmin1List || !filteredAdmin1List.length"
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
            $t("infosAdmin1")
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
            :label="$t('infosAdmin2')"
            v-model="currentAdmin2"
            :items="filteredAdmin2List"
            :disabled="!filteredAdmin2List || !filteredAdmin2List.length"
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
            $t("infosAdmin2")
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
          }}</span
        >
      </v-tooltip>
    </div>
  </transition>
</template>

<script lang="ts">
import { TKAdminLevel } from "@/domain/opsmapConfig/TKAdminLevel";
import { TKBoundaries } from "@/domain/survey/TKBoundaries";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class TKSiteSelector extends Vue {
  get dataset() {
    return TKDatasetModule.dataset;
  }

  get currentAdmin1() {
    return this.dataset.getCurrentAdmin(TKAdminLevel.ADMIN1);
  }
  set currentAdmin1(item: TKBoundaries | null) {
    this.dataset.setCurrentAdmin(TKAdminLevel.ADMIN1, item);
  }

  get filteredAdmin1List() {
    return this.dataset.getFilteredAdminList(TKAdminLevel.ADMIN1);
  }

  get currentAdmin2() {
    return this.dataset.getCurrentAdmin(TKAdminLevel.ADMIN2);
  }
  set currentAdmin2(item: TKBoundaries | null) {
    this.dataset.setCurrentAdmin(TKAdminLevel.ADMIN2, item);
  }
  get filteredAdmin2List() {
    return this.dataset.getFilteredAdminList(TKAdminLevel.ADMIN2);
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
  width: 20%;
  margin: 0 15px;
  height: 30px;
  min-width: 200px;
}
</style>
