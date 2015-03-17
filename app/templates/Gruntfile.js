module.exports = function(grunt) {
    "use strict";

    require('load-grunt-tasks')(grunt);


    var environmentConfig = {
        options: {
            space: '  ',
            name: 'Arcus.Config',
            dest: 'app/js/arcus.config.js'
        }
    };

    var environments = require('./environments.json');
    for (var key in environments) {
        environmentConfig[key] = environments[key];
    }

    // Set the current environment
    var _selectedEnvironment = grunt.option('ENV') || "production";
    _selectedEnvironment = 'ngconstant:' + _selectedEnvironment;


    grunt.initConfig({

        assetsDir: 'app',
        distDir: 'dist',

        ngconstant: environmentConfig,

        wiredep: {
            target: {
                src: [
                    'app/index.html',
                    'app'
                ]
            }
        },
        clean: {
            dist: ['.tmp', 'dist']
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app',
                    dest: 'dist/',
                    src: [
                        'index.html',
                        'img/**'
                    ]
                }]
            }
        },
        ngAnnotate: {
            options: {
                // Task-specific options go here.
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/js',
                    src: '*.js',
                    dest: '.tmp/concat/js'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['index.html', '**/*.html'],
                    dest: 'dist'
                }]
            }
        },
        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'dist'
            }
        },
        usemin: {
            html: 'dist/index.html'
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src : ['app/**/*.html', 'app/**/*.js', 'app/**/*.css']
                },
                options: {
                    watchTask: true,
                    ghostMode: {
                        clicks: true,
                        scroll: true,
                        links: false, // must be false to avoid interfering with angular routing
                        forms: true
                    },
                    server: {
                        baseDir: "app"
                    }
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all : {
                src : ['app/js/**/*.js']
            }
        },
        watch: {
            options : {
                interrupt: true
            },
            js: {
                files: ['app/js/**/*.js'],
                tasks: ['newer:jshint']
            },
            html : {
                files: ['app/**/*.html']
            },
            css: {
                files: ['app/css/**/*.css'],
                tasks: [<% if (csslint) { %>'csslint'<% } %>]
            }<% if (csspreprocessor === 'less') { %>,
            less: {
                files : ['app/less/**/*.less'],
                tasks: ['less:all']
            }<% } else if (csspreprocessor === 'sass') { %>,
            scss: {
                files : ['app/scss/**/*.scss'],
                tasks: ['sass:all']
            }<% } %>
        },
        connect: {
            test : {
                options: {
                    port: 8887,
                    base: 'app',
                    keepalive: false,
                    livereload: false,
                    open: false
                }
            }
        }<% if (csslint) { %>,
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all : {
                src : ['app/css/**/*.css']
            }
        }<% } if (csspreprocessor === 'less') { %>,
        less: {
            options: {
                paths: ['app/less']
            },
            all: {
                files: {
                    'app/css/app.css': 'app/less/app.less'
                }
            }
        }<% } else if (csspreprocessor === 'sass') { %>,
        sass: {
            options: {
                style : 'expanded',
                trace : true
            },
            all: {
                files: {
                    'app/css/app.css': 'app/scss/app.scss'
                }
            }
        }<% } if (revision) { %>,
        rev: {
            dist: {
                files: {
                    src: [
                        'dist/js/{,*/}*.js',
                        'dist/css/{,*/}*.css'
                    ]
                }
            }
        }<% } if (imagemin) { %>,
        imagemin: {
            dist : {
                options : {
                    optimizationLevel: 7,
                        progressive: false,
                        interlaced : true
                },
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/'
                }]
            }
        }<% } if (unitTest) { %>,
        karma: {
            dev_unit: {
                options: {
                    configFile: 'test/conf/unit-test-conf.js',
                    background: true,
                    singleRun: false,
                    autoWatch: true,
                    reporters: ['progress']
                }
            },
            dist_unit: {
                options: {
                    configFile: 'test/conf/unit-test-conf.js',
                    background: false,
                    singleRun: true,
                    autoWatch: false,
                    reporters: ['progress', 'coverage'],
                    coverageReporter : {
                        type : 'html',
                        dir : '../reports/coverage'
                    }
                }
            }<% if (e2eTest) { %>,
            e2e: {
                options: {
                    configFile: 'test/conf/e2e-test-conf.js'
                }
            } <% } %>
        }<% } %>
    });

    grunt.registerTask('build', [
        'jshint',
        'wiredep',
        'clean',
        _selectedEnvironment,
        'useminPrepare',
        'copy',
        'concat',
        'ngAnnotate',
        'uglify',<% if (csspreprocessor.indexOf('sass') !== -1) { %>
        'sass',<% } else if (csspreprocessor.indexOf('less') !== -1) { %>
        'less',<% } %>
        'cssmin',<% if (revision) { %>
        'rev',<% } %><% if (imagemin) { %>
        'imagemin',<% } %>
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('serve', [
        'wiredep',<% if (csspreprocessor.indexOf('sass') !== -1) { %>
        'sass',<% } else if (csspreprocessor.indexOf('less') !== -1) { %>
        'less',<% } %>
        _selectedEnvironment,
        'browserSync',<% if (unitTest) { %>
        'karma:dev_unit:start',<% } %>
        'watch'
    ]);

};
