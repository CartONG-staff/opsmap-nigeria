<template lang="html">
  <div class="tk-powerbi-container">
    <iframe id="tk-powerbi" ref="powerbi"></iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import * as pbi from "powerbi-client";
import { POWERBI_CONFIG } from "@/domain/powerbi/powerbiConfig";

@Component
export default class TKPowerBI extends Vue {
  dashboard!: pbi.Embed;
  powerbi!: pbi.service.Service;

  mounted() {
    // Created service
    this.powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
    console.log("-- PowerBI service created");

    // Created Config
    // const config = POWERBI_CONFIG;
    const config = {
      type: "report",
      tokenType: pbi.models.TokenType.Embed,
      accessToken:
        "H4sIAAAAAAAEACWWtQ7sCBZE_-WlXslMK03QZmbOzMxu02j_fXs0eSW3VFX3_P3HSp9hTos___0DQIfa7ln3aQzt9GkQlP0JN1bceBKKwI_lw5KTxiwpIT5MdwV3nMBtD8sgsosZHW29kg2q4rbC9DzNtLiwwqhfXEB8JGoBEDo_zjHRoUXflcEcShthKCB53ongwZMEB3xMD4vBXnJY4owTZQunECmIXeJvJH3MWp8bjQdOmGmAyq7RPQ3oUOrMp7B0zNxCEdyoDMZZyZjjrAWmoZnqWGxJvFyYQ9MyhVugvJea8C23zFonkDdJFYgeeD2UhyrMUlS02IK_iA7qlhrTds4fy9YOgYDnjnFf3-8bFwlKGRA9rmWwkUUpNzjqkg1XvXtpS6C8bumIvkZcfazcAjFwfF8NFXi6YQNogrCmXPnmsvgX7ncR4Oa2s0Jhij7p_CxPX7srwyFdsZvg8ZK3QR_a2XET22Fg3YqbwRBaD7avNEnxqqLKGm6Uat5aqf0M5fsX_67drCdgooX8F0Ic1ZGacy1J6MXC0dVwIEvwSEfTQKTgoovQ5JWIcOhYlrHgp-VXbxsTfDku3KxYO63mnqOs27usis65C3neVlyHGymXZjmDRUsc2Qc96VCb-DKLCBXDz56UxcZ8eUOT4jSgsju8GJHq_alm7TGvR9HxfaAUhWTLPlvGezl6Ndt5PnG5eU-7gaciReDCrs2mTzUfK4e8rsLyKKPYXFCN5iERp-oH1b1gF8DJjOWGPjBfut0uCuRR4bRPhiI1WPZqo7HzR-M8OBu9dWAsReRbuJcCB9q9jdrYXCOLdhSOFJUIJy0CuwF9x6ginLF5BJ99Z4XsvM4Jl5yEYE5nb2IdnN8y-1wFcFZsTCkflLAjixn2W8aWBljzrV48c0pTZgHRa8brqtAByHWKdp_yX5TKMqCSdY7YKCuxX3HIFnOkoFQeQX5Kmo73UPxQaHTD-7DRuahW5GFXyXdfeKbjzBbyuWU6yI-tOygFACF-r2-IrmwDQRV4jvetVWBGAJK0WqgnDq2qxg5QF89IF5sYOsaos6ybpYK7giOdFamOmDA2TDPSfYLudF7I3-0RvF95qDCWUmcadJIxu5Av7qVPZArLwms2x8jq6toBVB3-HFhbij20dMNQtxmYQFNm7MVnSxmnG8R6pO9l9Y4ePwVdimSPZw-OJ5IvK-Lb7twrnIGZmlWvHouenC7ntbzHuJUSGRzT6Yx5UDbzvT3hSB8FV65iTS4MutxnAUXMtF_j_LnU7zU7V8-cJBWtbnqpKPx8NMosaddmSvEg6kzO26WfMqVJhfN2cuDLZFVN8KbjXdJK8PFbWO5CeYDSEMcRaFvX2PENrcNewG2Q-oMIWrduZV71vaWJVHdYvoN9f7pRUhI_mzxA-yAZXjPsgg8VYVUqOMMOTH7IHQpUYyzQ2YuYLaZXpWV9wSdjMUdIWMg2nl4fPidWVJ7Ra3OF7ZiKBdFnY-8_RCp39fKKJSxG2nUjywKB44x9vzB652apObAFHkYTKiL5G6oMZ2qYI3mJUib1Sfub20mk-TpeNXYjg0E2tLGREpW0PryH4s61Z--FQSnNTSQMSDBurbIR7OsW5JvohxtpYmOzRTZ-bU66yi3rcnsGf4OlGoVRf6N2JOQphEVuauunb124Cw_0LyUNSK7fXh_sFmALNEceNZDbt-KVGK246Hs1JDDgQZqMI5y7cwn6owjvlLJPboW0w6oNK9ibnH8pcR2bnZEh4LPw1_fziGV5JEiGxjuF-56xhBDEeOYiUTswq1tIzTqjF-ZiS2WPrwzDw5CFXQRR8YEadnTexYAVzYkDT7epdLKR1OraWUkOz4KIXqF8ZLG_MvSHLPULxsyhjlJ-8OZLAibhatZeMD3O_6gWmFS57YoQFSOaKMtp6kQUmLBfzRegj-diMj8AQkk8OyDP4Y1DWtZ-_ec30fPcVNZXRvtvCYYDcwVN9tLJeGrfiuV_Q-kT-mWRw8VyWn5QWRHjqNpzyZNi-Xg9l9WlZhEW_Bl4I7kVSSpCcKkvjGeDRGjr4ALk6bn1asI0lPAhqog0OOTY1Tm2WACX6t0xIitPbgdoAGoRAwQMHQj9PS7KpgP7ALBI0fqzudwP9hr0d5GcAPXkbzeJhFVLHAkO91rkJ8bblJyHmgwjnEuFWSXaaJjew28LVFUL_A49ntHg_vznD7s9yzGr5fPDCfM5Kn56mBLl9WuBygF3kxZZNnR0qzVh5S2Ypnq35dhmxnkhVaTZj2y6d07cUIkLTcQkFm5ZX7fZUP_rQLBYs7CgqCbI4XcJ7nbPga5SvxdFJ9nwtL7QD-aRBjr8bHoq80EfbD6V4F86JJVxnPwidGBdc5DpEK8VJ8iZV4micvIUkINzXEnk17XkByTiqmQaR3177BlarPjA54foLkyURzLGhb3Mz7kT2vXOjboS2deon1QWzXmia_1-W2WHXSek7JRaeKObSjmWQYGtOVVr-TJqoPDuNho68zab3VjhTnwNdw436Y-9xvsPHwLG6M1qXWJ7_p2tib6uj23HG8wDlYV__fXXPzY_S1NucvBzmew-p_9mix48knIOqR8Eb_qvym3rKT2-W_mTDdccbs2MSyxCggAqFWGjLCnokiSq6ccv7R7sbhdLss4v30vtCR5el20KeO7AiucUtOe2cLYxCarloNntqLVGI4IVR5NY8GUOyVjIe8ktTwWPmVr7OgfFWzbB8DcWPmbCy1Jg8jsblsYkkoC52juqZv3ASzsHYYzBxzJjSG4TZP6DWgppNG6tWPmZbvp6f3rwi1hb5Sx2GJZ-AqHJHa1E9EMS7kHFStUkJHJi3QTz6Cnu9_5kAYYhhRw19xD6Y99EcBUhWQMcH226YYkJ_W-84rkO5Y33UhvnHclksCwRtkQ50j-yOGYpaOtFX5zsZeWmN1TOvcMfAvKo7c5ETvvYIR_1z-b__R9GklbbQgsAAA==",
      embedUrl:
        "https://app.powerbi.com/reportEmbed?reportId=f6bfd646-b718-44dc-a378-b73e6b528204&groupId=be8908da-da25-452e-b220-163f52476cdd&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQifQ%3d%3d",
      id: "f6bfd646-b718-44dc-a378-b73e6b528204",
      permissions: pbi.models.Permissions.Read,
      settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true
      }
    };

    console.log("-- PowerBI config created");
    console.log(config);

    // Retrieve DOM
    const dashboardContainer = this.$refs.powerbi as HTMLElement;
    console.log("-- Item retrieved created");
    console.log(dashboardContainer);

    // Get Dashboard
    if (dashboardContainer) {
      console.log("-- Not empty");
      this.dashboard = this.powerbi.embed(dashboardContainer, config);
      console.log("-- Embed created");

      this.dashboard.off("loaded");
      this.dashboard.on("loaded", event => {
        console.log("LOADED");
        console.log(event.detail);
      });
      this.dashboard.on("error", (event: any) => {
        console.log("ERROR");
        console.log(event.detail);
      });
      this.dashboard.on("rendered", () => {
        console.log("RENDERED");
      });
      console.log("-- Signals updated");
    }

    console.log("-- PowerBI component ended");
  }
}
</script>

<style scoped>
.tk-powerbi-container {
  min-height: 400px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
}

#tk-powerbi {
  flex-grow: 1;
  border: none;
  margin: 0;
  padding: 0;
}
</style>
