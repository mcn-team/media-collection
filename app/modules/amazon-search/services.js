'use strict';

const request = require('request');
const cheerio = require('cheerio');
const jsdom = require('jsdom');

const responseHelper = require('../../utils/response-helper');

const scrapping = ($, result) => {
    $('#s-results-list-atf').find('li').each(function () {
        const content = $(this).find('.a-col-right').html();
        if (content.indexOf('Kindle') !== -1) {
            return;
        }
        result.data.push({
            link: $(this).find('.a-col-left a').attr('href'),
            title: $(this).find('.a-col-right a h2').text(),
            author: $(this).find('.a-col-right div.a-spacing-none span a').text()
        });
    });

    return result;
};

exports.searchByIsbn = (params, callback) => {
    request('https://www.amazon.fr/s/ref=nb_sb_noss?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&url=search-alias%3Daps&field-keywords=' + params.isbn, (err, response, payload) => {
        let $ = cheerio.load(payload);
        let result = {
            data: []
        };

        result = scrapping($, result);
        if (!result.data[0].title && !result.data[0].link && !result.data[0].author) {
            result = scrapping($, result);
        }

        if (err) {
            return responseHelper.serviceCallback(err, null, 500, callback);
        } else {
            searchDataFromLink({ link: result.data[0].link }, (error, res) => {
                if (error) {
                    err = error;
                }

                return responseHelper.serviceCallback(err, res, 200, callback);
            });
        }
    });
};

const searchDataFromLink = (params, callback) => {
    request(params.link, (err, response, payload) => {
        let $ = cheerio.load(payload);
        console.log($('#productTitle').text().split(/:|,/));
        const result = {
            cover: $('#imgBlkFront').attr('src'),
            title: $('#productTitle').text().split(/:|,/)
        };

        return callback(err, result);
    })
};
