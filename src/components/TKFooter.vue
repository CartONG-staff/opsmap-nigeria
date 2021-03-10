<template lang="html">
  <v-footer padless :absolute="true">
    <div class="tk-footer flex">
      <div class="tk-footer-disclaimer">
        <p class="font-italic caption text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
        <p class="font-weight-medium text-center">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <div class="tk-footer-logos">
        <div
          v-for="{ name, urlLogo, urlRedirection } in partners"
          :key="name"
          class="tk-footer-logos-item"
        >
          <a :href="urlRedirection" target="_blank">
            <img :src="urlLogo" :alt="name" class="tk-footer-logos-item-logo" />
          </a>
        </div>
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts">
import TKPartnerInfos from "@/domain/TKPartnerInfos";
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class TKFooter extends Vue {
  @Prop({
    default: () => []
  })
  readonly partners!: Array<TKPartnerInfos>;
}
</script>

<style scoped>
.tk-footer {
  background-color: antiquewhite;
  display: flex;
  flex-flow: column wrap;
  vertical-align: middle;
}

.tk-footer-logos {
  display: flex;
  flex-flow: row wrap;
  column-gap: 50px;
  justify-content: center;
}

.tk-footer-logos-item-logo {
  height: 50px;
}
</style>
