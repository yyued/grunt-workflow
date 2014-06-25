/*
 * grunt-init-art
 * Copyright (c) 2013 Zikkeung
 */

'use strict';

// 模板简单介绍信息
exports.description = 'DuoWan ART Seed project';

// 开始回答项目相关问题前，控制台打印的相关信息
exports.notes = '提供多玩workflow配置文件及项目目录结构';

// 开始回答项目相关问题前，控制台打印的相关信息
exports.after = '项目主框架已经搭建好了，现在可以coding' + '\n\n' + '1、npm install 安装项目依赖的node模块\n' + '2、grunt 运行任务，包括文件压缩、合并、校验等\n\n';

//如果运行grunt-init运行的那个目录下，有目录或文件符合warOn指定的模式
// 则会跑出警告，防止用户不小心把当前目录下的文件覆盖了，一般都为*，如果要强制运行，可加上--force
// 例：grunt-init --force imweb_template
exports.warnOn = '*';

var config = require('./config');
var exec = require('child_process').exec;

// The actual init template.
exports.template = function(grunt, init, done) {

    // 项目创建的时候，需要回答的问题
    init.process({
        type: 'jquery'
    }, [
        // Prompt for these values.
        init.prompt('name'),
        init.prompt('description', ''),
        init.prompt('version', '1.0.0'),
        init.prompt('author_name'),
        init.prompt('homepage')
    ], function(err, props) {
        // A few additional properties.
        // props.jqueryjson = props.name + '.jquery.json';
        // props.dependencies = {
        //     jquery: props.jquery_version || '>= 1'
        // };

        // props.keywords = [];

        // Files to copy (and process).
        var files = init.filesToCopy(props);


        // Add properly-named license files.
        //init.addLicenseFiles(files, props.licenses);

        // Actually copy (and process) files.
        init.copyAndProcess(files, props);

        // 生成package.json，供Grunt、npm使用
        init.writePackageJSON('package.json', {
            "name": props.name,
            "author_name": props.author_name,
            "version": props.version,
            "homepage": props.homepage,
            "description": props.description,
            "devDependencies": {
                "grunt": "*",
                "grunt-contrib-connect": "0.8.0",
                "connect-livereload": "*",
                "grunt-contrib-watch": "*",
                "load-grunt-tasks": "*",
                "network-address": "*",
                "grunt-contrib-clean": "*",
                "grunt-contrib-copy": "*",
                "grunt-contrib-uglify": "*",
                "grunt-contrib-cssmin": "*",
                "grunt-adisprite": "*",
                "grunt-contrib-imagemin": "0.4.1",
                "grunt-contrib-sass": "*",
                "grunt-autoprefixer": "*",
                "grunt-contrib-concat": "*",
                "grunt-contrib-compress": "*",
                "gm": "~1.14.2",
                "grunt-adiejs-static": "*",
                "grunt-push-svn": "*"
            }
        });

        // Generate jquery.json file.
        // init.writePackageJSON(props.jqueryjson, props, function(pkg, props) {
        //     // The jQuery site needs the "bugs" value as a string.
        //     if ('bugs' in props) {
        //         pkg.bugs = props.bugs;
        //     }
        //     return pkg;
        // });

        var join = require("path").join;
        // empty directories will not be copied, so we need to create them manual
        grunt.file.mkdir(join(init.destpath(), 'src/css'));
        grunt.file.mkdir(join(init.destpath(), 'src/img'));
        grunt.file.mkdir(join(init.destpath(), 'src/slice'));
        grunt.file.mkdir(join(init.destpath(), 'src/js/lib'));

        // All done!
        done();


        if(config.IS_EXEC_CUSTOM_CMD){

            if(process.platform === "darwin"||"linux"){
                exec(' ln -s '+config.LINK_SRC_NODE_MODULES+' node_modules ', function (error, stdout, stderr) {
                    console.log('stderr: ' + stderr);
                });
                exec(' open -a "'+config.OPEN_APP+'" . ', function (error, stdout, stderr) {
                    console.log('stderr: ' + stderr);
                });
            }

            if(process.platform === "win32"){
                exec(' mklink /d .\\node_modules '+config.LINK_SRC_NODE_MODULES, function (error, stdout, stderr) {
                    console.log('stderr: ' + stderr);
                });
                exec(' start "" "'+config.OPEN_APP+'" "." ', function (error, stdout, stderr) {
                    console.log('stderr: ' + stderr);
                });
                exec(' ', function (error, stdout, stderr) {
                    console.log('stderr: ' + stderr);
                });
            }
        }

    });

};
