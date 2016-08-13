'use strict';

const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');

const responseHelper = require('../../utils/response-helper');

const scrapping = ($, result) => {
    $('#s-results-list-atf').find('li').each(function () {
        result.data.push({
            cover: $(this).find('.a-col-left a img').attr('src'),
            title: $(this).find('.a-col-right a h2').text().split(/:|,|\s\-\s/),
            author: $(this).find('.a-col-right div.a-spacing-none span a').text(),
            volume: $(this).find('.a-col-right a h2').text().match(/[0-9]+/),
            link: $(this).find('.a-col-left a').attr('href')
        });
    });

    return result;
};

exports.searchByIsbn = (params, callback) => {
    request('https://www.amazon.fr/s/ref=sr_nr_i_0?fst=as%3Aoff&rh=k%3A9782352941910%2Ci%3Astripbooks&keywords=' + params.isbn, (err, response, payload) => {
        let $ = cheerio.load(payload);
        let result = {
            data: []
        };

        result = scrapping($, result);

        if (!result.data[0]) {
            err = { message: 'An error occurred with Amazon search result. Please try again' };
            return responseHelper.serviceCallback(err, result, 200, callback);
        } else {
            searchDataFromLink(result.data[0], (err, response) => {
                delete response.link;
                return responseHelper.serviceCallback(err, response, 200, callback);
            })
        }

    });
};

const searchDataFromLink = (params, callback) => {
    request(params.link, (err, response, payload) => {
        let $ = cheerio.load(payload);
        const cover = $('#imgBlkFront').attr('src');

        if (cover) {
            params.cover = cover;
        }

        if (!params.author) {
            params.author = $('#byline span.author a.contributorNameID').first().text() || $('#byline span.author a').first().text();
        }

        return callback(err, params);
    })
};
