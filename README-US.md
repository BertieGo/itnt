# itnt
Well，it's a practical utility that helping you to search Chinese words and emit the json file with match words in project, next move, I will support this tool to replace Chinese words by automatic，it depends library [rc-i18n](https://github.com/BertieGo/react-i18n) that own it-self way to make
internationalization plan，it will coming soon 🎉

### Usage

### 1. Set config  
|  config  |  value(example) |  description | 
|  ----  | ----  | ---- | 
| entry  | ./directory | the directory to be searched  | 
| extname  | js&#124;jsx | the suffix of the matched file|
| exclude_extname | test.js&#124;test2.jsx| the suffix of the excluded file|
| output  | ./directory | the directory to emit `` itnt_mainfest.json``, | 
| greed  | bool | whether open greed mode | 


We have two ways to set tool's config
- Make ``.itnt_config.json``

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