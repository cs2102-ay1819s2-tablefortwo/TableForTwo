'use strict';

// Development env or local env
const env = 'local';
const envConfig = require('./' + env);

let defaultConfig = {
    env: env
};

module.exports = require('lodash').merge(defaultConfig, envConfig);