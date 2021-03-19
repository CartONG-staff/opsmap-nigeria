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
      <div class="tk-footer-logos-container">
        <div class="tk-footer-logos">
          <div
            v-for="items in appConfig.footerLogo"
            :key="items.name"
            class="tk-footer-logos-item"
          >
            <a :href="items.urlRedirection" target="_blank">
              <img
                :src="items.urlLogo"
                :alt="items.name"
                class="tk-footer-logos-item-logo"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { GeneralConfiguration } from "@/domain/TKGeneralConfiguration";

@Component
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
  background-color: red;
  display: flex;
  flex-flow: row wrap;
  column-gap: 50px;
  justify-content: center;
  vertical-align: middle;
}

.tk-footer-logos-item-logo {
  background-color: green;
  height: 40px;
  vertical-align: middle;
}
</style>
