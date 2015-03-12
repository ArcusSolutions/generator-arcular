'use strict';

var path    = require('path');
var utils   = require('../arcular.utils');
var yeoman  = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({

    initialize: function () {
        try {
            this.appname = require(path.join(process.cwd(), 'bower.json')).name;
        } catch (e) {
            this.appname = path.basename(process.cwd());
        }

        this.argument('name', {
            required: true,
            type: String,
            desc: 'The subgenerator name'
        });
        this.name = this._.classify(this.name + ' Ctrl');
    },

    createFile: function() {
        this.log('Creating new Controller with name: ' + this.name);
        this.template('app/js/controllers/_Controller.js', 'app/js/controllers/' + this.name + '.js');
    },

    addFileToIndex: function() {
        this.log('Adding file reference to app/index.html');
        utils.rewriteFile({
            file: path.join('app/index.html'),
            needle: '<!-- arcular:controller -->',
            splicable: [
                '<script src="js/controllers/' + this.name + '.js"></script>'
            ]
        });
        this.log('Controller created successfully!');
    }

});
