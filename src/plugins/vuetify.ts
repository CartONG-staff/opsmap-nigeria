/**
 * This file imports [vuetify](https://vuetifyjs.com/en/) into the project as a vuejs [plugin](https://fr.vuejs.org/v2/guide/plugins.html).
 * @module
 */

import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

/*
theme.options.customeProperties: generates css var
primary color --> var(--v-primary-base);
primary: because it's primary field
base: among 11 values:

REF:
interface ParsedThemeItem {
  base: string
  lighten5: string
  lighten4: string
  lighten3: string
  lighten2: string
  lighten1: string
  darken1: string
  darken2: string
  darken3: string
  darken4: string
  [name: string]: string
}
*/

export default new Vuetify({
  theme: {
    options: { customProperties: true }, // Generates CSS var
    themes: {
      light: {
        accent: "#428fdf",
        primary: "#333333",
        secondary: "#999999",
        background: "#ffffff",
        discrete: "#d8d8d8",
        sectionTitle: "#a1a1a1",
        backgroundSecondary: "#fafafa",
        autocomplete: "#000000",
        border: "#f1f3f3",
        thematicBackground: "#f1f3f3",
        thematicHeader: "#ffffff",
        thematicBorder: "#f1f3f3",
        campSelector: "#f0fbff"
        // indicatorBorder: "rgba(18, 63, 98, 0.15)" // 26
        // accent
        // anchor
        // error
        // info
        // success
        // warning
      },
      dark: {
        accent: "#428fdf",
        info: "#ff0000",
        sectionTitle: "#a1a1a1",
        background: "#121212",
        autocomplete: "#a1a1a1",
        primary: "#aaaaaa",
        secondary: "#777777",
        border: "#2c2c2c",
        discrete: "#393939",
        thematicBackground: "#171717",
        thematicHeader: "#2c2c2c",
        thematicBorder: "#2c2c2c",
        backgroundSecondary: "#171717",
        campSelector: "#000305"
      }
    },
    dark: true
  }
});
