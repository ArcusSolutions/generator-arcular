'use strict';
var fs              = require('fs');
var path            = require('path');
var yeoman          = require('yeoman-generator');
var chalk           = require('chalk');
var yosay           = require('yosay');
var semver          = require("semver");
var GruntfileEditor = require('gruntfile-editor');

var _workingDirectory;



var hasOption = function (options, option) {
    if(options){
        return options.indexOf(option) !== -1;
    } else {
        return false;
    }
};



module.exports = yeoman.generators.Base.extend({

    initialize: function () {
        this.pkg                = require('../package.json');
        _workingDirectory       = path.basename(process.cwd());
        this.name               = _workingDirectory;

        this.angular_version    = '*';
        this.version            = '0.0.1';
        this.description        = '';
        this.csslint            = false;
        this.revision           = false;
        this.gitignore          = false;
        this.i18n               = false;
        this.e2eTest            = false;
        this.unitTest           = false;
        this.csspreprocessor    = 'none';
        this.imagemin           = false;
        this.resourceModule     = false;
        this.cookieModule       = false;
        this.sanitizeModule     = false;
        this.routeModule        = false;
        this.i18nModule         = false;
        this.animateModule      = false;
        this.touchModule        = false;
        this.uiRouterModule     = false;
        this.translateModule    = false;
        this.snapModule         = false;
        this.bindonceModule     = false;
        this.thirdModules       = false;

        this.angularDeps        = "";       // modules to import in angular.module()
        this.angularProviders   = "";       // providers to inject in angular.module().config()
        this.packageGruntTasks  = "";
        this.ciGruntTasks       = "";
        this.devGruntTasks      = "";
    },

    askForMode: function() {
        var done = this.async();

        // have Yeoman greet the user
        this.log(yosay('Hello, and welcome to Arcus Solutions\' AngularJS generator, Arcular!'));
        this.log(chalk.magenta('arcular scaffolds out an AngularJS application and provides a series of subgenerators for you to start your project'));

        this.prompt([
            {
                type: "list",
                name: "mode",
                message: "Which mode do you want to run?",
                choices: ["Fast", "Advanced"]
            }
        ], function (props) {
            this.mode = props.mode;
            done();
        }.bind(this));
    },

    launchAdvancedMode: function () {
        if (this.mode === "Advanced") {
            var done = this.async();

            var prompts = [
                {
                    type: "input",
                    name: "name",
                    message: "Name your project",
                    default: _workingDirectory
                },
                {
                    type: "input",
                    name: "angular_version",
                    message: "Version of angular (leave blank to fetch the latest version available or specify one)",
                    validate: function (value) {
                        var valid = semver.validRange(value);
                        if (valid === null) {
                            return "Please enter a valid semantic version (semver.org)";
                        } else {
                            return true;
                        }
                    }
                },
                {
                    type: "checkbox",
                    name: "modules",
                    message: "What official angular modules do you need?",
                    choices : [{
                        value: 'resourceModule',
                        name: 'angular-resource.js',
                        checked: false
                    }, {
                        value: 'cookieModule',
                        name: 'angular-cookies.js',
                        checked: false
                    }, {
                        value: 'sanitizeModule',
                        name: 'angular-sanitize.js',
                        checked: false
                    }, {
                        value: 'routeModule',
                        name: 'angular-route.js',
                        checked: false
                    }, {
                        value: 'touchModule',
                        name: 'angular-touch.js',
                        checked: false
                    }, {
                        value: 'i18nModule',
                        name: 'angular-i18n.js',
                        checked: false
                    }, {
                        value: 'animateModule',
                        name: 'angular-animate.js',
                        checked: false
                    }]
                },
                {
                    type: "checkbox",
                    name: 'thirdModules',
                    message: 'What amazing angular modules do you need?',
                    choices: [{
                        value: 'uiRouterModule',
                        name: 'angular-ui-router.js',
                        checked: false
                    }, {
                        value: 'translateModule',
                        name: 'angular-translate.js',
                        checked: false
                    }, {
                        value: 'snapModule',
                        name: 'angular-snap.js',
                        checked: false
                    }, {
                        value: 'bindonceModule',
                        name: 'angular-bindonce.js',
                        checked: false
                    }]
                },
                {
                    type: "checkbox",
                    name: "tests",
                    message: "Which tests should I set up ?",
                    choices: [ "unit", "e2e" ]
                },
                {
                    type: "confirm",
                    name: "revision",
                    message: "Rename JS & CSS files for browser caching purpose ?  (i.e. app.js becomes 8664d46sf64.app.js)",
                    default: false
                },
                {
                    type: "confirm",
                    name: 'csslint',
                    message: 'Should I lint your CSS with CSSLint',
                    default: false
                },
                {
                    type: "list",
                    name: 'csspreprocessor',
                    message: 'Should I set up one of those CSS preprocessors ?',
                    choices: [ "none", "sass", "less" ],
                    default: 0
                },
                {
                    type: "confirm",
                    name: "imagemin",
                    message: "Should I optimize your images (gif, png, jpeg) ?",
                    default: false
                }
            ];

            this.prompt(prompts, function (props) {
                this.name               = props.name;
                this.angular_version    = props.angular_version;
                this.version            = props.version;
                this.description        = props.description;
                this.csslint            = props.csslint;
                this.complexity         = props.complexity;
                this.test               = props.test;
                this.revision           = props.revision;
                this.i18n               = props.i18n;
                this.csspreprocessor    = props.csspreprocessor;
                this.tests              = props.tests;
                this.imagemin           = props.imagemin;
                this.thirdModules       = props.thirdModules;

                this._handleModules(props.modules, props.thirdModules);
                this._setUpTests();

                done();
            }.bind(this));
        }
    },

    app: function () {
        this.mkdir('app');
        this.template('app/_index.html', 'app/index.html');
        this.template('app/css/app.css', 'app/css/app.css');
        this.template('app/js/app.js', 'app/js/app.js');
        this.template('app/js/routes.js', 'app/js/routes.js');
        this.template('app/js/events.js', 'app/js/events.js');

        if (hasOption(this.csspreprocessor, 'sass')) {
            this.copy('app/scss/_core.scss', 'app/scss/core.scss');
            this.copy('app/scss/_layout.scss', 'app/scss/layout.scss');
            this.copy('app/scss/_variables.scss', 'app/scss/variables.scss');
            this.copy('app/scss/app.scss', 'app/scss/app.scss');
        } else if (hasOption(this.csspreprocessor, 'less')) {
            this.copy('app/less/_core.less', 'app/less/core.less');
            this.copy('app/less/_layout.less', 'app/less/layout.less');
            this.copy('app/less/_variables.less', 'app/less/variables.less');
            this.copy('app/less/app.less', 'app/less/app.less');
        }

        if (this.unitTest) {
            this.template('test/conf/_unit-test-conf.js', 'test/conf/unit-test-conf.js');
            this.template('test/unit/appSpec.js', 'test/unit/appSpec.js');
        }

        if (this.e2eTest) {
            this.copy('test/conf/e2e-test-conf.js', 'test/conf/e2e-test-conf.js');
            this.template('test/e2e/scenarios.js', 'test/e2e/scenarios.js');
        }

        if (this.unitTest || this.e2eTest) {
            this.copy('test/.jshintrc', 'test/.jshintrc');
        }

        this.template('_package.json', 'package.json');
        this.template('_bower.json', 'bower.json');
        this.template('_README.md', 'README.md');
        this.template('Gruntfile.js', 'Gruntfile.js');
    },

    configFiles: function () {
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');
        this.copy('bowerrc', '.bowerrc');
        this.copy('gitignore', '.gitignore');
        this.copy('environments.json', 'environments.json');

        if (this.csslint) {
            this.copy('csslintrc', '.csslintrc');
        }
    },

    install: function () {
        this.installDependencies({
            skipInstall: this.options['skip-install'],
            callback: function() {
                this.log(chalk.green('\nBravo, your angular Project is ready! Please find below some grunt tasks prepared for you :\n'));
            }.bind(this)
        });
    },

    _handleModules : function (modules, thirdModules) {
        var angMods = [],
            angProviders = [];

        this.resourceModule     = hasOption(modules, 'resourceModule');
        this.cookieModule       = hasOption(modules,'cookieModule');
        this.sanitizeModule     = hasOption(modules,'sanitizeModule');
        this.routeModule        = hasOption(modules, 'routeModule');
        this.i18nModule         = hasOption(modules, 'i18nModule');
        this.animateModule      = hasOption(modules, 'animateModule');
        this.touchModule        = hasOption(modules, 'touchModule');

        this.uiRouterModule     = hasOption(thirdModules, 'uiRouterModule');
        this.translateModule    = hasOption(thirdModules,'translateModule');
        this.snapModule         = hasOption(thirdModules,'snapModule');
        this.carouselModule     = hasOption(thirdModules, 'carouselModule');
        this.bindonceModule     = hasOption(thirdModules, 'bindonceModule');

        if (this.resourceModule) {
            angMods.push("'ngResource'");
        }
        if (this.cookieModule) {
            angMods.push("'ngCookies'");
        }
        if (this.sanitizeModule) {
            angMods.push("'ngSanitize'");
        }
        if (this.routeModule) {
            angMods.push("'ngRoute'");
        }
        if (this.animateModule) {
            angMods.push("'ngAnimate'");
        }
        if (this.touchModule) {
            angMods.push("'ngTouch'");
        }

        if (this.uiRouterModule) {
            angMods.push("'ui.router'");
            angProviders.push("$stateProvider");
            angProviders.push("$urlRouterProvider");
        }
        if (this.translateModule) {
            angMods.push("'pascalprecht.translate'");
            angProviders.push("$translateProvider")
        }
        if (this.snapModule) {
            angMods.push("'snap'");
        }
        if (this.carouselModule) {
            angMods.push("'angular-carousel'");
        }
        if (this.bindonceModule) {
            angMods.push("'pasvaz.bindonce'");
        }

        angMods.push("'Arcus.Config'");

        if (angMods.length) {
            this.angularDeps = '\n    ' + angMods.join(',\n    ') + '\n';
            this.angularProviders = angProviders.join(', ');
        }
    },

    _setUpTests : function() {
        this.e2eTest    = hasOption(this.tests, 'e2e');
        this.unitTest   = hasOption(this.tests, 'unit');
    }

});
