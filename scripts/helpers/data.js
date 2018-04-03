var request = require('sync-request');
var fs = require('fs-extra');

var json;

function specialCharacters(string) {
    return string.replace(/â€˜/g, '&lsquo;').replace(/â€™/g, '&rsquo;').replace(/â€œ/g, '&ldquo;').replace(/â€/g, '&rdquo;');
}

module.exports = function getData() {
    json = require('../../scripts/local.json');
    json = {
        people: json.sheets.Sheet1
    }

    for (var i in json.people) {
        json.people[i].niceQuote = specialCharacters(json.people[i].niceQuote);
        json.people[i].badQuote = specialCharacters(json.people[i].badQuote);
        json.people[i].context = specialCharacters(json.people[i].context);
    }

    return json;
};