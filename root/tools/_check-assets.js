module.exports = function (){

var log = console.log
var path = require('path')
var fs = require('fs')
var _ = require('../node_modules/grunt-contrib-compress/node_modules/archiver/node_modules/lodash')

var cwd = path.join(__dirname, '..')
var source = path.join(cwd, 'src', 'css')
var target = path.join(cwd, 'src')
var targetIgnore = ['.svn', 'css', 'data', 'js', 'partial', 'sass', '.html', '.map']
var errMsg

// 1. sync read source dir, get [sourceList]
// [calcSource] by sourceList

// 2. sync read target dir, get [targetList]
// [calcTarget] by targetList

// 3. pull calcSource's item out, which exist in [calcTarget]
// if calcSource still have item, means some url not found, then format message


// main
var calcSource = getCalcSource(source)
var calcTarget = listFiles(target, targetIgnore)

_.each(calcTarget, function(t){		
	_.pull(calcSource, t)
})
calcSource = _.map(calcSource, function(s){
	return path.relative(cwd, s)
})
errMsg = showErrorMsg(calcSource)
return errMsg;

function getCalcSource(source){
	var sourceList = getSourceList(source)
	var calcSource = sourceList.map(function(p){
		return path.join(source, p)
	})
	return calcSource
}

function getSourceList(source){
	var sourceList = []
	var reg = /url\(["']?(?!http[s]?)([\w\d\s!.\/\-\_]*\.[\w?#]+)["']?\)/gm
	var files = listFiles(source, targetIgnore)
	_.each(files, function(f){
		var text = fs.readFileSync(f, 'utf8')
		while(match = reg.exec(text)){
			sourceList.push(match[1])
		}
	})
	sourceList = _clearRepeat(sourceList)
	return sourceList
}


// utils
function showErrorMsg(arr){
	var len = +arr.length, msg;
	if(len>0){
		msg = arr.join('\n')
		return 'files no found: '+'\n'+msg;
	}
	return false;
}

// excldList: 1)suffix file; 2)dir
function listFiles (f, excldList) {
	var filelist = [], dirlist = [];
    var dir = fs.lstatSync(f).isDirectory() ? f : path.dirname(f);
    var filelistTemp = fs.readdirSync(dir).filter(function (file) {
        return fs.statSync(path.join(dir, file)).isFile() && !_hasSuffix(excldList, file);
    }).map(function(file){
    	return path.join(dir, file)
    })
    filelist = filelist.concat(filelistTemp)

    var dirlist = fs.readdirSync(dir).filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory() && !_hasItem(excldList, file);
    }).map(function(file){
    	return path.join(dir, file)
    }).forEach(function(f){
    	var filelistTemp = listFiles.call(this, f, excldList)
    	filelist = filelist.concat(filelistTemp)
    })

    return filelist;
};

function _hasSuffix(arr, file){
	var suffix = path.extname(file)
	var result = false
	arr.forEach(function(e){
		if(e === suffix){result=true}
	})
	return result
}

function _hasItem(arr, item){
	arr = arr||[]
	var result = false
	arr.forEach(function(e){
		if(e === item){result=true}
	})
	return result
}

function _clearRepeat(arr){
	var result = []
	for (var i = arr.length - 1; i >= 0; i--) {
		if(!_hasItem(result, arr[i])){
			result.push(arr[i])
		}
	};
	return result
}


}