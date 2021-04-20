import Vue from "vue";
import App from "./entry-point-app.vue";
import vuetify from "@/plugins/vuetify";
import i18n from "@/i18n";
import { TKGeneralConfigurationBuild } from "@/domain/survey/surveyConfiguration/TKGeneralConfigurationBuild";

TKGeneralConfigurationBuild().then(
  config => {
    Vue.config.productionTip = false;
    new Vue({
      data: Object.freeze({appRootConfig: config}),
      vuetify,
      i18n,
      render: h => h(App),
      created: function () {
        console.log(this.appRootConfig);
      }
    }).$mount("#app")
  }
);