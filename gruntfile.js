module.exports = function(grunt) {
  'use strict';
  var pkg = grunt.file.readJSON('package.json');
  var websrc = ['src/oktavia-web-runtime.jsx'];
  var webworkersrc = ['src/oktavia-web-runtime.jsx'];
  var cliruntimesrc = ['src/oktavia-cli-runtime.jsx'];
  var toolsrc = ['src/httpstatus.jsx', 'src/oktavia-mkindex-cli.jsx', 'src/oktavia-search-cli.jsx'];
  grunt.initConfig({
    sampleDir: "samples",
    srcDir: "src",
    libDir: "node_modules/*/src",
    destDir: "bin",
    testDir: "test",
    docDir: "doc",

    watch: {
      sample: {
        files: ['<%= sampleDir %>/*.jsx', '<%= srcDir %>/*.jsx'],
        tasks: ['jsx:build']
      },
      test: {
        files: ['<%= testDir %>/*.jsx', '<%= srcDir %>'],
        tasks: ['jsx:test']
      }
    },

    connect: {
      server: {
        options: {
          port: 8080,
          base: 'samples',
          keepalive: true
        }
      }
    },

    jsx: {
      commonjs: {
        src: websrc,
        output_rule: {
            regexp: /src\/(.+)\.jsx/,
            replace: 'bin\/web/\/$1.common.js'
        },
        add_search_path: ['<%= libDir %>'],
        minify: true,
        release: true,
        linker: 'commonjs-lib'
      },

      amd: {
        src: websrc,
        output_rule: {
            regexp: /src\/(.+)\.jsx/,
            replace: 'bin\/web\/$1.amd.js'
        },
        add_search_path: ['<%= libDir %>'],
        minify: true,
        release: true,
        linker: 'amd-lib'
      },

      closure: {
        src: websrc,
        output_rule: {
            regexp: /src\/(.+)\.jsx/,
            replace: 'bin\/web/\/$1.common.js'
        },
        add_search_path: ['<%= libDir %>'],
        minify: true,
        release: true,
        linker: 'closure-lib'
      },

      global: {
        src: websrc,
        output_rule: {
            regexp: /src\/(.+)\.jsx/,
            replace: 'bin\/web/\/$1.global.js'
        },
        add_search_path: ['<%= libDir %>'],
        minify: true,
        release: true,
        linker: 'export-global'
      },

      standard: {
        src: websrc,
        output_rule: {
            regexp: /src\/(.+)\.jsx/,
            replace: 'bin\/web/\/$1.js'
        },
        add_search_path: ['<%= libDir %>'],
        release: true,
        minify: true
      },

      webworker: {
        src: webworkersrc,
        output_rule: {
            regexp: /src\/(.+)\.jsx/,
            replace: 'bin\/web/\/$1.js'
        },
        add_search_path: ['<%= libDir %>'],
        release: true,
        minify: true,
        linker: 'webworker'
      },

      tool: {
        src: toolsrc,
        output_rule: {
            regexp: /src\/(.+)\.jsx/,
            replace: 'bin\/$1'
        },
        add_search_path: ['<%= libDir %>'],
        release: true,
        executable: 'node'
      },

      cliruntime: {
        src: cliruntimesrc,
        output_rule: {
            regexp: /src\/(.+)\.jsx/,
            replace: 'bin\/$1.js'
        },
        add_search_path: ['<%= libDir %>'],
        release: true,
        minify: false,
        executable: 'node'
      },

      test: {
        src: ['<%= testDir %>/*.jsx'],
        add_search_path: ['<%= libDir %>', '<%= srcDir %>'],
        test: true
      },

      doc: {
        src: ['<%= libDir %>/*.jsx'],
        add_search_path: ['<%= libDir %>'],
        dest: '<%= docDir %>',
        mode: 'doc'
      }
    }
  });

  for (var key in pkg.devDependencies) {
    if (/grunt-/.test(key)) {
      grunt.loadNpmTasks(key);
    }
  }

  grunt.registerTask('default', ['jsx:test']);
  grunt.registerTask('build', [
    'jsx:commonjs',
    'jsx:amd',
    'jsx:closure',
    'jsx:standard',
    'jsx:global',
    'jsx:webworker',
    'jsx:tool',
    'jsx:cliruntime'
  ]);
  grunt.registerTask('test', ['jsx:test']);
  grunt.registerTask('doc', ['jsx:doc']);
  grunt.registerTask('runserver', ['connect:server']);
};
// vim: set expandtab tabstop=2 shiftwidth=2:
