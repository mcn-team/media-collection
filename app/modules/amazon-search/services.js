'use strict';

/**
 * Modules is now using Fnac web search instead of Amazon.
 */

const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');

const responseHelper = require('../../utils/response-helper');

const scrapping = ($, result) => {
    const scrappedData = {
        link: $('#dontTouchThisDiv div.Article-itemInfo p.Article-desc > a:first-child').attr('href'),
        title: $('#dontTouchThisDiv div.Article-itemInfo p.Article-desc > a:first-child').text().split(/\(|\)|:|,|\s\-\s/),
        volume: $('#dontTouchThisDiv div.Article-itemInfo p.Article-desc > a:first-child').text().match(/[0-9]+/),
        author: $('#dontTouchThisDiv div.Article-itemInfo p.Article-descSub > a:first-child').text()
    };

    result.data.push(scrappedData);

    return result;
};

exports.searchByIsbn = (params, callback) => {
    request('http://recherche.fnac.com/SearchResult/ResultList.aspx?SCat=0%211&Search=' + params.isbn + '&sft=1&sa=0', (err, response, payload) => {
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
        const cover = $('div.ProductSummary div.ProductSummary-preview div.ProductVisuals-preview img').attr('src');
        const prices = [];

        $('a.ProductSellers-tabControl span.ProductSellers-tabControlText').each(function () {
            let price = parseFloat($(this).find('span').text().replace('€', '.'));

            if (!isNaN(price)) {
                prices.push(price);
            }
        });

        $('div.ProductSummary-description ul.ProductSummary-descTech').find('li').each(function () {
            let extractedDetail = $(this).find('> span:first-child').text().trim();

            console.log(extractedDetail);
            if (extractedDetail) {
                if (/(editeur|edition)/i.test(extractedDetail)) {
                    params.publisher = $(this).find('strong > span > a').text().trim();
                } else if (/pages/i.test(extractedDetail)) {
                    let pages = parseInt($(this).find('strong > span').text().trim().match(/[0-9]+/)[0]);

                    if (!isNaN(pages)) {
                        params.pages = pages;
                    }
                }
            }
        });

        if (cover) {
            params.cover = cover;
        }

        // if (!params.author) {
        //     params.author = $('#byline span.author a.contributorNameID').first().text() || $('#byline span.author a').first().text();
        // }

        if (prices.length > 0) {
            params.price = prices;
        }

        return callback(err, params);
    })
};
