'use strict';

angular.module('light-rss-feed')
    .factory('FeedLoader', ['$resource',
    function($resource) {
        return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
            fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
        });
    }
    ])
    .service('FeedList', ['$rootScope', 'FeedLoader',
        function($rootScope, FeedLoader) {
            var FeedListService = {
                feeds: []
            };

            function pushFeedData(data) {
                var feed = data.responseData.feed;
                FeedListService.feeds.push(feed);
            }

            FeedListService.get = function() {
                FeedListService.feeds = [];

                var feedSources = [
                    { title: 'sortie_bd', url: 'http://feeds.feedburner.com/PlaneteBdLight-ChroniquesFranco-belges' },
                    { title: 'sortie_manga', url: 'http://feeds.feedburner.com/PlaneteBdLight-ChroniquesMangas' },
                    { title: 'sortie_film', url: 'http://www4.fnac.com/Rss/Rss.aspx?NID=2074821'},
                    { title: 'sortie_series', url: 'http://www4.fnac.com/Rss/Rss.aspx?NID=1476377'}
                ];

                if (FeedListService.feeds.length === 0) {
                    var allFeeds = [];

                    for (var i = 0; i < feedSources.length; i++) {
                        allFeeds.push( {
                            title: feedSources[i].title,
                            feed: FeedLoader.fetch( { q: feedSources[i].url, num: 10 }, {}, pushFeedData)
                        } );
                    }

                    return allFeeds;
                }
            };

            return FeedListService;
        }

    ]);

