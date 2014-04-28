#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2)),
    xml2js = require('xml2js'),
    fs = require('fs');

var parser = new xml2js.Parser();
fs.readFile(argv._[0], function(err, data) {
    parser.parseString(data, function (err, result) {
        var styles = [];
        for (i=0; i < result.Map.Style.length; i++) {
            var style = result.Map.Style[i];
            styles[i] = {};
            styles[i].style = style.$.name;
            styles[i].rules = style.Rule ? style.Rule.length : 0;
            styles[i].fields = [];
            for (rule in style.Rule) {
                var filter = style.Rule[rule].Filter ? style.Rule[rule].Filter[0] : '';
                filter = filter.match(/\[[-A-Za-z0-9_]+\]/g);
                if (!filter) continue;
                for (j = 0; j < filter.length; j++) {
                    if (styles[i].fields.indexOf(filter[j]) === -1) {
                        styles[i].fields.push(filter[j]);
                    };
                };
            };
        };
        styles.sort(function(a,b) {
            if (a.rules > b.rules) { return -1; };
            if (a.rules < b.rules) { return 1; };
            return 0;
        });
        console.log(JSON.stringify(styles, null, 2)); });
});
