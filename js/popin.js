/*global chrome:True*/
'use strict';

var $ = require('jquery');

var Analytics = require('./analytics');
var Credentials = require('./credentials');

var Popin = function() {
    var only_match = 'only-match';
    var multiple_match = 'multiple-match';

    function optionLink() {
        Analytics.event('Popin', 'option link');
        chrome.runtime.openOptionsPage();
    }

    function highlightUrlForTab(tab) {
        var container = $('.credentials');
        container.find('tr').removeClass(only_match + ' ' + multiple_match);

        var matches = [];
        container.find('.url').each(function() {
            var re = new RegExp($(this).text());
            if (re.test(tab.url)) {
                matches.push($(this).parent());
            }
        });

        var clazz = matches.length > 1 ? multiple_match : only_match;
        matches.map(function(a) { a.addClass(clazz); });
    }

    function highlightUrlForTabId(tab_id) {
        chrome.tabs.get(tab_id, highlightUrlForTab);
    }

    function highlightUrlForStatus(status) {
        highlightUrlForTabId(status.tabId);
    }

    function init() {
        $('.option-link').on('click', optionLink);

        chrome.tabs.getSelected(null, highlightUrlForTab);
        chrome.tabs.onUpdated.addListener(highlightUrlForTabId);
        chrome.tabs.onActivated.addListener(highlightUrlForStatus);
    }

    return {
        'init': init
    };
}();

$(function () {
    Analytics.view('/popin.html');
    Analytics.event('Popin', 'opened');
    Popin.init();
    Credentials.init();
});
