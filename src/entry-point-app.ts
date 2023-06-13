import Vue from "vue";
import TKApp from "@/primary/app/TKApp.vue";
import vuetify from "@/plugins/vuetify";
import { loadLocaleMessages } from "@/i18n";
import VueI18n, { LocaleMessages } from "vue-i18n";
import { initializeMatomo } from "./matomo";
import { initializeRouter } from "./router";
import store from "./store";

// ////////////////////////////////////////////////////////////////////////////
// MATOMO
// ////////////////////////////////////////////////////////////////////////////

import TKConfigurationModule from "./store/modules/configuration/TKConfigurationModule";
import { TKReadGeneralConfiguration } from "./domain/opsmapConfig/TKOpsmapConfiguration";

Vue.config.productionTip = false;

const messagesCandidates = loadLocaleMessages();
TKReadGeneralConfiguration(
  `${process.env.VUE_APP_GENERAL_CONFIG_DIRECTORY}general_config.json`
).then(config => {
  TKConfigurationModule.setConfiguration(config);

  // i18n
  // Handle locale definition + default
  // TODO: strong condition on locale override
  const messages: LocaleMessages = {};
  for (const locale of TKConfigurationModule.configuration.locale.locales) {
    messages[locale] = {
      ...messagesCandidates[locale],
      ...(TKConfigurationModule.configuration.locale.override[locale] ?? [])
    };
  }

  const i18n = new VueI18n({
    locale: TKConfigurationModule.configuration.locale.default,
    fallbackLocale: "en",
    messages: messages
  });

  // router
  const router = initializeRouter();

  // matomo
  initializeMatomo(router);

  // Update vuetify options.
  vuetify.framework.theme.dark =
    TKConfigurationModule.configuration.options.dark;

  new Vue({
    router,
    vuetify,
    i18n,
    store,
    render: h => h(TKApp)
  }).$mount("#app");
});
