module.exports = function(grunt) {

    'use strict';

    var path = require('path');
    var pkg = require('../package');
    var proj_namespace = path.join(pkg.description, pkg.name, pkg.version, '/');
    var ASSETS_URL = 'http://lol.duowan.com/s/MMStarChannel/';

    var configObj = {
        clean: {
            zip: ["assets"]
        },
        copy: {
            zip_dest: {
                expand: true,
                cwd: 'dest/',
                src: ['js/{,*/}*', 'img/{,*/}*', 'css/*'],
                dest: 'assets/dest'
            },
            zip_src: {
                expand: true,
                cwd: 'src/',
                src: ['**', '!sass', '!sass/{,*/}*', '!css/*.map', '!img/psd','!img/psd/{,*/}*'],
                dest: 'assets/src'  
            }
        },
        concat: {
            trans_html: {
                options: {
                    process: function(src, filepath) {
                        var regex = /((href|src)=['"][\s]*)(?!http[s]?\:|\#|\/)([\?\#\=\/\w._-]*)([\s]*['"])/g;
                        return src.replace(regex, '$1'+ASSETS_URL+'$3$4');
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'dest/',
                    src: '*.html',
                    dest: 'assets/dest/'
                }]
            }
        },
        compress: {
            zip: {
                options:{
                    archive: 'assets.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'assets/',
                    src: '**'
                }]
            }
        }
    };

    // release后，zip打包
    grunt.task.registerTask('zip', function(){
        grunt.config.merge(configObj)
        grunt.task.run(['copy:zip_src', 'copy:zip_dest', 'concat:trans_html', 'compress:zip', 'clean:zip'])
    })
    
    // 只替换线上路径，不打包
    grunt.task.registerTask('trans', function(){
        grunt.config.merge(configObj)
        grunt.task.run(['clean:zip', 'copy:zip_src', 'copy:zip_dest', 'concat:trans_html'])
    })
};