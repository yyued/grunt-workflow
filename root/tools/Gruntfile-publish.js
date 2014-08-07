module.exports = function(grunt) {

    'use strict';

    var path = require('path');
    var pkg = require('../package');
    var proj_namespace = path.join(pkg.description, pkg.name, pkg.version, '/');

    var configObj = {
        
        clean: {
            svn: [".tmp_svn"]
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
        },
        push_svn: {
            options: {
                message: '初始化项目：' + pkg.name,
                username: 'liujianxin',
                password: 'g2551',
                trymkdir: true
            },
            assets: {
                src: 'dest',
                dest: 'http://svn.duowan.com:9999/svn/web/program/assets/' + proj_namespace,
                tmp: '.tmp_svn'
            }
        }
    };

    // 提交dest到静态文件svn
    grunt.task.registerTask('assets', 'commit message', function(arg) {
        grunt.config.merge(configObj);
        grunt.config.merge({
            push_svn:{
                options: {
                    message: arg,
                    pushIgnore: ['*.html', '.DS_Store', '.idea/**', '.tmp_svn/**', '.svn/**']
                }
            }
        })
        grunt.task.run(['push_svn:assets', 'clean:svn']);
    });

};