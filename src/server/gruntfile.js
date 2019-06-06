module.exports = function (grunt) {
  grunt.initConfig({
    jsdoc: {
      dist: {
        src: [
          "README.md",
          "./app/**/*.js",
          "./libs/**/*.js",
        ],
        options: {
          destination: "docs",
          template: "node_modules/ink-docstrap/template",
          // configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
          configure: "jsdoc.json"
        }
      }
    },

    watch: {
    }
  });

  grunt.loadNpmTasks("grunt-jsdoc");
  grunt.loadNpmTasks("grunt-contrib-watch");
};
