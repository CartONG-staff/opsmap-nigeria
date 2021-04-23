<template lang="html">
  <div class="tk-footer-logos-item-container">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-footer-logos-item-title">
        {{ title }}
      </div>
    </transition>
    <div class="tk-footer-logos-item-logos">
      <div v-for="item in logos" :key="item.name">
        <a :href="item.urlRedirection" target="_blank">
          <img
            :src="item.urlLogo"
            :alt="item.name"
            class="tk-footer-logos-item-logo"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { TKLogo } from "@/domain/ui/TKLogo";

@Component
export default class TKFooterLogoItem extends Vue {
  @Prop()
  readonly title!: string;

  @Prop()
  readonly logos!: TKLogo[];
}
</script>

<style scoped>
.tk-footer-logos-item-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
}

.tk-footer-logos-item-title {
  color: var(--v-sectionTitle-base);
}

.tk-footer-logos-item-logos {
  display: flex;
  flex-flow: row nowrap;
  vertical-align: middle;
  justify-content: left;
  column-gap: var(--padding-small);
}

.tk-footer-logos-item-logo {
  height: 50px;
}
</style>
