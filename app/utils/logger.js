'use strict';

const Chalk = require('chalk');

const error = (text) => {
    return Chalk.styles.red.open + text + Chalk.styles.red.close;
};
const success = (text) => {
    return Chalk.styles.green.open + text + Chalk.styles.green.close;
};


exports.logRoute = (code, method, route) => {
    let log;
    switch (true) {
        case (code >= 100 && code < 200):
            log = Chalk.grey(Chalk.bold(code)) + ' ';
            break;
        case (code >= 200 && code < 300):
            log = Chalk.green(Chalk.bold(code)) + ' ';
            break;
        case (code >= 300 && code < 400):
            log = Chalk.blue(Chalk.bold(code)) + ' ';
            break;
        case (code >= 400 && code < 600):
            log = Chalk.red(Chalk.bold(code)) + ' ';
            break;
    }
    console.log(log + ' ' + Chalk.bold(method) + '\t' + route);
};

exports.logLoading = (plugin, err) => {
    let log = plugin.toUpperCase();

    for (let i = log.length; i <= 30; i++) {
        log += '.';
    }

    if (err) {
        console.error(log + error('ERROR'));
    } else {
        console.log(log + success('OK'));
    }
};
