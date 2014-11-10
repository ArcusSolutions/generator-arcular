'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var arcusUtils = require('../../arcus-utils.js');


var ArcusAngularGenerator = yeoman.generators.Base.extend({
    init: function () {
        this.pkg = require('../../package.json');

        this.argument('appname', { type: String, required: false });
        this.appname = this.appname || path.basename(process.cwd());
        this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

        this.option('app-suffix', {
            desc: 'Allow a custom suffix to be added to the module name',
            type: String,
            required: 'false'
        });
        this.env.options['app-suffix'] = this.options['app-suffix'];
        this.scriptAppName = this.appname + arcusUtils.appName(this);

        if (typeof this.env.options.appPath === 'undefined') {
            this.option('appPath', {
                desc: 'Generate CoffeeScript instead of JavaScript'
            });

            this.env.options.appPath = this.options.appPath;

            if (!this.env.options.appPath) {
                try {
                    this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
                } catch (e) {}
            }
            this.env.options.appPath = this.env.options.appPath || 'app';
            this.options.appPath = this.env.options.appPath;
        }

        this.appPath = this.env.options.appPath;

        this.on('end', function () {
            if (!this.options['skip-install']) {
                this.installDependencies();
            }
        });
    },

    askForCompass: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay('Welcome to Arcus Solutions\' AngularJS application generator.'));

        var prompts = [{
            type: 'confirm',
            name: 'compass',
            message: 'Would you like to use Sass (with Compass)?',
            default: true
        }];

        this.prompt(prompts, function (props) {
            this.compass = props.compass;

            done();
        }.bind(this));
    },

    askForBootstrap: function () {
        var done    = this.async();
        var compass = this.compass;

        var prompts = [{
            type: 'confirm',
            name: 'bootstrap',
            message: 'Would you like to include Bootstrap?',
            default: true
        }, {
            type: 'confirm',
            name: 'compassBootstrap',
            message: 'Would you like to use the Sass version of Bootstrap?',
            default: true,
            when: function (props) {
                return props.bootstrap && compass;
            }
        }];

        this.prompt(prompts, function (props) {
            this.bootstrap          = props.bootstrap;
            this.compassBootstrap   = props.compassBootstrap;

            done();
        }.bind(this));
    },

    askForNgModules: function () {
        var done = this.async();

        var prompts = [{
            type: 'checkbox',
            name: 'modules',
            message: 'Which ng-modules would you like to include?',
            choices: [{
                value: 'animateModule',
                name: 'angular-animate.js',
                checked: true
            }, {
                value: 'cookiesModule',
                name: 'angular-cookies.js',
                checked: true
            }, {
                value: 'resourceModule',
                name: 'angular-resource.js',
                checked: true
            }, {
                value: 'routeModule',
                name: 'angular-route.js',
                checked: true
            }, {
                value: 'sanitizeModule',
                name: 'angular-sanitize.js',
                checked: true
            }, {
                value: 'touchModule',
                name: 'angular-touch.js',
                checked: true
            }]
        }];

        this.prompt(prompts, function (props) {
            var hasMod = function (mod) {
                return props.modules.indexOf(mod) !== -1;
            };

            this.animateModule  = hasMod('animateModule');
            this.cookiesModule  = hasMod('cookiesModule');
            this.resourceModule = hasMod('resourceModule');
            this.routeModule    = hasMod('routeModule');
            this.sanitizeModule = hasMod('sanitizeModule');
            this.touchModule    = hasMod('touchModule');

            done();
        }.bind(this));
    },

    askForModules: function () {
        var done = this.async();

        var prompts = [{
            type: 'checkbox',
            name: 'modules',
            message: 'Which 3rd party modules would you like to include?',
            choices: [{
                value: 'uiRouter',
                name: 'angular-ui-router.js',
                checked: true
            }, {
                value: 'uiBootstrap',
                name: 'ui-bootstrap-tpls.js',
                checked: true
            }]
        }];

        this.prompt(prompts, function (props) {
            var hasMod = function (mod) {
                return props.modules.indexOf(mod) !== -1;
            };

            this.uiRouterModule     = hasMod('uiRouter');
            this.uiBootstrapModule  = hasMod('uiBootstrap');

            done();
        }.bind(this));
    },

    setDependencies: function () {
        var angMods = [];

        if (this.animateModule) {
            angMods.push("'ngAnimate'");
        }

        if (this.cookiesModule) {
            angMods.push("'ngCookies'");
        }

        if (this.resourceModule) {
            angMods.push("'ngResource'");
        }

        if (this.routeModule) {
            angMods.push("'ngRoute'");
        }

        if (this.sanitizeModule) {
            angMods.push("'ngSanitize'");
        }

        if (this.touchModule) {
            angMods.push("'ngTouch'");
        }

        if (this.uiRouterModule) {
            angMods.push("'ui.router'");
        }

        if (this.uiBootstrapModule) {
            angMods.push("'ui.bootstrap'");
        }

        angMods.push("'Arcus.Config'");
        angMods.push("'Arcus.Utilities'");

        if (angMods.length) {
            this.angularModules = '\n    ' + angMods.join(',\n    ') + '\n  ';
        }
    },

    app: function () {
        this.mkdir('app');
        this.mkdir('app/images');
        this.mkdir('app/fonts');
        this.mkdir('app/styles');
        this.mkdir('app/views');
        this.mkdir('app/views/directives');
        this.mkdir('app/views/partials');
        this.mkdir('app/scripts');
        this.mkdir('app/scripts/controllers');
        this.mkdir('app/scripts/data-services');
        this.mkdir('app/scripts/models');
        this.mkdir('app/scripts/repositories');
        this.mkdir('app/scripts/utilities');
        this.mkdir('app/scripts/directives');
        this.mkdir('app/scripts/filters');
    },

    projectfiles: function () {
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');
        this.copy('gitignore', '.gitignore');
        this.copy('gitattributes', '.gitattributes');
        this.copy('environments.json', 'environments.json');

        this.template('_Gruntfile.js.txt', 'Gruntfile.js');
        this.template('_package.json', 'package.json');
        this.template('_bower.json', 'bower.json');

        this.template('app/index.html', 'app/index.html');
        this.template('app/scripts/app.js', 'app/scripts/app.js');
        this.template('app/scripts/routes.js', 'app/scripts/routes.js');
        this.template('app/scripts/events.js', 'app/scripts/events.js');
        this.template('app/scripts/controllers/HeadCtrl.js', 'app/scripts/controllers/HeadCtrl.js');
        this.template('app/scripts/utilities/arcus.utilities.js', 'app/scripts/utilities/arcus.utilities.js');
        this.template('app/views/partials/header.html', 'app/views/partials/header.html');
        this.template('app/styles/main.scss', 'app/styles/main.scss');
    },

    generateFiles: function () {
        this.mkdir('app/views/main');
        this.copy('app/views/main/root.html', 'app/views/main/root.html');

        this.invoke('arcular:controller', {
            args: ['main']
        });
    }
});

module.exports = ArcusAngularGenerator;
