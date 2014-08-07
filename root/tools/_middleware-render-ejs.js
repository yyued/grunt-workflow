module.exports = function (req, res, next){

var path = require('path');
var fs = require('fs');

var get_files = require('../node_modules/grunt-adiejs-static/lib/get_files').get_files,
    get_data = require('../node_modules/grunt-adiejs-static/lib/data').get_data,
    get_layout = require('../node_modules/grunt-adiejs-static/lib/layout').get_layout,
    render_file = require('../node_modules/grunt-adiejs-static/lib/render').render_file,
    write_file = require('../node_modules/grunt-adiejs-static/lib/write_file').write_file,
    get_helper_functions = require('../node_modules/grunt-adiejs-static/lib/get_helper_functions').get_helper_functions,
    ejs_static = require('../node_modules/grunt-adiejs-static/lib/ejs_static'),
    _ = require('../node_modules/grunt-adiejs-static/node_modules/underscore'),
    accepts = require('../node_modules/grunt-contrib-connect/node_modules/connect/node_modules/serve-index/node_modules/accepts'),
    url = require('url');

    var reqPathName = decodeURIComponent(url.parse(req.originalUrl).pathname),
        reqFileName = reqPathName.substring(reqPathName.lastIndexOf('/')+1),
        localPathName = path.resolve('src/', reqPathName.substring(1)),
        renderedFile;

    fs.readFile(localPathName, function(err, file) {
        if (err) {return next();}

        var options = {
            path_to_data: 'src/data/config.json',
            file_extension: '.html',
            underscore: true
        },
            config_cover = ejs_static.get_files(options),
            config_default = {}, 
            htmlfiles;  // local html file array
        fs.readdir(path.resolve('src/'), function(err, arr) {
            if (err) {console.log(err)}

            htmlfiles = _.filter(arr, function(item) {
                return item.lastIndexOf('.html') !== -1;
            });
            htmlfiles = _.map(htmlfiles, function(item) {
                return item.substring(0, item.lastIndexOf('.html'));
            });

            // cover config_default by config_cover
            _.each(htmlfiles, function(item) {
                config_default[item] = {};
                config_default[item]['path_to_layout'] = (config_cover[item] && config_cover[item]['path_to_layout']) || 'src/' + item + '.html';
                config_default[item]['path_to_data'] = (config_cover[item] && config_cover[item]['path_to_data']) || ["src/data/global.json"];
            });

            Object.keys(config_default).forEach(function(key) {
                if (reqFileName === key + options.file_extension) {
                    var fileData = ejs_static.get_data(key, config_default);
                    var layoutData = ejs_static.get_layout(key, config_default, options);
                    renderedFile = ejs_static.render_file(layoutData, fileData, _.extend({}, _));
                }
            });

            // set the correct media-type, default 'text/plain'
            var type = accepts(req).types('text/plain', 'text/html', 'application/json', 'text/css', 'application/javascript', 'application/x-javascript', 'application/x-font-woff');
            switch(type){
                case 'text/css':
                    res.setHeader('Content-Type', 'text/css');
                    break;
                case 'application/javascript':
                    res.setHeader('Content-Type', 'application/javascript');
                    break;
                case 'application/x-javascript':
                    res.setHeader('Content-Type', 'application/x-javascript');
                    break;
                case 'text/plain':
                    req.url.lastIndexOf('.js')!==-1 && res.setHeader('Content-Type', 'application/javascript');
                    req.url.lastIndexOf('.css')!==-1 && res.setHeader('Content-Type', 'text/css');
                    req.url.lastIndexOf('.woff')!==-1 && res.setHeader('Content-Type', 'application/x-font-woff');
                    req.url.lastIndexOf('.svg')!==-1 && res.setHeader('Content-Type', 'application/x-font-svg');
                    break;
            }
            res.end(renderedFile || file);
        });
    });
};