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
  `${process.env.VUE_APP_GENERAL_CONFIG_DIRECTORY}general_config.json`,
  messagesCandidates
).then(config => {
  TKConfigurationModule.setConfiguration(config);

  // i18n
  //Handle locale definition + default
  const messages: LocaleMessages = {};
  for (const key of TKConfigurationModule.configuration.languages) {
    messages[key] = messagesCandidates[key];
  }

  const defaultLocale = TKConfigurationModule.configuration.languageDefault;

  const i18n = new VueI18n({
    locale: defaultLocale,
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
