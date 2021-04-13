<template lang="html">
  <div class="tk-survey-thematic-container">
    <div class="tk-survey-thematic-header">
      <div class="tk-survey-thematic-title">{{ title }}</div>
      <img class="tk-survey-icon" :src="iconurl" />
    </div>
    <div class="tk-survey-thematic-content">
      <div v-for="(item, key) in dataFiltered" :key="item.id">
        <div v-if="key !== 0" class="tk-hseparator"></div>
        <TKSurveyItem :item="item" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import TKSurveyItem from "./TKSurveyItem.vue";
import { TKSubmission } from "@/domain/core/TKSubmission";
import { TKSubmissionItem } from "@/domain/core/TKSubmissionItem";

@Component({
  components: {
    TKSurveyItem
  }
})
export default class TKSurveyThematic extends Vue {
  @Prop()
  readonly survey!: TKSubmission;

  dataFiltered: TKSubmissionItem[] = [];

  title = "";
  iconurl = "";
  @Watch("survey", { immediate: true })
  onSurveychanged() {
    this.handleLocaleOnTitle();
    this.iconurl = TKIconUrl(this.survey.icon_file_name as string);
    this.dataFiltered = this.survey.data.filter(
      (item: TKSubmissionItem) => item.answerLabel_en !== ""
    );
  }

  @Watch("$root.$i18n.locale", { immediate: true })
  handleLocaleOnTitle() {
    if (this.$root.$i18n.locale == "pt" && this.survey.thematic_label_pt) {
      this.title = this.survey.thematic_label_pt;
    } else {
      this.title = this.survey.thematic_label_en;
    }
  }
}
</script>

<style scoped>
.tk-survey-thematic-container {
  border-radius: 15px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  border: 3px solid #f1f3f3;
  width: 100%;
  background-color: #f1f3f3;
  overflow: hidden;
}

.tk-survey-thematic-header {
  padding: 0px 20px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  background-color: #fff;
}

.tk-survey-thematic-title {
  font-size: 16px;
  font-weight: bolder;
  color: var(--v-quaternary-base);
}

.tk-survey-chart {
  margin-bottom: 13px;
  margin-top: 13px;
}

.tk-survey-icon {
  height: 36px;
  display: block;
}

.tk-survey-thematic-content {
  padding: 0px 20px;
  width: 100%;
}

.tk-hseparator {
  background-color: #d8d8d8;
  height: 1px;
  width: 100%;
}
</style>
