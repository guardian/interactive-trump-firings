var pageUrl = window.location.href.split('#')[0],
    title = 'The firings and the fury: a list of Trump\'s biggest resignations and firings so far';

module.exports =  {
    init: function() {
        this.setLinks('.fire-intro__share');
    },

    setLinks: function(parent) {
        $(parent + ' .fire-intro__share__button--twitter a').attr('href', this.getTwitterLink());
        $(parent + ' .fire-intro__share__button--facebook a').attr('href', this.getFacebookLink());
        $(parent + ' .fire-intro__share__button--email a').attr('href', this.getEmailLink());
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