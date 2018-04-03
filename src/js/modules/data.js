var $ = require('../vendor/jquery.js');
window.handlebars = require('handlebars');

module.exports =  {
    init: function() {
        this.initHandlebars();
        this.getData();
    },

    initHandlebars: function() {
        handlebars.registerHelper('handlise', function(string) {
            return string.replace(/ /g, '-').replace('?', '').replace(/&/, 'and').replace(/'/g, '').replace(':', '').replace('/', '').toLowerCase();
        });

        handlebars.registerHelper('suffix', function(number) {
            if (number === 1) {
                return 'st'
            } else if (number === 2) {
                return 'nd'
            } else if (number === 3) {
                return 'rd'
            } else {
                return 'th'
            }
        })
    },

    getData: function() {
        $.getJSON('https://interactive.guim.co.uk/docsdata-test/1Ywecbu_yhO0EQ2_BqU-V8HPH935eJb7H-_yfhsjy3DE.json', function(response) {
            window.data = response.sheets.people;
            this.cleanData();
        }.bind(this));
    },

    cleanData: function() {
        // remove those in office and add data with the dates
        for (var i = 0; i < data.length; i++) {
            var person = data[i];
            if (person.status === 'In Office') {
                delete data[i];
            } else {
                person.started = this.calculateDate(person.started);
                person.left = this.calculateDate(person.left);
                person.daysActive = this.calculateDifference(person.started, person.left);
            }
        }

        // remove all deleted entries
        data = data.filter(function(n){ return n != undefined }); 

        // sort by date left
        data.sort(function(a,b) {
            return a.left - b.left;
        });

        var positions = [{
            position: 'The President',
            count: 1
        }];

        for (var i = 0; i < data.length; i++) {
            var person = data[i];

            var found = false;

            for (var p = 0; p < positions.length; p++) {
                if (positions[p].position === person.position) {
                    positions[p].count = positions[p].count + 1;
                    person.positionCount = positions[p].count;
                    found = true;
                }
            }

            if (!found) {
                positions.push({
                    position: person.position,
                    count: 1
                });
                person.positionCount = 1;
            }
        }

        data.sort(function(a, b) {
            return b.left - a.left;
        });

        this.injectHTML();
    },

    calculateDate: function(date) {
        date = date.split('/');
        return new Date(date[1] + '/' + date[0] + '/' + date[2]);
    },

    calculateDifference: function(start, end) {
        var diff = end - start;
        return Math.round(diff / 86400000);
    },

    injectHTML: function() {
        this.addAllCards();
    },

    addAllCards: function() {
        var personHtml = require('../templates/person.html');
        var personTemplate = handlebars.compile(personHtml);

        console.log(data);

        for (var i in data) {
            $('.js-fire').append(personTemplate(data[i]));
        }
    }
};
