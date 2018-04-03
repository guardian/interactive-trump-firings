var $ = require('../vendor/jquery.js');

var pageUrl = window.location.href.split('#')[0],
    title = '‘I don\'t have to peak to win’: The unstoppable Mikaela Shiffrin wants it all';

module.exports =  {
    init: function() {
        this.setLinks('.road-share');
    },

    setLinks: function(parent) {
        $(parent + ' .shif-share__button--twitter a').attr('href', this.getTwitterLink());
        $(parent + ' .shif-share__button--facebook a').attr('href', this.getFacebookLink());
        $(parent + ' .shif-share__button--email a').attr('href', this.getEmailLink());
    },

    getTwitterLink: function() {
        return 'https://twitter.com/intent/tweet?text=' + encodeURI(title) + 
                '&url=' + encodeURIComponent(pageUrl + '?CMP=share_btn_tw');
    },

    getFacebookLink: function(withId) {
        return 'https://www.facebook.com/dialog/share?app_id=180444840287&href=' + encodeURIComponent(pageUrl + '?CMP=share_btn_fb');
    },

    getEmailLink: function(withId) {
        return 'mailto:?subject=' + encodeURIComponent(title) +
                '&body=' + encodeURIComponent(pageUrl + '?CMP=share_btn_link');
    }
};