A yeoman generator for KISSY-Cake

[![Build Status](https://secure.travis-ci.org/neekey/generator-kissy-cake.png)](http://travis-ci.org/neekey/generator-kissy-cake)

## install

### 安装yeoman & grunt
````sh
npm install yo grunt-cli -g
````

### 安装Generator

第一步:

```sh
$ npm install generator-kissy-cake -g
```

第二步, 在你的应用目录内:

```sh
$ mkdir my-app && cd myapp
$ yo kissy-cake # 初始化目录
```

第三步，创建page

```sh
$ yo kissy-cake:page
```

## 快速使用

打开`abc.json`，找到这个部分：

```js

    "_kissy_cake" : {
        "groups": {},
        "styleEngine": "sass",
        "defaults": {
            "pages": [ "home/v1" ],
            "widgets": [ "tooltip" ]
        }
    }
```

设置你需要打包的page，和widget：

如，需要打包`index`页面的`v1`版本，以及widget `slide`:

```js
    "defaults": {
        "pages": [ "index/v1" ],
        "widgets": [ "slide" ]
    }
```

之后则可以直接使用 `grunt` 或者 `grunt build`进行打包，或者使用`grunt common`对common目录进行打包。
另外还可以使用`grunt watch`进行文件监控。

