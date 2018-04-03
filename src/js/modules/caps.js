var $ = require('../vendor/jquery');

var scrollTop, height;

module.exports = {
    init: function() {
        $(document).ready(function() {
            this.enhanceCaps();
        }.bind(this));
    },

    enhanceCaps: function() {
        $('.content__main h2').next().each(function(index, element) {
            if ($(element).is('p')) {
                this.enhanceCap(element);
            }
        }.bind(this));

        this.enhanceCap($('.element-atom').next());
    },

    enhanceCap: function(paragraph) {
        var html = $(paragraph).html().trim();
        $(paragraph).html('<span class="road__drop-cap"><span class="road__drop-inner">' + html[0] + '</span></span>' + html.slice(1));
    }
}
