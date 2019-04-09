window.handlebars = require('handlebars');

var lastUpdated = require('../modules/lastUpdated.js');

var positions = [{
    position: 'The President',
    count: 1
}];

module.exports =  {
    init: function() {
        this.initHandlebars();
        this.getData();
    },

    bindings: function() {
        $('.fire-header__scroll').mouseover(function() {
            $('.fire-header__scroll').stop();
        });

        $('.fire-header__scroll').mouseleave(function() {
            this.animateHeader();
        }.bind(this));

        $(window).resize(function() {
            $('.fire-header__scroll').stop();
            this.animateHeader();
        }.bind(this));

        $('.fire-header__link').click(function(e) {
            e.preventDefault();
            this.scrollTo(e.currentTarget);
            console.log('hey');
        }.bind(this));
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
        });

        handlebars.registerHelper('guardianDate', function(date) {
            date = new Date(date);
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
        });
    },

    getData: function() {
        $.getJSON('https://interactive.guim.co.uk/docsdata/1Ywecbu_yhO0EQ2_BqU-V8HPH935eJb7H-_yfhsjy3DE.json', function(response) {
            window.data = response.sheets.people;
            this.populateLastUpdated(response.sheets.meta[0].lastUpdated);
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

        this.populateCount();

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
                var count = person.position === 'Homeland security secretary' ? 2 : 1;
                positions.push({
                    position: person.position,
                    count: count
                });
                person.positionCount = count;
            }
        }

        // sort in reverse order
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

    convertGridToUrl: function(gridUrl) {
        return gridUrl.replace('gutools.co.uk', 'guim.co.uk').replace('images/', '').replace('?crop=', '/') + '/140.jpg';
    },

    injectHTML: function() {
        this.addCards();
    },

    addCards: function() {
        var personHtml = require('../templates/person.html');
        var personTemplate = handlebars.compile(personHtml);

        var headerHtml = require('../templates/header.html');
        var headerTemplate = handlebars.compile(headerHtml);

        for (var i in data) {
            if (data[i].fact) {
                $('.js-header').append(headerTemplate(data[i]));
            }

            if (i == 0) {
                $('.js-latest').append(personTemplate(data[i]));
            } else {
                $('.js-all').append(personTemplate(data[i]));
            }
        }

        this.showContent();
        this.triggerHeader();
        this.bindings();
    },

    populateCount: function() {
        $('.js-count').text(data.length);
    },

    populateLastUpdated: function(date) {
        $('.js-last-updated').text(lastUpdated.convert(date));
    },

    showContent: function() {
        $('.js-fire').addClass('is-visible');
    },

    triggerHeader: function() {
        $('.fire-header__scroll').scrollLeft(30000);

        setTimeout(function() {
            this.animateHeader();
        }.bind(this), 500);
    },

    animateHeader: function() {
        var width = $(window).width();
        var speedModifer = width > 760 ? 7 : 10;
        var scrollSpeed = $('.fire-header__scroll').scrollLeft() * speedModifer;

        $('.fire-header__scroll').animate({scrollLeft: 0}, scrollSpeed, 'linear', function() {
            $('.fire-header__scroll').scrollLeft(30000);
            this.animateHeader();
        }.bind(this));
    },

    scrollTo: function(person) {
        var target = $(person).attr('href');

        $('html, body').animate({
            scrollTop: $(target).offset().top - 20
        }, 1000);

        $(target).addClass('is-active');

        setTimeout(function() {
            $('.is-active').removeClass('is-active');
        }, 1500)
    }
};
