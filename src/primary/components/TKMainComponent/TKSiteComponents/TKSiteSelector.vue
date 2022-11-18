<template lang="html">
  <transition mode="out-in" name="fade">
    <div :key="$root.$i18n.locale" class="tk-site-selector" :style="opacity">
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
            v-model="dataset.currentAdmin1"
            :items="dataset.filteredAdmin1List"
            :disabled="!dataset.filteredAdmin1List.length"
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
            v-model="dataset.currentAdmin2"
            :items="dataset.filteredAdmin2List"
            :disabled="!dataset.filteredAdmin2List.length"
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
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class TKSiteSelector extends Vue {
  get dataset() {
    return TKDatasetModule.dataset;
  }

  get opacity() {
    if (this.$vuetify.theme.dark) {
      return {
        "--opacity": 0.9
      };
    }

    return {
      "--opacity": 0.75
    };
  }
}
</script>
<style scoped>
.tk-site-selector {
  border-radius: 8px;
  align-items: center;
  background-color: var(--v-siteSelector-base);
  opacity: var(--opacity);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  box-shadow: 0 0 20px 2px rgba(58, 158, 211, 0.15);
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
  width: 20%;
  margin: 0 15px;
  height: 30px;
  min-width: 200px;
}
</style>