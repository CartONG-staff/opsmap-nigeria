<template>
  <div class="tk-ochacredits">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-ochacredits-text">
        {{ $t("ochaCredits") }}
         -
        <a
          href="http://creativecommons.org/licenses/by/3.0/"
          target="_blank"
          class="tk-ochacredits-text"
        >
          http://creativecommons.org/licenses/by/3.0/
        </a>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKOchaCredits extends Vue {}
</script>

<style scoped>
.tk-ochacredits {
  background-color: #f1f3f3;
  width: 100%;
  padding-top: 42px;
  padding-bottom: 42px;
  padding-left: 30px;
  padding-right: 30px;
}

.tk-ochacredits-text {
  white-space: nowrap;
  font-size: 14px;
  color: var(--v-secondary-base);
  text-align: center;
  width: 100%;
  /* letter-spacing: 0.86; */
}
</style>
