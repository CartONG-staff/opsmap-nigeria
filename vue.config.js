// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gitDescribeSync } = require("git-describe");
process.env.VUE_APP_APP_VERSION = gitDescribeSync().tag;

module.exports = {
  configureWebpack: {
    output: {
      libraryExport: ""
    }
  },

  css: {
    extract: false
  },

  pages: {
    index: {
      entry: "src/entry-point-app.ts"
    }
  },

  transpileDependencies: ["vuetify"],

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  },

  publicPath: process.env.BASE_URL
};
