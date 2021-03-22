<template>
  <div class="tk-homepage-moreinfos">
    <div class="tk-homepage-moreinfos-title">More Infos</div>
    <div class="tk-homepage-moreinfos-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TKHomePageIndicators extends Vue {}
</script>

<style scoped>
.tk-homepage-moreinfos {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  border: 5px solid #f2f2f2;
  background-color: white;
  width: 100%;
  padding: var(--padding-large);
  padding-top: 45px;
  padding-left: 45px;
  font-size: 20px;
}

.tk-homepage-moreinfos-title {
  width: 30%;
}

.tk-homepage-moreinfos-content {
  width: 65%;
}
</style>
