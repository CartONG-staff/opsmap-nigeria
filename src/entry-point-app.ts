import Vue from "vue";
import TKApp from "@/app/TKApp.vue";
import vuetify from "@/plugins/vuetify";
import { loadLocaleMessages } from "@/i18n";
import VueI18n, { LocaleMessages } from "vue-i18n";
import { TKReadGeneralConfiguration } from "./app/TKOpsmapConfiguration";

Vue.config.productionTip = false;

TKReadGeneralConfiguration("general_config", "brazil").then(config => {
  // Filter with config languages field.
  const messagesCandidates = loadLocaleMessages();
  const keys = Object.keys(messagesCandidates).filter(lang =>
    config.languages.includes(lang)
  );
  const messages: LocaleMessages = {};
  keys.forEach(key => {
    messages[key] = messagesCandidates[key];
  });

  const i18n = new VueI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || "en",
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
    messages: messages
  });

  // Freeze the config
  Object.freeze(config);

  new Vue({
    vuetify,
    i18n,
    data: {
      config: config
    },
    render: h => h(TKApp)
  }).$mount("#app");
});
