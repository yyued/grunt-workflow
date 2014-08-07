module.exports = function(grunt) {

    'use strict';

    var path = require('path');
    var fs = require('fs');
    var ipAddress = require('network-address')();
    var middleware_directory = require('grunt-contrib-connect/node_modules/connect/lib/middleware/directory');
    var middleware_renderfile = require('./_middleware-render-ejs');

    grunt.initConfig({

        connect: {
            site_src: {
                options: {
                    hostname: ipAddress,
                    port: 9000,
                    base: ['src/'],
                    livereload: true,
                    open: true, //打开默认浏览器
                    middleware: [
                        middleware_renderfile,
                        middleware_directory(path.resolve('src/'))
                    ]
                }
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
        watch: {
            css: {
                files: ['src/sass/{,*/}*.scss'],
                tasks:['sass','autoprefixer']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: ['src/*.html', 'src/css/*.css', 'src/js/*.js', 'src/partial/*.ejs', 'src/data/*.json']
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
        }
    });

    // 默认任务
    grunt.registerTask('default', ['connect:site_src', 'watch']);

    // 自定义端口
    grunt.task.registerTask('port', 'multi port', function(arg) {
        if(arguments.length === 0){
            console.log('端口号不能为空！')
        }else{
            grunt.config.set('connect.port'+arg,{
                options: {
                    hostname: ipAddress,
                    port: arg,
                    base: ['src/'],
                    livereload: +arg+1,
                    open: true,
                    middleware: [
                        middleware_renderfile,
                        middleware_directory(path.resolve('src/'))
                    ]
                }
            });

            grunt.config.set('watch.livereload',{
                options: {
                    livereload: +arg+1
                },
                files: ['src/*.html', 'src/css/*.css', 'src/js/*.js', 'src/partial/*.ejs', 'src/data/*.json']
            })

            grunt.task.run(['connect:port'+arg, 'watch']);
        }
    });


};