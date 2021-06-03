<template lang="html">
  <div class="tk-iframe-container">
    <iframe id="tk-iframe" :src="url"></iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class TKIFrame extends Vue {
  @Prop()
  readonly url!: string;

  // resizeIFrameToFitContent(event: any): void {
  //   console.log(event);
  //   const iFrame = document.getElementById("tk-iframe") as HTMLIFrameElement;
  //   if (iFrame && iFrame.contentWindow) {
  //     iFrame.width = iFrame.contentWindow.document.body.scrollWidth.toString();
  //     iFrame.height = iFrame.contentWindow.document.body.scrollHeight.toString();
  //   }
  // }

  // mounted() {
  //   window.addEventListener("DOMContentLoaded", () => {
  //     console.log("DOMContentLoaded");
  //   });
  // }
}
</script>

<style scoped>
.tk-iframe-container {
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  min-height: 800px;
}

#tk-iframe {
  border: 2px solid #f1f3f3;
  box-sizing: border-box;
  flex-grow: 1;
  margin: 0;
  padding: 0;
}
</style>
