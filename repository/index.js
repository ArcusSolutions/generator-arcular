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
        this.name = this._.classify(this.name + ' Repository');
    },

    createFile: function() {
        this.log('Creating new Repository with name: ' + this.name);
        this.template('app/js/repositories/_Repository.js', 'app/js/repositories/' + this.name + '.js');
    },

    addFileToIndex: function() {
        this.log('Adding file reference to app/index.html');
        utils.rewriteFile({
            file: path.join('app/index.html'),
            needle: '<!-- arcular:repository -->',
            splicable: [
                '<script src="js/repositories/' + this.name + '.js"></script>'
            ]
        });
        this.log('Repository created successfully!');
    }

});
