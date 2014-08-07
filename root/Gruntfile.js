module.exports = function(grunt) {

    'use strict';
    require('load-grunt-tasks')(grunt)
    require('./tools/Gruntfile-dev')(grunt)
    require('./tools/Gruntfile-release')(grunt)
    require('./tools/Gruntfile-publish')(grunt)
    require('./tools/Gruntfile-zip')(grunt) 

    return grunt;
};