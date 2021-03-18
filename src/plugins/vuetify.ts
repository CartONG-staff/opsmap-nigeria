/**
 * This file imports [vuetify](https://vuetifyjs.com/en/) into the project as a vuejs [plugin](https://fr.vuejs.org/v2/guide/plugins.html).
 * @module
 */

import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

// export default new Vuetify({});

// NIGERIA CONFIG
export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#286090",
        secondary: "#337FDD",
        accent: "#8c9eff",
        error: "#b71c1c",
      },
    },
  },
});
