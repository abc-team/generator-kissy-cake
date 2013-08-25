A yeoman generator for KISSY-Cake

[![Build Status](https://secure.travis-ci.org/abc-team/generator-kissy-cake.png)](http://travis-ci.org/abc-team/generator-kissy-cake)

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
            "pages": [ "home" ],
            "widgets": [ "tooltip" ]
        }
    }
```

设置你需要打包的page，和widget：

如，需要打包`index`页面，以及widget `slide`:

```js
    "defaults": {
        "pages": [ "index" ],
        "widgets": [ "slide" ]
    }
```

## 从KISSY-Pie迁移到KISSY-Cake

使用`yo kissy-cake:migrate`来进行目录的迁移

## 查看版本信息以及命令列表

- `yo kissy-cake:help` 

