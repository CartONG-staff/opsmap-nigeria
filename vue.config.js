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
