<template lang="html">
  <div class="tk-camp-selector">
    <v-autocomplete
      class="tk-autocomplete"
      color="discrete"
      dense
      :placeholder="$t('camp.comboSurveyPlaceholder')"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      color="discrete"
      dense
      :placeholder="$t('camp.comboStatePlaceholder')"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      color="discrete"
      dense
      :placeholder="$t('camp.comboLGAPlaceholder')"
    ></v-autocomplete>
    <v-autocomplete
      class="tk-autocomplete"
      color="discrete"
      dense
      :placeholder="$t('camp.comboCampPlaceholder')"
    ></v-autocomplete>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class TKCampSelector extends Vue {}
</script>

<style scoped>
.tk-camp-selector {
  background-color: #f0fbffcc;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  border-radius: 8px;
  height: 100%;
  align-items: center;
}

.tk-autocomplete {
  margin: 0 15px;
  height: 30px;
  width: 20%;
}
</style>
