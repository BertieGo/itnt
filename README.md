# itnt
这是基于 node 开发用于搜索文件内中文的工具，该工具目前支持搜索特定目录下的所有文件，并将匹配到的文件输出到 ``itnt_mainfest.json`` 内，下一步，我将会根据 [rc-i18n](https://github.com/BertieGo/react-i18n) 国际化方案去将匹配到的中文硬编码替换为 React 代码， coming soon...🎉

## 使用指南

### 1. 配置脚本
|   字段  |  值 |  描述 | 
|  ----  | ----  | ---- | 
| entry  | ./directory | 入口目录，默认为脚本执行的目录 | 
| extname  | js&#124;jsx | 要匹配的文件后缀|
| exclude_extname | test.js&#124;test2.jsx| 要排除的文件后缀|
| output  | ./directory | 输出`` itnt_mainfest.json``文件的目录，默认为脚本执行的目录| 
| greed  | bool | 是否开启贪婪模式，默认不开启 | 

> greed :   
假如开启：
```` 测试${test}代码 ```` 将匹配为一项： ```` 测试${test}代码 ````   
假如关闭：
``` 测试${test}代码 ```` 将匹配为两项： ```` 测试 ```` ，````代码 ````   


> 在匹配 js 文件的时候，会自动忽略注释，只匹配实际生效代码。


我们有两种方式去设置配置选项：  
**命令行的优先级高于配置文件**  
- #### .itnt_config.json
创建```.itnt_config.json```文件在脚本运行目录下，例如：
````
{
  "entry": "{your path}/entry-directory",
  "extname": "js|jsx|ts|tsx",
  "exclude_extname": "spec.js|some.jsx",
  "output": "{your path}/output-directory",
  "greed": true
}
````
- #### 命令行

````
itnt entry={your path}/entry-directory extname=js|jsx|ts|tsx
````

该脚本会根据运行目录下的 ``.itnt_config.json`` 去获得运行配置，然后再根据 config 内的 ``output`` 输出 ``itnt_mainfest.json``
文件，假如 ``output`` 为空，那么在运行目录下创建该文件。


### 生产文件 ``itnt_mainfest.json`` 示例

```angular2html
{
  "17a26a8a6a4772503ce1ea42596a2484": {
    "line": 1,
    "content": "图片已成功粘贴至 ${project.name} 项目中",
    "path": "/Users/huangwei/learn/itnt/test/index.js",
    "column": 0,
    "match": "图片已成功粘贴至"
  },
  "7d4fc45a38be1bff8afbd830f2159126": {
    "line": 1,
    "content": "图片已成功粘贴至 ${project.name} 项目中",
    "path": "/Users/huangwei/learn/itnt/test/index.js",
    "column": 37,
    "match": "项目中"
  },
  "e5d98149f4b61309b5670e85b8b29310": {
    "line": 2,
    "content": "测试文本",
    "path": "/Users/huangwei/learn/itnt/test/index.js",
    "column": 0,
    "match": "测试文本"
  },
}

```
- line: 匹配行
- content： 匹配行原内容
- path：匹配文件路径
- column： 匹配竖列
- match： 匹配内容