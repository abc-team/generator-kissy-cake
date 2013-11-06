## v0.4.1
- 添加对stylus的支持
- 添加总体打包时间，单个任务打包时间的log
- 添加图片从src复制到build的功能
- 修正git发布操作中错将参数patch拼写pitch的错误

## v0.4.0
- 添加用户使用的统计插件，方便后续优化
- 修改watch组件到0.5.x，默认`grunt watch`为整站watch，添加`--few`为针对abc.json的watch
- 添加仓库KISSY版本信息的记录
- 添加对bower的支持，在abc.json中设置依赖，`grunt install`来安装依赖，使用`grunt search`进行组件搜索
- 添加git操作命令：创建新分支，切换分支，预发布，发布
- 所有的多进行任务的实现改用 `grunt-multi` 来实现。
- 新增命令信息请使用`yo kissy-cake:help`查看
- 变更较多，请谨慎升级!

## v0.3.7
- 更新界面

## v0.3.6
- 去掉了ks-debug模式将引用`src`的调试模式，使用KISSY默认方式，引用未压缩的合并文件
- 添加Compass直接生成Gitlab发布路径雪碧图功能
- 自动检查更新功能添加CHANGELOG读取
- 添加对于Web Font的打包支持
- 修复CSS-Combo打包，原码UTF-8，打包后GBK的问题
- 在package.json中添加`version`字段，防止部分版本npm安装依赖报错
- 解决watch目标若超过5个则多处的不进行watch的bug
- 优化测试用力，windows下完全通过

## v0.3.5
- 升级界面

## v0.3.4
- 升级界面

## v0.3.3
- 统一和优化了log输出
- 添加了help命令
- 修改SASS初始化文件中的注释为英文，避免因为中文出现编译出错的问题
- 简化widget的初始化文件
- 添加对于新建page或者widget用户输入中包含空格的处理
- 针对迁移脚本添加文件编码转化功能
- 添加.npmignore，避免test被打包
- 更新gruntfile-helper到0.0.9，修复自动更新的功能

## v0.3.2

更新UI，支持最新的目录结构和Gruntfile

## v0.3.1

更新abc-gruntfile-helper到0.0.8，修正自动检查更新的问题。

## v0.3.0

1、去掉了pages目录中的原码版本目录
2、修正了对应的migrate
3、强制设定abc-gruntfile-helper的版本
4、优化了package-config.js文件

## v0.2.0

1、优化css_combo的配置
2、优化common目录，打包层级为任意
3、去掉了uglify的输出banner，压缩目标为任意层级
4、修改cssmin压缩层级为任意层级
5、更新grunt-css-combo依赖到0.2.2
6、更新abc-gruntfile-helper依赖到0.0.4
7、修正less的paths设置
8、暂时先去掉对于页面版本的版本号格式限制
9、添加持续集成
10、添加common的watch功能
