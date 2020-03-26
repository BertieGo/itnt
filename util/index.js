const fs = require('fs');
const path = require('path');
const { SYSTEM, REG } = require('../constants');

const getFiles = function(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        // 排除static静态目录（可按你需求进行新增）
        if (file === 'static') {
            return false;
        }
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file))
        } else {
            // 过滤后缀名（可按你需求进行新增）
            results.push(path.resolve(__dirname, file))
        }
    });
    return results;
};

function readFile(path, callback) {
    fs.readFile(path, "utf8", (err, data) => {
        if (err) throw err;
        callback(data);
    });
}

function rowsConverter(data) {
    const result = data.content.toString().split(/(?:\r\n|\r|\n|\\n|\\r|\\r\\n)/g);
    return result.map((row, index) =>({
        line: index + 1,
        content: row,
        path: data.path,
    }));
}

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

function handleReplaceAnnotation(content) {
    let result = '';

    result = content.replace(REG.MULTI_LINE_ANNOTATION_REG, ($1, index, origin) => {
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

module.exports = {
    getFiles,
    readFile,
    rowsConverter,
    columnConverter,
    getLineBreak,
    handleReplaceAnnotation
};
