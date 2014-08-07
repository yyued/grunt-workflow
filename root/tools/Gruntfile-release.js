module.exports = function(grunt) {

    'use strict';

    var path = require('path');
    var fs = require('fs');
    var pkg = require('../package');
    var ipAddress = require('network-address')();
    var checkAssets = require('./_check-assets');

    var configObj = {

        // 全局变量
        banner: '/*! Project: '+pkg.name+'\n *  Version: '+pkg.version+'\n *  Date: <%= grunt.template.today("yyyy-mm-dd hh:MM:ss TT") %>\n *  Author: '+pkg.author.name+'\n */',

        connect: {
            site_dest: {
                options: {
                    hostname: ipAddress,
                    port: 9001,
                    base: ['dest/'],
                    keepalive: true, //保持sever不退出
                    open: true //打开默认浏览器
                }
            }
        },
        cssmin: {
            options: {
                banner: '<%= banner %>'
            },
            minify: {
                expand: true,
                cwd: 'dest/css',
                src: ['*.css', '!*.min.css'],
                dest: 'dest/css',
                ext: '.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                preserveComments: 'some',
                mangle: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dest/js',
                    src: '**/*.js',
                    dest: 'dest/js'
                }]
            }
        },
        clean: {
            build: ["dest"],
            release: ["dest/slice", "dest/data", "dest/partial"]
        },
        copy: {
            release: {
                expand: true,
                cwd: 'src/',
                src: ['**', '!sass', '!sass/{,*/}*', '!css/*.map', '!img/psd','!img/psd/{,*/}*'],
                dest: 'dest/'
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 2 versions', 'ff 17', 'opera 12.1', 'ie 8']
            },
            dist: {
                expand: true,
                flatten: true,
                src: 'src/css/*.css',
                dest: 'src/css/'
            }
        },
        imagemin: {
            options: {
                pngquant: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dest/img/',
                    src: ['**/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
                    dest: 'dest/img/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                }]
            }
        },
        adisprite: {
            all: {
                srcCss: 'dest/css',
                srcImg: 'dest/slice',
                destCss: 'dest/css',
                destImg: 'dest/img/sprite',
                'padding': 5,
                'algorithm': 'binary-tree',
                'engine': 'gm',
                'exportOpts': {
                    'format': 'png',
                    'quality': 90
                }
            }
        },
        sass: {
            dist: {
                options: {
                    outputStyle: 'expanded',
                    //nested, compact, compressed, expanded
                    sourceComments: 'map',
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/sass',
                    src: ['*.scss','!_*.scss','!*/_*.scss'],
                    dest: 'src/css',
                    ext: '.css'
                }]
            }
        },
        ejs_static: {
            release:{
                options: {
                    dest: 'dest/',
                    path_to_data: 'src/data/config.json',
                    path_to_layouts: 'src/',
                    underscores_to_dashes: false,
                    file_extension: '.html',
                    underscore: true
                }
            }
        }
    };


    // webserver 查看发布目录
    grunt.registerTask('dest', function(arg){
        grunt.config.merge(configObj)
        grunt.task.run(['connect:site_dest'])
    })

    // 发布任务
    grunt.registerTask('release', function(){
        grunt.config.merge(configObj)
        grunt.task.run(['sass', '__checkAssets', 'autoprefixer', 'clean:build', 'copy:release', 'adisprite', 'cssmin', 'uglify', 'imagemin', 'ejs_static:release', 'clean:release', 'connect:site_dest'])
    })

    // 坚持样式表是否存在无效的本地资源
    grunt.registerTask('__checkAssets', function(){
        var isError = checkAssets()
        if(isError){
            grunt.log.error(isError)
            process.abort();
        }
    })
     
};