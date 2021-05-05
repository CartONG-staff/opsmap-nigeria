import Vue from "vue";
import TKApp from "@/app/TKApp.vue";
import vuetify from "@/plugins/vuetify";
import i18n from "@/i18n";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  i18n,
  render: h => h(TKApp)
}).$mount("#app");
