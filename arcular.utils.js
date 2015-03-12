'use strict';

var path    = require('path');
var fs      = require('fs');


function escapeRegExp (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}



function rewrite (args) {
    /* jshint -W044 */
    // check if splicable is already in the body text
    var re = new RegExp(args.splicable.map(function (line) {
        return '\s*' + escapeRegExp(line);
    }).join('\n'));

    if (re.test(args.haystack)) {
        return args.haystack;
    }

    var lines = args.haystack.split('\n');

    var otherwiseLineIndex = -1;
    lines.forEach(function (line, i) {
        if (line.indexOf(args.needle) !== -1) {
            otherwiseLineIndex = i;
        }
    });

    if (otherwiseLineIndex !== -1) {
        var spaces = 0;
        while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
            spaces += 1;
        }

        var spaceStr = '';
        while ((spaces -= 1) >= 0) {
            spaceStr += ' ';
        }

        lines.splice(otherwiseLineIndex + 1, 0, args.splicable.map(function (line) {
            return spaceStr + line;
        }).join('\n'));
    }

    return lines.join('\n');
}

function rewriteFile (args) {
    args.path = args.path || process.cwd();
    var fullPath = path.join(args.path, args.file);

    args.haystack = fs.readFileSync(fullPath, 'utf8');
    var body = rewrite(args);

    fs.writeFileSync(fullPath, body);
}

module.exports = {
    rewrite: rewrite,
    rewriteFile: rewriteFile
};
