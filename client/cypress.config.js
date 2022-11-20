const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.excludeSpecPattern = [
        "*/**/2-advanced-examples",
        "*/**/1-getting-started",
      ];
      // implement node event listeners here
      config.baseUrl = "http://localhost:3000/";

      return config;
    },
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
