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

## 命令列表

- `grunt page` 将对`abc.json`中指定的 page 进行打包
- `grunt widget` 将对`abc.json`中指定的 widget 进行打包
- `grunt build` 将对`abc.json`中指定的 page 和 widget 进行打包
- `grunt common` 将对 common 进行打包
- `grunt all` 将对项目中所有的 page、widget 以及 common 进行打包
- `grunt` 同 `grunt all`
- `grunt watch` 对`abc.json`中指定的 page 和 widget 以及 common 进行监控

