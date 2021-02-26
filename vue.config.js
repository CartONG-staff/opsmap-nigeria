// Ensure default export behavior
// It is needed because the project is a lib.
// cf: https://cli.vuejs.org/guide/build-targets.html#vue-vs-js-ts-entry-files

module.exports = {
  configureWebpack: {
    output: {
      libraryExport: "default"
    }
  }
};
