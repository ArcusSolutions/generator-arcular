'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var arcusUtils = require('../../arcus-utils.js');


var ModelGenerator = yeoman.generators.NamedBase.extend({
    init: function () {
        try {
            this.appname = require(path.join(process.cwd(), 'bower.json')).name;
        } catch (e) {
            this.appname = path.basename(process.cwd());
        }

        this.appname = this._.slugify(this._.humanize(this.appname));
        this.scriptAppName = this._.camelize(this.appname) + arcusUtils.appName(this);

        this.cameledName = this._.camelize(this.name);
        this.classedName = this._.classify(this.name);

        if (typeof this.env.options.appPath === 'undefined') {
            this.env.options.appPath = this.options.appPath;

            if (!this.env.options.appPath) {
                try {
                    this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
                } catch (e) {}
            }

            this.env.options.appPath = this.env.options.appPath || 'app';
            this.options.appPath = this.env.options.appPath;
        }
    },

    addFiles: function () {
        yeoman.generators.Base.prototype.template.apply(this, [
            'model.js',
            path.join(this.env.options.appPath, 'scripts/models/' + this.classedName + 'Model.js')
        ]);
    },

    addFileToIndex: function () {
        arcusUtils.rewriteFile({
            file: path.join(this.env.options.appPath, 'index.html'),
            needle: '<!-- build:js(.) scripts/models.js -->',
            splicable: [
                '<script src="scripts/models/' + this.classedName + 'Model.js"></script>'
            ]
        });
    }
});

module.exports = ModelGenerator;