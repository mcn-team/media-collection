var wikiApi = require('./lib/mediaWikiApi.js');

var mw = new wikiApi();

mw.searchByTitle('Dark angel');
mw.searchInfoById('214904');
