'use strict';

const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');

const responseHelper = require('../../utils/response-helper');

const scrapping = ($, result) => {
    $('#s-results-list-atf').find('li').each(function () {
        const scrappedData = {
            cover: $(this).find('.a-col-left a img').attr('src'),
            title: $(this).find('.a-col-right a h2').text().split(/\(|\)|:|,|\s\-\s/),
            author: $(this).find('.a-col-right div.a-spacing-none span a').text(),
            volume: $(this).find('.a-col-right a h2').text().match(/[0-9]+/),
            link: $(this).find('.a-col-left a').attr('href')
        };

        for (let i = 0; i < scrappedData.title.length; i++) {
            scrappedData.title[i] = scrappedData.title[i].trim();
        }

        _.pull(scrappedData.title, '');

        result.data.push(scrappedData);
    });

    return result;
};

exports.searchByIsbn = (params, callback) => {
    const options = {
        url: 'https://www.amazon.fr/s/ref=sr_nr_i_0?fst=as%3Aoff&rh=k%3A9782352941910%2Ci%3Astripbooks&keywords=' + params.isbn,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.3'
        }
    };
    request(options, (err, response, payload) => {
        let $ = cheerio.load(payload);
        let result = {
            data: []
        };

        result = scrapping($, result);

        if (!result.data[0]) {
            return alternativeSearchByIsbn(params, callback);
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
        const prices = [];
        const details = [];

        $('#buybox span.offer-price').each(function () {
            let price = parseFloat($(this).text().match(/[0-9]+[,|\.][0-9]*/)[0].replace(',', '.'));

            if (!isNaN(price)) {
                prices.push(price);
            }
        });

        $('#formats').find('li').each(function () {
            let extractedPrice = $(this).find('span span span a span span').text().trim();
            if (extractedPrice) {
                let price = parseFloat(extractedPrice.match(/[0-9]+[,|\.][0-9]*/)[0].replace(',', '.'));

                if (!isNaN(price)) {
                    prices.push(price);
                }
            }
        });

        $('#detail_bullets_id').find('li').each(function () {
            let extractedDetail = $(this).text().trim();

            if (extractedDetail) {
                if (extractedDetail.indexOf('pages') > 0) {
                    let pages = parseInt(extractedDetail.match(/[0-9]+/)[0]);

                    if (!isNaN(pages)) {
                        params.pages = pages;
                    }
                } else if (/(editeur|edition)/i.test(extractedDetail)) {
                    params.publisher = extractedDetail.split(/[:|;]/)[1].replace(/\(.*\)/, '').trim();
                }
            }
        });

        if (cover) {
            params.cover = cover;
        }

        if (!params.author) {
            params.author = $('#byline span.author a.contributorNameID').first().text() || $('#byline span.author a').first().text();
        }

        if (prices.length > 0) {
            params.price = prices;
        }

        return callback(err, params);
    })
};

const alternativeSearchByIsbn = (params, callback) => {
    request('http://recherche.fnac.com/SearchResult/ResultList.aspx?SCat=0%211&Search=' + params.isbn + '&sft=1&sa=0', (err, response, payload) => {
        let $ = cheerio.load(payload);
        let result = {
            data: []
        };

        result = alternativeScrapping($, result);

        if (!result.data[0]) {
            err = { message: 'An error occurred with Amazon search result. Please try again' };
            return responseHelper.serviceCallback(err, result, 200, callback);
        } else {
            alternativeSearchDataFromLink(result.data[0], (err, response) => {
                delete response.link;
                return responseHelper.serviceCallback(err, response, 200, callback);
            })
        }
    });
};

const alternativeScrapping = ($, result) => {
    const scrappedData = {
        link: $('#dontTouchThisDiv div.Article-itemInfo p.Article-desc > a:first-child').attr('href'),
        title: $('#dontTouchThisDiv div.Article-itemInfo p.Article-desc > a:first-child').text().split(/\(|\)|:|,|\s\-\s/),
        volume: $('#dontTouchThisDiv div.Article-itemInfo p.Article-desc > a:first-child').text().match(/[0-9]+/),
        author: $('#dontTouchThisDiv div.Article-itemInfo p.Article-descSub > a:first-child').text()
    };

    result.data.push(scrappedData);

    return result;
};

const alternativeSearchDataFromLink = (params, callback) => {
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

        if (prices.length > 0) {
            params.price = prices;
        }

        return callback(err, params);
    })
};