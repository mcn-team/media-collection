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

exports.logLoading = (plugin, err, cb) => {
    let log = plugin.toUpperCase();

    for (let i = log.length; i <= 30; i++) {
        log += '.';
    }

    if (err) {
        log += error('ERROR');
    } else {
        log += success('OK');
    }

    console.log(log);
    if (err) {
        cb();
    }
};
