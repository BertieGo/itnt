const CHINESE_REG = `([\u4e00-\u9faf]|[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b])`;

const DOUBLE_SLASH_ANNOTATION_REG = /\/\/.*/gm;

const MULTI_LINE_ANNOTATION_REG = /\/\*[^\/]*\*\//gm;

module.exports = {
    CHINESE_REG,
    DOUBLE_SLASH_ANNOTATION_REG,
    MULTI_LINE_ANNOTATION_REG,
};