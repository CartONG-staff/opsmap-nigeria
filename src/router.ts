import Vue from "vue";
import VueRouter from "vue-router";
import TKMainComponentLeftHome from "./components/TKMainComponent/TKMainComponentLeftHome.vue";
import TKMainComponentLeftCamp from "./components/TKMainComponent/TKMainComponentLeftCamp.vue";
import TKMainComponentContentHome from "./components/TKMainComponent/TKMainComponentContentHome.vue";
import TKMainComponentContentCamp from "./components/TKMainComponent/TKMainComponentContentCamp.vue";
import TKMainComponentIndicatorsHome from "./components/TKMainComponent/TKMainComponentIndicatorsHome.vue";
import TKMainComponentIndicatorsCamp from "./components/TKMainComponent/TKMainComponentIndicatorsCamp.vue";
import { TKCampSelector } from "./components/TKMainComponent/TKCampComponents";

/*
he default mode for vue-router is hash mode – it uses the URL hash to simulate a full URL so that the page won’t be reloaded when the URL changes.
To get rid of the hash, we can use the router’s history mode, which leverages the history.pushState API to achieve URL navigation without a page reload.
*/
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        left: TKMainComponentLeftHome,
        indicators: TKMainComponentIndicatorsHome,
        content: TKMainComponentContentHome
      }
    },
    {
      path: "/site",
      name: "site",
      components: {
        header: TKCampSelector,
        left: TKMainComponentLeftCamp,
        indicators: TKMainComponentIndicatorsCamp,
        content: TKMainComponentContentCamp
      }
    },
    {
      path: "/camp/:survey/:admin1?/:admin2?/:camp?",
      name: "camp",
      components: {
        header: TKCampSelector,
        left: TKMainComponentLeftCamp,
        indicators: TKMainComponentIndicatorsCamp,
        content: TKMainComponentContentCamp
      }
    },
    {
      path: "*",
      redirect: { name: "home" }
    }
  ]
});

export default router;
