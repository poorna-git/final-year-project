const { readFileSync, writeFileSync } = require('fs');
const logger = require('./logger');

const readFileHelper = (path) => {
    try {
        return JSON.parse(readFileSync(path, 'utf8'));
    } catch (error) {
        logger.error(`${err.status || 404} - ${"Error while reading the file!"} - ${err.message}`);
    }
}

const writeFileHelper = (path, content) => {
    try {
        writeFileSync(path, JSON.stringify(content));
        console.log("sdfaf");
        return true;
    } catch (error) {
        logger.error(`${err.status || 404} - ${"Error while writing the file!"} - ${err.message}`);
        console.log(error);
        return false;
    }
}

module.exports = {
    readFileHelper,
    writeFileHelper
}