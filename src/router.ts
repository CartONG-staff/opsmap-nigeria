import Vue, { Component } from "vue";
import VueRouter from "vue-router";
import TKMainComponent from "./components/TKMainComponent";
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
      name: "home"
    },
    {
      path: "/site",
      name: "site",
      components: {
        header: TKCampSelector
      }
    },
    {
      path: "*",
      redirect: { name: "home" }
    }
  ]
});

export default router;
