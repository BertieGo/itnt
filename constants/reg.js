const CHINESE_WORD_REG = `[\u4e00-\u9faf]`;

const CHINESE_PUNCTUATION_REG = `[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]`;

const CHINESE_REG = `${CHINESE_WORD_REG}[^{\`\'\"]*(${CHINESE_WORD_REG})`;

const DOUBLE_SLASH_ANNOTATION_REG = /\/\/.*/gm;

const MULTI_LINE_ANNOTATION_REG = /\/\*[^\/]*\*\//gm;

module.exports = {
    CHINESE_REG,
    DOUBLE_SLASH_ANNOTATION_REG,
    MULTI_LINE_ANNOTATION_REG,
};