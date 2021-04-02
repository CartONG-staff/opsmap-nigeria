<template lang="html">
  <div class="tk-survey-thematic">
    <div class="tk-survey-thematic-title">
      <div>{{ title }}</div>
      <img class="tk-survey-icon" :src="icon_url" />
    </div>
    <div class="tk-survey-thematic-content"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { TKIconUrl } from "@/domain/UI/TKIcons";

@Component
export default class TKSurveyThematic extends Vue {
  @Prop()
  readonly title!: string;

  @Prop()
  readonly icon_name!: string;
  icon_url = TKIconUrl(this.icon_name);

  // iconUrl = ;
}
</script>

<style scoped>
.tk-survey-thematic {
  background-color: aquamarine;
  border-radius: 15px;
  min-height: 100px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: 100%;
  padding: 20px;
}

.tk-survey-thematic-title {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
}

.tk-survey-icon {
  align-self: flex-start;
  height: 36px;
  display: block;
}
</style>
