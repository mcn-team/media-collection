'use strict';

angular.module('mediacollection').constant('English', {
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
    'WIKIPEDIA': 'Wikipedia',
    'AMAZON': 'Amazon Book',
    'AMAZON_HEADER': 'Search by ISBN with Amazon Book',
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
    'VALUE': 'Value',
    'EDIT_USER': 'Edit user',
    'DELETE_MESSAGE': 'Are you sure you want to delete this ?',
    'DELETE': 'Delete',
    'ADMIN_KEY': 'Admin user are highlighted in blue.',
    'USERS_TAB': 'Users',
    'SELECT_LANG': 'Select language',
    'MY_BOOKS': 'My Books',
    'STATS': 'Statistics',
    'MULTI_SEARCH': 'Multi criteria search',
    'QUICK_SEARCH': 'Quick search',
    'THE': 'The',
    'SINCE': 'Since',
    'BETWEEN': 'Between',
    'BEFORE': 'Before',
    'AND_T': 'and the...',
    'FIELD': 'Field',
    'CLEAR':'Reset',
    'SEARCH': 'Search...',
    'BETWEEN_T': 'Between the...',
    'AND': 'and',
    'GLOBAL_STATS': 'Global statistics',
    'COLLECTION_NUMBER': 'Collection count',
    'TOTAL_VALUE': 'Total price',
    'BOOKS_NUMBER': 'Book count',
    'MISSING_VALUE': 'Missing prices',
    'READING_STATS': 'Readings stats',
    'ENDED_BOOKS': 'Ended books',
    'READ_BOOKS_COUNT': 'Read books count',
    'ONGOING_READING': 'Ongoing readings',
    'ONGOING_BOOKS': 'Ongoing books',
    'UNREAD_BOOKS': 'Unread books',
    'UNREAD_BOOKS_NUM': 'Unread books count',
    'BOUGHT_BOOKS': 'Bought books',
    'BOUGHT_BOOKS_NUM': 'Bought books count',
    'BOOKS_TO_BUY': 'Books to buy',
    'BOOKS_TO_BUY_NUM': 'Number of books to buy',
    'MISSING_BOOKS': 'Missing books',
    'MISSING_BOOKS_NUM': 'Missing books count',
    'BUY_STATS': 'Buying statistics',
    'TIME_STATS': 'Time statistics',
    'LINK': 'Link',
    'FILE': 'File',
    'SEARCH_RESULTS': 'Search results',
    'NO_MISSING_MSG': 'There is no missing book before this one.',
    'SAVE_PROFILE': 'Save profile',
    'PROFILE_SAVE_SUCCESS': 'Profile Saved Successfully',
    'NEW_MOVIE': 'New movie',
    'SEARCH_MOVIE': 'Search movie:',
    'ENTER_TITLE': 'Enter a title',
    'EPISODE': 'Episode',
    'ACTORS': 'Actors',
    'ACTOR': 'Actor',
    'PRODUCERS': 'Producers',
    'PRODUCER': 'Producer',
    'DIRECTORS': 'Directors',
    'DIRECTOR': 'Director',
    'SCENARISTS': 'Scenarists',
    'SCENARIST': 'Scenarist',
    'DURATION': 'Duration',
    'MINUTES_SHORT': 'Min',
    'RELEASE_DATE': 'Release date',
    'DATE_PLACEHOLDER': 'mm/dd/yyyy',
    'SEEN': 'Seen',
    'COLLECTION_BOUGHT': 'bought',
    'COLLECTION_MISSING': 'missing',
    'EDIT_MOVIE': 'Edit movie',
    'DUPLICATE_THIS_MOVIE': 'Duplicate this movie',
    'EDIT_THIS_MOVIE': 'Edit this movie',
    'DELETE_THIS_MOVIE': 'Delete this movie',
    'EPISODE_SHORT': 'ep.',
    'DUPLICATE_THIS_BOOK': 'Duplicate this book',
    'EDIT_THIS_BOOK': 'Edit this book',
    'DELETE_THIS_BOOK': 'Delete this book',
    'AUTHORS': 'Authors',
    'PUBLICATION_DATE': 'Publication date',
    'ADD_MISSING_BOOKS': 'Add missing books',
    'MATCH': 'match',
    'MATCHES': 'matches',
    'MY_BOOKS_COLLECTIONS': 'My books collections',
    'OUTPUT': 'Output',
    'MY_MOVIES_COLLECTIONS': 'My movies collections',
    'NO_MATCHING_FOR': 'No matching for',
    'MORE': 'More',
    'LESS': 'Less',
    'BETWEEN...': 'Between...',
    'AND...': 'and...',
    'DATE': 'Date',
    'MOVIE_NUMBER': 'Movie count',
    'VIEWING_STATISTICS': 'Viewing statistics',
    'SEEN_MOVIES': 'Movies seen',
    'UNSEEN_MOVIE': 'Movie unseen',
    'MOVIES_BOUGHT': 'Movies bought',
    'MOVIES_TO_BUY': 'Movies to bought',
    'MISSING_MOVIES': 'Missing movies',
    'TOTAL_DURATION': 'Total duration',
    'TOTAL_SEEN_DURATION': 'Total seen duration',
    'LEFT_TO_SEE_DURATION': 'Left to see',
    'EDIT_PROFILE_TITLE': 'Edit your profile',
    'MOVIE_NO_RESULT': 'Sorry. Your search came back with no result.',
    'SECRET_QUESTION': 'Secret question',
    'SECRET_ANSWER': 'Secret answer',
    'ACCOUNT_SETTINGS': 'Account settings',
    'LANG_SETTINGS': 'Languages settings',
    'RECOVERY_SETTINGS': 'Password recovery',
    'MEDIAS': 'Medias',
    'RESET_PASSWORD': 'Reset password',
    'OF': 'of',
    'RECOVERY_HEADER': 'Reset the password',
    'NEW_PASSWORD': 'New password',
    'VOLUME_SHORT': 'Vol.',
    'GENERAL_OPTIONS': 'General options',
    'FEED_INTERVAL': 'RSS feed interval (seconds)',
    'SAVE': 'Save',
    'RESET': 'Reset',
    'FEED_INTERVAL_ERROR': 'Must be superior or equal to 10',
    'SUCCESSFUL_SAVE': 'Successfully saved',
    'LAST_VOLUME': 'Last volume',
    'LAST_VOLUME_ALERT': 'Check this if this volume is the last one of the collection and there will be no others. This field is used for identifying complete collection. You can edit a media to change it.',
    'SHOW_COMPLETED_COLLECTION': 'Display completed collections',
    'HIDE_COMPLETED_COLLECTION': 'Hide completed collections',
    'NEW_MEDIA': 'Add a new media',
    'EDIT_MEDIA': 'Edit a media',
    'DUPLICATE_MEDIA': 'Duplicate a media'
});
