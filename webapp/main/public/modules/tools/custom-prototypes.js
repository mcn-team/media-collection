/**
 * Created by Kaze on 12/02/2015.
 */

'use strict';

String.prototype.TruncIsh = String.prototype.TruncIsh || function (limit) {
    if (this.length < limit) {
        return this;
    }
    return this.substring(0, this.indexOf(' ', limit)) + '...';
};

String.prototype.TruncWord = String.prototype.TruncWord || function (limit) {
    if (this.split(' ').length < limit) {
        return this;
    }
    return this.substring(0, this.split(' ', limit).join(' ').length) + ' ...';
};

String.prototype.ContainsLower = String.prototype.ContainsLower || function (substr) {
    return angular.lowercase(this).indexOf(angular.lowercase(substr)) !== -1;
};

String.prototype.NumberFormat = String.prototype.NumberFormat || function (separator) {
    return this.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

Array.prototype.IsEmptyOrUndefined = Array.prototype.IsEmptyOrUndefined || function () {
    var isEmpty = true;
    angular.forEach(this, function (current) {
        if (current !== undefined && current !== null || current !== '') {
            isEmpty = false;
        }
    });
    return isEmpty;
};

Array.prototype.ContainsLower = Array.prototype.ContainsLower || function (str) {
    var found = false;
    angular.forEach(this, function (current) {
        if (angular.lowercase(current).ContainsLower(str)) {
            found = true;
        }
    });
    return found;
};

Array.prototype.PushUnique = Array.prototype.PushUnique || function (newItem) {
    var found = false;
    angular.forEach(this, function (current) {
        if (current === newItem) {
            found = true;
        }
    });
    if (!found) {
        this.push(newItem);
    }
};

Array.prototype.Contains = Array.prototype.Contains || function (str) {
    var found = false;
    angular.forEach(this, function (current) {
        if (current === str) {
            found = true;
        }
    });
    return found;
};

Array.prototype.FindAndCopyByProp = Array.prototype.FindAndCopyByProp || function (array, prop) {
    for (var i = 0; i < this.length; i++) {
        for (var j = 0; j < array.length; j++) {
            if (this[i][prop] === array[j][prop]) {
                this[i] = array[j];
            }
        }
    }
};
