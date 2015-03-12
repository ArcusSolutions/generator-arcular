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
        this.name = this._.classify(this.name + ' Utility');
    },

    createFile: function() {
        this.log('Creating new Utility with name: ' + this.name);
        this.template('app/js/utilities/_Utility.js', 'app/js/utilities/' + this.name + '.js');
    },

    addFileToIndex: function() {
        this.log('Adding file reference to app/index.html');
        utils.rewriteFile({
            file: path.join('app/index.html'),
            needle: '<!-- arcular:utility -->',
            splicable: [
                '<script src="js/utilities/' + this.name + '.js"></script>'
            ]
        });
        this.log('Utility created successfully!');
    }

});
