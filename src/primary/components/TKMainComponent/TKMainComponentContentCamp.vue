<template>
  <div>
    <TKSearchfield
      :label="$t('site.filter')"
      v-model="search"
      class="textfield-search"
    >
    </TKSearchfield>
    <TKSubmissionVisualizer />
  </div>
</template>

<script lang="ts">
import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";
import { Component, Vue } from "vue-property-decorator";
import { TKSubmissionVisualizer } from "./TKCampComponents";
import TKSearchfield from "@/primary/TKSearchField.vue";
@Component({
  components: {
    TKSubmissionVisualizer,
    TKSearchfield
  }
})
export default class TKMainComponentContentCamp extends Vue {
  get search(): string {
    return TKVisualizerOptionsModule.searchFilter;
  }
  set search(search: string) {
    TKVisualizerOptionsModule.setSearchFilter(search);
  }
}
</script>

<style scoped>
.textfield-search {
  margin-bottom: 20px;
}
</style>
