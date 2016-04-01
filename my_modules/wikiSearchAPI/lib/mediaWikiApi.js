/**
* Defines MediaWiki Search Only API
*/
'use strict';

var request = require('request');

// MediaWiki constructor
var mwApi = {
    wikiBaseUrl: 'http://fr.wikipedia.org',
    entryPoint: '/w'
};

function formatSpecialChar(str) {
    return str.replace('é', 'e').replace('î', 'i');
}

function formatWikiChar(str, chars) {
    for (var i = 0; i < chars.length; i++) {
        while (str.indexOf(chars[i]) !== -1)
            str = str.replace(chars[i], '');
    }
    return str;
}

function wikiInfoboxToObj(infobox) {
    var test = infobox.split('\n');
    var obj = {};
    test.forEach(function (current) {
        if (current.indexOf('| ') === 0 || current.indexOf(' | ') === 0) {
            obj[formatSpecialChar(current.split('=')[0].trim().split(' ')[1])] = formatWikiChar(current.split('=')[1].trim(), '[]{}');
        }
    });
    return obj;
}

function getTitle(obj) {
    var originalTitle = obj.titre ? obj.titre.split('|') : [''];
    var tab = [];
    if (originalTitle[originalTitle.length - 1] !== '')
        tab.push(originalTitle[originalTitle.length - 1]);
    if (obj.legende && obj.legende !== '')
        tab.push(obj.legende);
    if (obj.titre_orig && obj.titre_orig !== '')
        tab.push(obj.titre_orig);
    return tab.length > 0 ? tab : undefined;
}

function getRoles(obj, role) {
    return obj[role] ? obj[role].split('<br />') : undefined;
}

function getActors(obj) {
    var tab = obj.acteur ? obj.acteur.split('<br />') : undefined;
    if (tab.length > 0) {
        var idxs = [];
        tab.forEach(function (current, index) {
            if (current.indexOf('|') !== -1) {
                idxs.push(index);
            }
        });
        console.log(tab);
        idxs.forEach(function (current) {
            tab.splice(current, 1);
        })
    }
    return tab.length > 0 ? tab : undefined;
}

function getChannel(obj) {
    return obj.chaine ? obj.chaine.split('|') : undefined;
}

function getDate(obj) {
    var res = [];
    var date = obj.debut || obj.dateparution || '';
    date.split('|').forEach(function (current) {
        if (Number(current) > 1000 && Number(current) < 3000)
            res.push(current);
    });
    return res.length > 0 ? res : undefined;
}

function getIsbn(obj) {
    while (obj.isbn && obj.isbn.indexOf('-') !== -1) {
        obj.isbn = obj.isbn.replace('-', '');
    }
    return obj.isbn ? obj.isbn : undefined;
}

function parseBookData(parsed) {
    return {
        title: getTitle(parsed),
        authorsList: getRoles(parsed, 'auteur'),
        publisher: getRoles(parsed, 'editeur'),
        collectionName: getRoles(parsed, 'serie'),
        pageCount: getRoles(parsed, 'pages'),
        isbn: getIsbn(parsed)
    };
}

function parseSerieData(parsed) {
    return {
        title: getTitle(parsed),
        creatorsList: getRoles(parsed, 'createur'),
        producersList: getRoles(parsed, 'producteur'),
        actorsList: getActors(parsed),
        channel: getChannel(parsed),
        date: getDate(parsed)
    };
}

function cleanedGeneriqRes(bodyRes) {
    if (!bodyRes.query || !bodyRes.query.pages) {
        return [{ 'error': 'No result found' }];
    }

    var pageIdTab = Object.keys(bodyRes.query.pages);
    var homonymieTab = [];

    pageIdTab.forEach(function (elem, index) {
        var matchObj = {
            'pageId': elem,
            'pageTitle': bodyRes.query.pages[elem].title
        };

        homonymieTab.push(matchObj);
    });

    return homonymieTab;
}

// MediaWiki defines prototype methods
exports.searchByTitle = function(toSearch, callback) {
    request(mwApi.wikiBaseUrl + mwApi.entryPoint + '/api.php?action=query&generator=search&gsrsearch=' + toSearch + '&prop=info&inprop=url&format=json', function (error, response, body) {
        if (error && response.statusCode != 200) {
            console.log('Error while requesting the wikimedia api');
            return;
        }

        return callback(cleanedGeneriqRes(JSON.parse(body)));
    })
};

exports.searchInfoById = function(id, dataType, callback) {
    request(mwApi.wikiBaseUrl + mwApi.entryPoint + '/api.php?action=query&prop=revisions&rvprop=content&pageids=' + id + '&rvsection=0&format=json', function (error, response, body) {
        var obj = '*';
        var parsed = wikiInfoboxToObj(JSON.parse(body).query.pages[id].revisions[0][obj]);
        var apiResponse = {};
        if (dataType === 'book')
            apiResponse = parseBookData(parsed);
        else if (dataType === 'serie')
            apiResponse = parseSerieData(parsed);
        return callback(apiResponse);
    })
};
