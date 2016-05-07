'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
    // Init module configuration options
    var applicationModuleName = 'mediacollection';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'ui.keypress',
        'ngLodash',
        'ngAnimate',
        'ngImgCrop',
        'ngSanitize',
        'pascalprecht.translate'
    ];

    // Custom angular modules
    applicationModuleVendorDependencies.push('upload');

    // Add a new vertical module
    var registerModule = function(moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();

// Angular custom modules declarations
angular.module('upload', []);

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
    '$locationProvider', '$httpProvider', '$translateProvider',
    'English', 'French',
    function($locationProvider, $httpProvider, $translateProvider, English, French) {
        $locationProvider.hashPrefix('!');
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('InterceptorsService');

        $translateProvider.useSanitizeValueStrategy(null);

        $translateProvider.translations('English_en', English);
        $translateProvider.translations('Francais_fr', French);
        var langs = [
            'English_en',
            'Francais_fr'
        ];
        $translateProvider.registerAvailableLanguageKeys(langs);

        $translateProvider.preferredLanguage('English_en');
    }
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
