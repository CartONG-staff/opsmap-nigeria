<template lang="html">
  <div class="tk-submission-thematic-container">
    <div class="tk-submission-thematic-header">
      <div class="tk-submission-thematic-title">{{ title }}</div>
      <img class="tk-submission-icon" :src="iconurl" />
    </div>
    <div class="tk-submission-thematic-content">
      <div
        v-for="(entry, key) in thematicData"
        :key="entry.id"
        v-show="
          !options.hideUnanswered ||
            (options.hideUnanswered && entry.isAnswered())
        "
      >
        <div v-if="key !== 0" class="tk-hseparator"></div>
        <TKSubmissionEntryView :entry="entry" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import TKSubmissionEntryView from "./TKSubmissionEntryView.vue";
import { TKSubmissionThematic } from "@/domain/core/TKSubmissionThematic";
import { TKSubmissionEntry } from "@/domain/core/TKSubmissionEntry";
import { TKSubmissionVisualizerOptions } from "./TKSubmissionVisualizerOptions";

@Component({
  components: {
    TKSubmissionEntryView
  }
})
export default class TKSubmissionThematicView extends Vue {
  @Prop()
  readonly submissionThematic!: TKSubmissionThematic;

  thematicData!: TKSubmissionEntry[];

  @Prop()
  readonly options!: TKSubmissionVisualizerOptions;

  title = "";
  iconurl = "";
  @Watch("submissionThematic", { immediate: true })
  onSubmissionThematicchanged() {
    if (this.submissionThematic) {
      this.handleLocaleOnTitle();
      this.iconurl = TKIconUrl(
        this.submissionThematic.icon_file_name as string
      );
    } else {
      this.iconurl = "";
    }
    this.applyOptions();
  }

  @Watch("$root.$i18n.locale", { immediate: true })
  handleLocaleOnTitle() {
    if (this.submissionThematic) {
      if (
        this.$root.$i18n.locale === "pt" &&
        this.submissionThematic.thematic_label_pt
      ) {
        this.title = this.submissionThematic.thematic_label_pt;
      } else {
        this.title = this.submissionThematic.thematic_label_en;
      }
    } else {
      this.title = "";
    }
  }

  @Watch("options", { immediate: true, deep: true })
  applyOptions() {
    // Filter if needed
    if (this.submissionThematic) {
      this.thematicData = this.options.hideUnanswered
        ? this.submissionThematic.data
        : this.submissionThematic.data;
    } else {
      this.thematicData = [];
    }
  }

  shouldShow() {}
}
</script>

<style scoped>
.tk-submission-thematic-container {
  border-radius: 15px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  border: 3px solid #f1f3f3;
  width: 100%;
  background-color: #f1f3f3;
  overflow: hidden;
}

.tk-submission-thematic-header {
  padding: 0px 20px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  background-color: #fff;
}

.tk-submission-thematic-title {
  font-size: 16px;
  font-weight: bolder;
  color: var(--v-quaternary-base);
}

.tk-submission-chart {
  margin-bottom: 13px;
  margin-top: 13px;
}

.tk-submission-icon {
  height: 36px;
  display: block;
}

.tk-submission-thematic-content {
  padding: 0px 20px;
  width: 100%;
}

.tk-hseparator {
  background-color: #d8d8d8;
  height: 1px;
  width: 100%;
}
</style>
