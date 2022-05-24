<template>
  <div class="tk-camp-toolbar">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-camp-toolbar-container">
        <v-autocomplete
          v-if="dataset.currentCamp"
          key="1"
          class="tk-camp-toolbar-item"
          background-color="accent"
          color="background"
          :disabled="dataset.currentCamp.submissions.length < 2"
          flat
          filled
          solo
          dense
          height="44"
          v-model="dataset.currentSubmission"
          :items="dataset.currentCamp.submissions"
          item-text="date"
          return-object
          :prefix="$t('site.datePreffix').toUpperCase()"
        ></v-autocomplete>
        <v-autocomplete
          v-else
          key="2"
          class="tk-camp-toolbar-item-disabled"
          background-color="accent"
          color="background"
          disabled
          readonly
          flat
          filled
          solo
          dense
          height="44"
        ></v-autocomplete>
      </div>
    </transition>

    <TKCampToolbarExportButton class="tk-camp-toolbar-container" />
    <v-tooltip top>
      <template v-slot:activator="{ on: tooltip, attrs }">
        <v-btn-toggle rounded class="tk-camp-toolbar-toggle">
          <v-btn
            icon
            height="44"
            width="44"
            color="accent"
            :disabled="!dataset.currentCamp"
            v-bind="attrs"
            v-on="tooltip"
            v-model="showVisualizerOptions"
            class="tk-camp-toolbar-toggle-button"
          >
            <v-icon dark>
              mdi-tune-vertical-variant
            </v-icon>
          </v-btn>
        </v-btn-toggle>
      </template>
      <span>Toggle toolbar </span>
    </v-tooltip>
    <!-- <v-btn-toggle class="tk-camp-toolbar-toggle">
      <v-btn
        class="toggle-button"
        v-model="hideUnanswered"
        color="#919191"
        plain
      >
        <v-icon left></v-icon>
      </v-btn>
    </v-btn-toggle> -->

    <!-- <v-menu
      :offset-y="true"
      :close-on-content-click="false"
      class="tk-camp-toolbar-kebab"
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip top>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              icon
              small
              color="accent"
              height="44"
              width="44"
              :disabled="!dataset.currentCamp"
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon dark>
                mdi-dots-vertical
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t("site.extraTools") }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item>
          <v-switch
            :label="$t('site.hideUnanswered')"
            color="accent"
            hide-details
            v-model="hideUnanswered"
          ></v-switch>
        </v-list-item>
        <v-list-item>
          <v-switch
            :label="$t('site.sortByTrafficLight')"
            color="accent"
            hide-details
            v-model="sortByTrafficLight"
          ></v-switch>
        </v-list-item>
      </v-list>
    </v-menu> -->
  </div>
</template>

<script lang="ts">
// TODO: remove commented lines
import { Component, Vue } from "vue-property-decorator";
import TKCampToolbarExportButton from "./TKCampToolbarExportButton.vue";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";

@Component({
  components: {
    TKCampToolbarExportButton
  }
})
export default class TKCampToolbar extends Vue {
  get hideUnanswered() {
    return TKVisualizerOptionsModule.hideUnanswered;
  }

  set hideUnanswered(value: boolean) {
    TKVisualizerOptionsModule.setHideUnanswered(value);
  }

  get sortByTrafficLight() {
    return TKVisualizerOptionsModule.sortByTrafficLigh;
  }

  set sortByTrafficLight(value: boolean) {
    TKVisualizerOptionsModule.setSortByTrafficLight(value);
  }

  get showVisualizerOptions() {
    return TKVisualizerOptionsModule.showVisualizerOptions;
  }

  set showVisualizerOptions(value: boolean) {
    TKVisualizerOptionsModule.setShowVisualizerOptions(value);
  }

  get dataset() {
    return TKDatasetModule.dataset;
  }
}
</script>

<style>
.tk-camp-toolbar {
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  align-items: top;
  column-gap: 5px;
}

.tk-camp-toolbar-item.theme--light.v-input input {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar-item .v-icon.v-icon {
  color: #fff !important;
}

.tk-camp-toolbar-item .theme--light.v-icon.v-icon.v-icon--disabled {
  opacity: 1 !important;
}

.tk-camp-toolbar-item-disabled.v-input--is-disabled .v-input__slot {
  background-color: rgba(0, 0, 0, 0.12) !important;
}

.tk-camp-toolbar input::placeholder {
  color: #f1f3f3 !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar .v-text-field__suffix,
.tk-camp-toolbar .v-text-field__prefix {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.tk-camp-toolbar-toggle {
  height: 44px !important;
  width: 44px !important;
}

.tk-camp-toolbar-toggle .v-btn--active:not(:hover) {
  color: transparent !important;
}

.tk-camp-toolbar-toggle .v-btn > .v-btn__content > .v-icon {
  color: #919191 !important;
}
.tk-camp-toolbar-toggle .v-btn--active > .v-btn__content > .v-icon {
  color: var(--v-accent-base) !important;
}

.tk-camp-toolbar-toggle-button {
  height: 44px !important;
  width: 44px !important;
  min-width: 44px !important;
  border: none !important;
  padding: 0 !important;
}
</style>
