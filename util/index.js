const fs = require('fs');
const path = require('path');
const md5 = require('crypto-js/md5');
const colors = require('colors');
const { SYSTEM, REG, NOTICE } = require('../constants');

const config = getConfig();

function exit() {
    process.exit(1);
}

function splitConfig(c) {
    if (!c) {
        return [];
    }
    return c.split('|');
}

// 获取所有匹配后缀的文件路径
const getFilesPath = function(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        const _path = `${dir}/${file}`;
        const stat = fs.statSync(_path);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesPath(_path))
        } else {
            const extnameConfigs = splitConfig(config.extname);
            const excluedeExtnameConfigs = splitConfig(config.exclude_extname);

            const isNeedExtname = extnameConfigs.length > 0;
            const isNeedExcluedeExtname = excluedeExtnameConfigs.length > 0;

            const isSatisfyExtname = extnameConfigs.some(ext => path.extname(_path) === `.${ext}`);
            const isSatisfyExcluedeExtname = excluedeExtnameConfigs.every(ext => !file.endsWith(ext));

            if (
                    (isNeedExtname && isNeedExcluedeExtname) && isSatisfyExtname && isSatisfyExcluedeExtname ||
                    (!isNeedExtname && !isNeedExcluedeExtname) ||
                    (!isNeedExtname && isSatisfyExcluedeExtname) ||
                    (!isNeedExcluedeExtname && isSatisfyExtname)
            ) {
                results.push(path.resolve(__dirname, _path))
            }
        }
    });
    return results;
};

function readFile(p, callback) {
    const content = fs.readFileSync(p, "utf8");
    callback(content);
}

// 提取匹配行
function rowsConverter(data) {
    const result = data.content.toString().split(/(?:\r\n|\r|\n|\\n|\\r|\\r\\n)/g);
    return result.map((row, index) =>({
        line: index + 1,
        content: row,
        path: data.path,
    }));
}

// 提取匹配竖行
function columnConverter(data, reg) {
    const result = [];
    data.forEach((item) => {
        const content = item.content;
        const match = content.match(reg);
        let index = 0;
        let matchContent = null;
        if (match) {
            while ((matchContent = reg.exec(content)) !== null) {
                result.push({
                    ...item,
                    column: matchContent.index,
                    match: match[index],
                });
                index = index + 1;
            }
        }
    });
    return result;
}

// 忽略注释
function handleReplaceAnnotation(content) {
    let result = '';

    result = content.replace(REG.MULTI_LINE_ANNOTATION_REG, ($1) => {
        let r = '';
        const lineLen = $1.split(/\r\n|\r|\n/).length - 1;

        new Array(lineLen).fill(0).forEach(() => {
            r = r + getLineBreak();
        });
        return r;
    });

    result = result.replace(REG.DOUBLE_SLASH_ANNOTATION_REG, '');
    return result;
}

// 兼容多系统换行符
function getLineBreak() {
    const system = getCurrentSystem();
    switch (system) {
        case SYSTEM.WIN:
            return `\\r\\n`;
        case SYSTEM.MAC:
            return `\\n`;
        case SYSTEM.LINUX:
            return `\\n`;
        default:
            return `\\r\\n`;
    }
}

function getCurrentSystem() {
    const systems = Object.keys(SYSTEM);
    let result = null;

    try {
        result = SYSTEM[systems.filter(key => SYSTEM[key] === process.platform)[0]];
    } catch (e) {
        result = SYSTEM.WIN;
        new Error('您使用的开发环境不是 MacOS X、Windows、Linux，请切换开发环境或者提 issue');
    }
    return result;
}

function getFilesInfo(entryPath) {
    const result = [];
    const files = getFilesPath(path.resolve(entryPath));
    const regContent = config.greed ? REG.CHINESE_GREED_REG : REG.CHINESE_REG;
    const reg = new RegExp(`${regContent}`, 'g');

    files.forEach((p) => {
        readFile(p, (c) => {
            const content = handleReplaceAnnotation(c);
            const data = {
                path: p,
                content,
            };
            const rowsContent = rowsConverter(data);
            result.push(columnConverter(rowsContent, reg))
        });
    });
    return result;
}

// 生成 manifest 文件
function handleGenerateManifest(entryDir, outputDir = '') {
    const data = getFilesInfo(entryDir);
    const result = {};
    data.forEach((f) => {
        f.forEach((d) => {
            const hashName = md5(d.match).toString() ;
            result[hashName] = {
                ...d
            }
        })
    });
    const len = Object.keys(result).length;
    fs.writeFile(path.join(outputDir, 'itnt_mainfest.json'), JSON.stringify(result), 'utf8', (err) => {
        if (err) throw err;
        console.log(`文件已被保存, 一共有 ${len} 条数据`);
    });
}

// 获取命令行参数
function getArgv() {
    const envArgv = process.argv.slice(2);
    let env = {};
    envArgv.forEach(function (e, index) {
        const content = e.split('=');
        const [k, v] = content;
        env[k] = v;
    });
    return env;
}

function getConfig() {
    let config = {};
    const env = getArgv();
    const configJsonPath = './.itnt_config.json';

    if (fs.existsSync(configJsonPath)) {
        config = JSON.parse(fs.readFileSync('./.itnt_config.json', 'UTF-8'));
    }

    if (Object.keys(env).length > 0) {
        config = Object.assign(config, env);
    }

    return config;
}

function entry() {
    const { entry, output } = config;
    if (!entry) {
        console.log(`You have not set entry path yet, ${NOTICE.GITHUB}`.red);
        exit();
    }

    if (!fs.existsSync(entry)) {
        console.log(`The entry path is not a exist file or directory, check entry path or ${NOTICE.GITHUB}`.red);
        exit();
    }

    handleGenerateManifest(entry, output);
}

module.exports = {
    getFilesPath,
    readFile,
    rowsConverter,
    columnConverter,
    getLineBreak,
    handleReplaceAnnotation,
    entry
};
