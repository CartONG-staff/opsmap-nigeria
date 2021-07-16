// Ensure "" export behavior : "" === everything.
// It is needed because the project is a lib.
// cf: https://cli.vuejs.org/guide/build-targets.html#vue-vs-js-ts-entry-files
process.env.VUE_APP_VERSION = process.env.npm_package_version;
process.env.VUE_APP_GITHEAD = process.env.npm_package_gitHead;

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

  publicPath: `/opsmap/${process.env.npm_package_name}/`
};
