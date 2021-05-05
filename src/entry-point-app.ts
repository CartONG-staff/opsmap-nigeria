import Vue from "vue";
import TKApp from "@/app/TKApp.vue";
import vuetify from "@/plugins/vuetify";
import i18n from "@/i18n";
import VueAnalytics from 'vue-analytics';

Vue.config.productionTip = false;

Vue.use(VueAnalytics, {
  id: 'G-9VDDG9K108'
});

new Vue({
  vuetify,
  i18n,
  render: h => h(TKApp)
}).$mount("#app");
