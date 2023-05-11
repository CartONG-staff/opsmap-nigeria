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

      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <div multiple v-on="on" v-bind="attrs">
            <v-autocomplete
              class="tk-autocomplete"
              flat
              dense
              :label="$t('infosAdmin1')"
              :items="filteredAdmin1List"
              item-text="name"
              v-model="currentAdmin1"
              return-object
              clearable
            ></v-autocomplete>
          </div>
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
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <div multiple v-on="on" v-bind="attrs">
            <v-autocomplete
              class="tk-autocomplete"
              flat
              dense
              :label="$t('infosAdmin2')"
              v-model="currentAdmin2"
              :items="filteredAdmin2List"
              item-text="name"
              return-object
              clearable
            ></v-autocomplete>
          </div>
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
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class TKHomeCombos extends Vue {
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
