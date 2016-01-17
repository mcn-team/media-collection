exports.isbnConvert = function (isbn) {
    var numValues = '0123456789X';
    var isbnTmp = '';
    var valueISBN10 = '';
    var valueISBN13 = '';
    var splittedIsbn = [];

    function throwError(msg) {
        throw new Error(msg);
    }

    function cleanIsbn(isbn) {
        var tmp = '';

        isbnTmp = isbn.toUpperCase().trim();
        // check if isbn only contains digits or a final X
    }

    if (isbn.length != 10 || isbn.length != 13) {
        throwError('ISBN has to be 10 or 13 digits!');
    }

    cleanIsbn(isbn);
};
