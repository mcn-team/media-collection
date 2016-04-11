'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
    // Init module configuration options
    var applicationModuleName = 'mediacollection';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'ngLodash',
        'ngAnimate',
        'ngImgCrop',
        'ngSanitize',
        'pascalprecht.translate'
    ];

    // Custom angular modules
    applicationModuleVendorDependencies.push('upload');
    applicationModuleVendorDependencies.push('mc.language');

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
    function($locationProvider, $httpProvider, $translateProvider) {
        $locationProvider.hashPrefix('!');
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('InterceptorsService');

        $translateProvider.useSanitizeValueStrategy(null);

        $translateProvider.translations('en', {
            'LAST_ADDED_BOOK': 'Last added book',
            'LAST_ADDED_MOVIE': 'Last added movie',
            'BOOK_HEADER': 'Books',
            'ADD_BOOK': 'Add a new book',
            'BOOK_LIST': 'Books list',
            'BOOK_COLLECTION': 'Books collections',
            'MOVIE_HEADER': 'Movies',
            'ADD_MOVIE': 'Add a new movie',
            'MOVIE_LIST': 'Movies list',
            'MOVIE_COLLECTION': 'Movies collections',
            'NOT_LOGGED_MESSAGE': 'You are not logged in.\nPlease log in or create an account',
            'SETTINGS': 'Settings',
            'EDIT_PROFILE': 'Edit profile',
            'SIGNOUT': 'Signout',
            'SIGNUP': 'Sign up',
            'SIGNIN': 'Sign in',
            'MY_MOVIES': 'My Movies',
            'SIGNUP_HEADER': 'Create a new account',
            'SIGNIN_HEADER': 'Sign in with your account',
            'DISPLAY_NAME': 'Display Name',
            'EMAIL': 'Email',
            'USERNAME': 'Username',
            'PASSWORD': 'Password',
            'GOOGLE_BOOK': 'Google Book',
            'WIKIPEDIA': 'Wikipedia',
            'GOOGLE_HEADER': 'Search by ISBN with Google Book',
            'WIKI_HEADER': 'Search by title with Wikipedia',
            'ISBN_PLACEHOLDER': 'Enter an ISBN',
            'TITLE_PLACEHOLDER': 'Enter a title',
            'MISSING_HEADER': 'Add missing books',
            'ALL': 'All',
            'NONE': 'None',
            'REVERSE': 'Reverse',
            'READ': 'Read',
            'BOUGHT': 'Bought',
            'VALIDATE': 'Validate',
            'OK': 'Ok',
            'CANCEL': 'Cancel',
            'DUPLICATE': 'Duplicate a',
            'NEW': 'New',
            'BOOK': 'Book',
            'COMICS': 'Comics',
            'MANGA': 'Manga',
            'GENERAL_INFO': 'General info',
            'ADD_INFO': 'Additional info',
            'RATING': 'Rating',
            'TYPE': 'Type',
            'TITLE': 'Title',
            'COLLECTION': 'Collection',
            'VOLUME': 'Volume',
            'AUTHOR': 'Author',
            'PUBLISHER': 'Publisher',
            'COVER': 'Cover',
            'PUBLISHING_DATE': 'Publishing Date',
            'ISBN': 'ISBN',
            'PAGES': 'Pages',
            'PRICE': 'Price',
            'SUMMARY': 'Summary',
            'CUSTOM_FIELDS': 'Custom fields',
            'NEW_FIELD': 'New field',
            'NAME': 'Name',
            'VALUE': 'Value'
        });

        $translateProvider.translations('fr', {
            'LAST_ADDED_BOOK': 'Dernier livre ajouté',
            'LAST_ADDED_MOVIE': 'Dernier film ajouté',
            'BOOK_HEADER': 'Livres',
            'ADD_BOOK': 'Ajouter un livre',
            'BOOK_LIST': 'Liste des livres',
            'BOOK_COLLECTION': 'Collections de livres',
            'MOVIE_HEADER': 'Films',
            'ADD_MOVIE': 'Ajouter un film',
            'MOVIE_LIST': 'Liste des films',
            'MOVIE_COLLECTION': 'Collections de films',
            'NOT_LOGGED_MESSAGE': 'Vous n\'êtes pas identifié. Identifiez-vous ou enregistrez-vous si nous n\'avez pas encore créer votre compte',
            'SETTINGS': 'Paramètres',
            'EDIT_PROFILE': 'Modifier mon profil',
            'SIGNOUT': 'Déconnexion',
            'MY_MOVIES': 'Mes films',
            'SIGNUP_HEADER': 'Créer un nouveau compte',
            'SIGNIN_HEADER': 'Connectez-vous avec votre compte',
            'DISPLAY_NAME': 'Pseudo',
            'EMAIL': 'Email',
            'USERNAME': 'Nom d\'utilisateur',
            'PASSWORD': 'Mot de passe',
            'SIGNUP': 'S\'inscrire',
            'SIGNIN': 'Se connecter',
            'GOOGLE_BOOK': 'Google Livres',
            'WIKIPEDIA': 'Wikipédia',
            'GOOGLE_HEADER': 'Rechercher par ISBN sur Google Livres',
            'WIKI_HEADER': 'Rechercher par titre sur Wikipedia',
            'ISBN_PLACEHOLDER': 'Entrez un ISBN',
            'TITLE_PLACEHOLDER': 'Entrez un titre',
            'MISSING_HEADER': 'Ajouter des livres manquants',
            'ALL': 'Tous',
            'NONE': 'Aucun',
            'REVERSE': 'Inverser',
            'READ': 'Lu',
            'BOUGHT': 'Acheté',
            'VALIDATE': 'Valider',
            'OK': 'Ok',
            'CANCEL': 'Annuler',
            'DUPLICATE': 'Dupliquer un(e)',
            'NEW': 'Ajouter un',
            'BOOK': 'livre',
            'COMICS': 'BD',
            'MANGA': 'Manga',
            'GENERAL_INFO': 'Informations générales',
            'ADD_INFO': 'Informations supplémentaires',
            'RATING': 'Note',
            'TYPE': 'Type',
            'TITLE': 'Titre',
            'COLLECTION': 'Collection',
            'VOLUME': 'Tome',
            'AUTHOR': 'Auteur',
            'PUBLISHER': 'Éditeur',
            'COVER': 'Couverture',
            'PUBLISHING_DATE': 'Date de publication',
            'ISBN': 'ISBN',
            'PAGES': 'Pages',
            'PRICE': 'Prix',
            'SUMMARY': 'Résumé',
            'CUSTOM_FIELDS': 'Champs personnalisés',
            'NEW_FIELD': 'Nouveau champs',
            'NAME': 'Name',
            'VALUE': 'Value'
        });

        $translateProvider.preferredLanguage('fr');
    }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run([
    'LanguageServices',
    function (LanguageServices) {
        LanguageServices.fetchLanguages();
    }
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
