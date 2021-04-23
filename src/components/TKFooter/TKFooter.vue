<template lang="html">
  <div class="tk-footer flex">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-footer-disclaimer">
        <div class="tk-footer-disclaimer-title">
          <p>{{ $t("footer.moreInfos").toUpperCase() }}</p>
        </div>
        <div class="tk-footer-disclaimer-text">
          <p>
            {{ $t("footer.moreInfosText") }}
          </p>
        </div>
      </div>
    </transition>
    <div class="tk-footer-logos">
      <TKFooterLogoItem
        :title="$t('footer.partnerLed')"
        :logos="appConfig.footerLogos.clusterLed"
      />
      <TKFooterLogoItem
        :title="$t('footer.partnerCoordination')"
        :logos="appConfig.footerLogos.coordinationAndIMSupport"
      />
      <TKFooterLogoItem
        :title="$t('footer.partnerFieldwork')"
        :logos="appConfig.footerLogos.Fieldwork"
      />
      <TKFooterLogoItem
        :title="$t('footer.partnerWebdev')"
        :logos="appConfig.footerLogos.Webdev"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { TKOpsmapConfiguration } from "@/domain/opsmapConfig/TKOpsmapConfiguration";
import TKFooterLogoItem from "./TKFooterLogoItem.vue";

@Component({
  components: {
    TKFooterLogoItem
  }
})
export default class TKFooter extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;
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
  column-gap: 84px;
  padding-top: 42px;
  padding-bottom: 42px;
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
}

.tk-footer-disclaimer-title {
  white-space: nowrap;
  font-weight: bold;
  font-size: 12px;
  color: var(--v-secondary-base);
  letter-spacing: 0.86px;
}

.tk-footer-disclaimer-text {
  font-size: 16px;
  color: var(--v-primary-base);
  line-height: 1.375;
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
