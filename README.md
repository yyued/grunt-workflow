#多玩前端工作流

版本: 0.1.3

##这是什么

这是一个帮助前端开发工程师简化工作的工具，它的主要功能是：

1. webserver
2. livereload，能保存文件的时，自动刷新浏览器. 
3. 自动编译sass
4. 压缩图片
5. 合并图片
6. 添加文件注释
7. 自动补全css3浏览器前缀
8. 初始化项目目录结构及文件
9. 支持ejs模板

##安装相关软件

1. 安装 nodejs [window 安装地址](http://nodejs.org/) ， mac 推荐通过brew安装```brew install node```
2. 安装 grunt-cli ```npm install -g grunt-cli```
3. 安装 grunt-init ```npm install -g grunt-init```
4. 将当前git克隆到本地```%USERPROFILE%\.grunt-init\```（Mac平台 ```~/.grunt-init/```），如果没有```.grunt-init```目录可用```mkdir .grunt-init```命令创建
5. 安装 Graphics Magick(gm)，[下载地址](http://www.graphicsmagick.org/download.html) (Mac平台 ```brew install GraphicsMagick```)
6. 安装 PhantomJS，[下载地址](http://phantomjs.org/download.html) (Mac平台 ```brew install phantomjs```)
7. 安装 sass ```gem install sass ```

##初始化新项目

1. 在项目目录下执行 ```grunt-init lego``` (注意：项目目录要为空文件夹，不然会报错)
2. 根据提示填写相关的内容
3. 执行 ```npm install``` 命令下载安装相关依赖


###快速在当前文件夹打开命令行

* __win7__:首先按住Shift键，然后选择某文件夹后或在某文件夹中的空白处右键单击，快捷菜单中会多出“在此处打开命令窗口”，选择这个选项即可
* __Mac__:安装 [gotoshell](https://itunes.apple.com/ca/app/go2shell/id445770608?mt=12)


###建立软链接

使用下面命令能避免每次在新项目开始前都要使用 ```npm install``` 下载相关的grunt插件

* __window__: - ```mklink /d .\node_modules C:\Users\Administrator\Desktop\grunt_plugins\node_modules```
* __mac__:```ln -s ~/Documents/grunt_plugins/node_modules ./node_modules``` (```~/Documents/grunt_plugins/node_modules```) 目录是存放grunt插件的文件夹


##项目目录结构
```
└── src
    ├── _index.html
    ├── css
    │   └── lib
    ├── img
    ├── js
    │   └── lib
    ├── sass
    ├── partial
    ├── data
    └── slice
```

1. html页面存放在src文件夹，支持ejs模板（见5）。
2. css存放在 **src/css** 文件夹，第三方的样式库放在 **src/css/lib**
3. js存放在 **src/js** 文件夹，第三方的样式库放在 **src/js/lib**
4. **src/slice** 文件夹放需要合并的图片；若需要多张雪碧图，则自建子文件夹，一个子文件夹对应一张雪碧图，子文件名为雪碧图名（注意，需要替换雪碧图的css文件，切片使用`background-image`属性来引入，不使用`background`属性引入。）
5. ejs模板片段放在**src/partial**文件夹，模板数据放在**src/data**文件夹。配置数据统一在**src/data/config.json**指定（注意：没有配置的html页面不参与ejs渲染）。

注意：src/css/lib 和 src/js/lib 里的文件是不会被压缩的。

##任务
项目安装好了相关的配置就可以在命令行下使用grunt任务

###grunt
默认打开一个webserver，查看的文件是在开发目录下，支持livereload，sass自动编译，ejs编译

###grunt port:端口号
指定端口打开一个webserver，查看的文件是在开发目录下，支持livereload，sass自动编译，ejs编译

###grunt release
生成发布文件，执行```gunt release```生成一个dest的目录，里面包含：编译后的html，压缩css、js文件，自动生成sprit图片，替换css样式里的链接，dest里的文件是发布使用的。

###grunt dest
打开一个webserver，显示dest目录

###grunt assets:提交注释
提交dest里面的静态文件（css、js、img）到静态文件服务器，提交路径为`%SVN_REMOTE_DIR%/<description>/<name>/<version>`，详见注意事项。


###grunt zip
打包src和dest文件给技术。其中dest文件夹作如下处理：将 `dest/*.html` 的 __相对路径的静态资源__ 引用替换为线上路径；若不需替换，资源路径换成 __绝对路径__ 。

该命令在```grunt release```后执行，线上路径由 __包描述文件__（见注意事项） 指定。```dest```里的静态资源可通过`grunt assets`或手动上传到assets服务器。


## 可选配置
配置文件： ```~/.grunt-init/config.json```

* ```IS_EXEC_CUSTOM_CMD``` 是否启用初始化时执行默认命令，默认不启动。
* ```LINK_SRC_NODE_MODULES``` 建立node_modules软链接的源路径。(建议mac用户指定到```~/.node_modules```， win用户指定到```%USERPROFILE%\.node_modules```)
* ```OPEN_APP``` 初始化目录后启动APP打开当前项目。

##注意事项
* 提交到 svn-work 时（需手动提交），只上传配置文件 **Gruntfile.js** 、 **package.json** 和源码文件夹 **src/** 即可
* 提交到 svn-assets 时，需
	1. 修改模板文件`~/.grunt-init/lego/root/Gruntfile.js`里面`push_svn`任务的用户信息
	2. 在`grunt-init lego`时注意以下字段的填写，或者在初始化后的 **package.json** 中修改对应字段
		* description，项目类型，取值：project、game、special
		* name，项目名，不要出现中文字符
		* version，项目版本，默认值：1.0.0
	
	说明：svn-assets提交路径为`%SVN_REMOTE_DIR%/<description>/<name>/<version>`，对应线上路径为 `http://assets.dwstatic.com/<description>/<name>/<version>`
	



