module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
       jshintrc: '.jshintrc'
      },
      files: ['script/util/torch-util.js']
    },
    concat: {
      options: {
        separator: '\n',
      },
      dist: {
        src: [
        'script/common/advanced/advanced-module.js',
        'script/common/advanced/advanced-directive.js',
        'script/common/cascade/cascade-module.js', 
        'script/common/cascade/cascade-directive.js',
        'script/common/data/data-module.js',
        'script/common/data/data-filter.js',
        'script/common/data/data-directive.js'

        ],
        dest: 'dist/js/<%= pkg.name %>.js',
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // 默认被执行的任务列表。
  //grunt.registerTask('default', ['uglify']);
  // JS distribution task.
  grunt.registerTask('dist', ['jshint', 'concat', 'uglify']);

};