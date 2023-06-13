import Vue from "vue";
import VueRouter from "vue-router";
import TKMainComponentLeftHome from "./primary/components/TKMainComponent/TKMainComponentLeftHome.vue";
import TKMainComponentLeftSite from "./primary/components/TKMainComponent/TKMainComponentLeftSite.vue";
import TKMainComponentContentHome from "./primary/components/TKMainComponent/TKMainComponentContentHome.vue";
import TKMainComponentContentSite from "./primary/components/TKMainComponent/TKMainComponentContentSite.vue";
import { TKSiteSelector } from "./primary/components/TKMainComponent/TKSiteComponents";
import TKConfigurationModule from "./store/modules/configuration/TKConfigurationModule";

export function initializeRouter(): VueRouter {
  /*
he default mode for vue-router is hash mode – it uses the URL hash to simulate a full URL so that the page won’t be reloaded when the URL changes.
To get rid of the hash, we can use the router’s history mode, which leverages the history.pushState API to achieve URL navigation without a page reload.
*/
  Vue.use(VueRouter);

  const adminSubPath = TKConfigurationModule.configuration.spatial.adminLevels
    .map(level => `:${level}?/`)
    .join("");
  return new VueRouter({
    mode: "hash",
    routes: [
      {
        path: "/",
        name: "home",
        components: {
          left: TKMainComponentLeftHome,
          content: TKMainComponentContentHome
        }
      },
      {
        path: `/site/:survey/${adminSubPath}:site?/:date?`,
        name: "site",
        components: {
          header: TKSiteSelector,
          left: TKMainComponentLeftSite,
          content: TKMainComponentContentSite
        }
      },
      {
        path: "*",
        redirect: { name: "home" }
      }
    ]
  });
}
