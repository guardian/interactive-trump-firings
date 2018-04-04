var $ = require('../vendor/jquery.js');
window.handlebars = require('handlebars');

var positions = [{
    position: 'The President',
    count: 1
}];

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
                person.gridLink = this.convertGridToUrl(person.gridLink);
            }
        }

        // remove all deleted entries
        data = data.filter(function(n){ return n != undefined }); 

        // sort by date left
        data.sort(function(a,b) {
            return a.left - b.left;
        });

        // calculate positions
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

        // sort in reverse order
        data.sort(function(a, b) {
            return b.left - a.left;
        });

        this.calculateStats();

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

    calculateStats: function() {
        window.stats = [];

        window.stats.push(this.getWorstPosition());
        window.stats.push(this.getFiredViaTweet());
        window.stats.push(this.getShortestStint());
        window.stats.push(this.getProflicDay());
        console.log(stats);
    },

    convertGridToUrl: function(gridUrl) {
        // https://media.gutools.co.uk/images/e6519c921186c8511a688036b061bd749090d740?crop=1192_0_1355_1355
        // https://media.guim.co.uk/e6519c921186c8511a688036b061bd749090d740/1192_0_1355_1355/140.jpg

        return gridUrl.replace('gutools.co.uk', 'guim.co.uk').replace('images/', '').replace('?crop=', '/') + '/140.jpg';
    },

    getWorstPosition: function() {
        var position;
        var highestCount = 0;

        for (var i in positions) {
            if (positions[i].count > highestCount) {
                position = positions[i];
                highestCount = positions[i].count;
            }
        }

        return {
            number: highestCount,
            fact: 'former ' + position.position + 's',
            detail: 'Making it the most tenuous job under Trump'
        }
    },

    getFiredViaTweet: function() {
        var count = 0;

        for (var i in data) {
            if (data[i].viaTweet == 'TRUE') {
                count++;
            }
        }

        return {
            number: count,
            fact: 'Learnt of their fate via Twitter',
            detail: 'That\'s ' + count + ' more than any other president'
        }
    },

    getShortestStint: function() {
        var person;
        var shortestActive = 500;

        for (var i in data) {
            if (shortestActive > data[i].daysActive) {
                person = data[i];
                shortestActive = data[i].daysActive;
            }
        }

        return {
            number: shortestActive,
            fact: 'days as the ' + person.position,
            detail: person.name + ' has served the shortest stint under Trump\'s tenure'
        }
    },

    getProflicDay: function() {
        var days = [];

        for (var i in data) {
            days.push(data[i].left);
        }

        var counts = {};
        var highestCount = 0;
        var proflicDay;

        for (var i in days) {
            var day = days[i];

            if (counts[day] === undefined) {
                counts[day] = 1;
            } else {
                counts[day] = counts[day] + 1;
            }

            if (counts[day] > highestCount) {
                highestCount = counts[day];
                proflicDay = days[i];
            }
        }

        var months = ['January', 'February', 'March' , 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        return {
            number: highestCount,
            fact: 'departures on ' + proflicDay.getDate() + ' ' + months[proflicDay.getMonth()],
            detail: 'Making that day Trump\'s most proflic yet'
        }
    },

    injectHTML: function() {
        this.addCards();
        this.addStats();
        this.showContent();
    },

    addCards: function() {
        var personHtml = require('../templates/person.html');
        var personTemplate = handlebars.compile(personHtml);

        for (var i in data) {
            if (i == 0) {
                $('.js-latest').append(personTemplate(data[i]));
            } else {
                $('.js-all').append(personTemplate(data[i]));
            }
        }
    },

    addStats: function() {
        var statHtml = require('../templates/stat.html');
        var statTemplate = handlebars.compile(statHtml);

        for (var i in stats) {
            $('.js-numbers').append(statTemplate(stats[i]));
        }
    },

    showContent: function() {
        $('.js-fire').addClass('is-visible');
    }
};
