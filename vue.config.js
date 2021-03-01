// Ensure "" export behavior : "" === everything.
// It is needed because the project is a lib.
// cf: https://cli.vuejs.org/guide/build-targets.html#vue-vs-js-ts-entry-files

module.exports = {
  configureWebpack: {
    output: {
      libraryExport: ""
    }
  },
  css: {
    extract: false
  }
};
