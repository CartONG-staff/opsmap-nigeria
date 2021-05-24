<template lang="html">
  <div class="tk-powerbi-container">
    <iframe
      id="tk-powerbi"
      src="https://app.powerbi.com/view?r=eyJrIjoiZTRhOWVlOTgtYTk2MS00YmY3LWEyY2YtMGM1Y2MzODFjMmVjIiwidCI6ImU1YzM3OTgxLTY2NjQtNDEzNC04YTBjLTY1NDNkMmFmODBiZSIsImMiOjh9"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class TKPowerBI extends Vue {
  resizeIFrameToFitContent(event: any): void {
    console.log(event);
    const iFrame = document.getElementById("tk-powerbi") as HTMLIFrameElement;
    if (iFrame && iFrame.contentWindow) {
      iFrame.width = iFrame.contentWindow.document.body.scrollWidth.toString();
      iFrame.height = iFrame.contentWindow.document.body.scrollHeight.toString();
      console.log(iFrame.width + " x " + iFrame.height);
    }
  }

  mounted() {
    window.addEventListener("DOMContentLoaded", () => {
      console.log("DOMContentLoaded");
    });
  }
}
</script>

<style scoped>
.tk-powerbi-container {
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  min-height: 800px;
}

#tk-powerbi {
  border: 2px solid #f1f3f3;
  box-sizing: border-box;
  flex-grow: 1;
  margin: 0;
  padding: 0;
}
</style>
