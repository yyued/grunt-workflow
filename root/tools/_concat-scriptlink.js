module.exports = function (){

var path = require('path')
var fs = require('fs')
var _ = require('../node_modules/grunt-contrib-compress/node_modules/archiver/node_modules/lodash')

// config
var ASSETS_ROOT = 'http://assets.dwstatic.com/' 
var HOOK_SCRIPT = 'data-script'
var cwd = path.join(__dirname, '..')
var source = path.join(cwd, 'assets', 'dest')
var target = path.join(cwd, 'assets', 'dest')
var sourceIgnore = ['.svn', 'css', 'img', 'js']
var errMsg


// main

// 1. sync read *.html, get [htmls]

// 2. iterator each html file, do
	// get [links] by HOOK_SCRIPT and clacURL(url)
	// generate insertScriptSnippet by [links]
	// delete HOOK_SCRIPT lines, replace firstHit by insertScriptSnippet

var patternScriptTag = new RegExp('<script([^>]*'+HOOK_SCRIPT+'[^>]*)>(</script>)?', 'g') 
var patternScriptSrc = new RegExp('src=[\'\"]'+'http://assets\.dwstatic\.com/'+'([^\'\"]*)[\'\"]', 'g')
var files = listFiles(source, sourceIgnore)
_.each(files, function(file){
	var outputText = transHTML(file)
	var outputFile = path.resolve(target, path.relative(source, file))
	fs.writeFileSync(outputFile, outputText, 'utf8')
})

// if no need to transform html, still return original file
function transHTML(html){
	var links = []
	var text = fs.readFileSync(html, 'utf8')
	while (scripts = patternScriptTag.exec(text)){
		while (match = patternScriptSrc.exec(scripts[1])){
			links.push(calcURL(match[1]))
		}
	}
	var firstScript = patternScriptTag.exec(text) 
	if(firstScript){
		// calcURL each [links] item, and get scriptInsert
		var fnReduce = function(last, next){return last+','+next}
		var linkStr = ASSETS_ROOT+'f='+_.reduce(links, fnReduce)
		var scriptSnippet = '<script src="'+linkStr+'"></script>'

		return text.replace(firstScript[0], scriptSnippet).replace(patternScriptTag, '')
	}
	return text
}

// resolve to absolute path url
// var URL_TAG_ROOT = 'b='
// var URL_TAG_PATH = 'f='
function calcURL(url){
	var indexRoot = url.indexOf('b=')
	var indexPath = url.indexOf('f=')
	if(~indexPath){
		var urls = url.substring(indexPath+2).split(',')
		if(~indexRoot){
			var root = url.substring(indexRoot+2, indexPath-1)
			var urls = _.map(urls, function(p){
				return path.join(root, p)
			})
		}
		var resolveURL = _.reduce(urls, function(last, next){
			return last+','+next
		})
		return resolveURL
	}
	return url
}


// utils

// excldList: 1)suffix file; 2)dir
function listFiles (f, excldList) {
	var filelist = [], dirlist = [];
    var dir = fs.lstatSync(f).isDirectory() ? f : path.dirname(f);
    var filelistTemp = fs.readdirSync(dir).filter(function (file) {
        return fs.statSync(path.join(dir, file)).isFile() && !_hasItem(excldList, file);
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

    return filelist
}
function _hasItem(arr, item){
	arr = arr||[]
	var result = false
	arr.forEach(function(e){
		if(e === item){result=true}
	})
	return result
}


}