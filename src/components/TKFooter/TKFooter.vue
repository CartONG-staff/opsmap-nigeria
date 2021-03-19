<template lang="html">
  <v-footer padless :absolute="true">
    <div class="tk-footer flex">
      <div class="tk-footer-disclaimer">
        <div class="tk-footer-disclaimer-title">
          <p>
            More informations
          </p>
        </div>
        <div class="tk-footer-disclaimer-text">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
      <div class="tk-footer-logos">
        <TKFooterLogoItem
          title="Cluster Led by"
          :logos="appConfig.footerLogos.clusterLed"
        />
        <TKFooterLogoItem
          title="Coordination and IM support by"
          :logos="appConfig.footerLogos.coordinationAndIMSupport"
        />
        <TKFooterLogoItem
          title="Fieldwork by"
          :logos="appConfig.footerLogos.Fieldwork"
        />
        <TKFooterLogoItem
          title="Webdev by"
          :logos="appConfig.footerLogos.Webdev"
        />
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { GeneralConfiguration } from "@/domain/TKGeneralConfiguration";
import TKFooterLogoItem from "./TKFooterLogoItem.vue";

@Component({
  components: {
    TKFooterLogoItem,
  },
})
export default class TKFooter extends Vue {
  @Prop()
  readonly appConfig!: GeneralConfiguration;
}
</script>

<style scoped>
.tk-footer {
  background-color: var(--v-background-base);
  display: flex;
  flex-flow: column wrap;
}

.tk-footer-disclaimer {
  background-color: var(--v-sectionBGSecondary-base);
  display: flex;
  flex-flow: row nowrap;
  column-gap: var(--padding-large);
  padding-top: var(--padding-large);
  padding-bottom: var(--padding-large);
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
}

.tk-footer-disclaimer-title {
  color: var(--v-sectionTitleSecondary-base);
  white-space: nowrap;
}

.tk-footer-disclaimer-text {
  color: var(--v-primary-base);
  text-align: justify;
  text-justify: inter-word;
}

.tk-footer-logos {
  display: flex;
  flex-flow: row wrap;
  /* column-gap: var(--padding-large); */
  justify-content: space-between;
  vertical-align: middle;
  padding-bottom: var(--padding-large);
  padding-top: var(--padding-large);
  padding-bottom: var(--padding-large);
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
}
</style>
