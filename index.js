#!/usr/bin/env node
const path = require('path');
const util = require('./util');
const { REG } = require('./constants');

// console.log(getFiles(path.resolve('./test')));

const files = util.getFiles(path.resolve('./test'));

const targetFiles = files.filter(file => path.extname(file) === '.js');

// const a = 'name:angelica';
// const reg = /(?<!nick_name:)(angelica)/;
//
// console.log(a.match(reg))

targetFiles.forEach((path) => {
    util.readFile(path, (c) => {
        const content = util.handleReplaceAnnotation(c);
        const reg = new RegExp(`${REG.CHINESE_REG}+`, 'g');
        var match = content.match(reg);

        const data = {
            path,
            content,
        };
        const rowsContent = util.rowsConverter(data);
        console.log(util.columnConverter(rowsContent, reg))
    });
});



