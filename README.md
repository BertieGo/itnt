### itnt - 提取中文脚本 
> 基于 node 开发, 运行启动命令之前请先关注下面的 Config 和 Json 说明。  

### Usage

````
node ./index.js
````

该脚本会根据运行目录下的 ``.itnt_config.json`` 去获得运行配置，然后再根据 config 内的 ``output`` 输出 ``itnt_mainfest.json``
文件，假如 ``output`` 为空，那么在运行目录下创建该文件。

### Config
举例：
````
{
  "entry": "{your path}/coding-frontend/coding-front-v2/packages/enterprise",
  "extname": "js|jsx|ts|tsx",
  "exclude_extname": "spec.js|emojiMap.js",
  "output": "",
  "greed": true
}
````
- entry: 目标目录
- extname： 目标文件后缀
- exclude_extname： 忽略的文件后缀
- 输出结果 json 文件
- greed: 是否开启贪婪的匹配模式  
假如开启：
```` 测试${test}代码 ```` 将匹配为一项： ```` 测试${test}代码 ````   
假如关闭：
```` 测试${test}代码 ```` 将匹配为两项： ```` 测试 ```` ，````代码 ```` 

### Json
```angular2html
{
  "17a26a8a6a4772503ce1ea42596a2484": {
    "line": 1,
    "content": "图片已成功粘贴至 ${result.data.project.name} 项目中",
    "path": "/Users/huangwei/learn/itnt/test/index.js",
    "column": 0,
    "match": "图片已成功粘贴至"
  },
  "7d4fc45a38be1bff8afbd830f2159126": {
    "line": 1,
    "content": "图片已成功粘贴至 ${result.data.project.name} 项目中",
    "path": "/Users/huangwei/learn/itnt/test/index.js",
    "column": 37,
    "match": "项目中"
  },
  "e5d98149f4b61309b5670e85b8b29310": {
    "line": 2,
    "content": "正在前往 {name || ''} SSO 平台登录",
    "path": "/Users/huangwei/learn/itnt/test/index.js",
    "column": 0,
    "match": "正在前往"
  },
  "b6e8fb41065991e08db33a99be9f47b9": {
    "line": 2,
    "content": "正在前往 {name || ''} SSO 平台登录",
    "path": "/Users/huangwei/learn/itnt/test/index.js",
    "column": 22,
    "match": "平台登录"
  },
}
```
- line: 匹配行
- content： 匹配行原内容
- path：匹配文件路径
- column： 匹配竖列
- match： 匹配内容