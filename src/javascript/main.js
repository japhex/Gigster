'use strict';

var data = require('./modules/data');
var api = require('./modules/internalApiCalls');
var ui = require('./modules/ui');
var utils = require('./modules/utilities');
var jqueryUi = require('./utilities/jquery-ui');

var init = function() {
	if (!window.console) console = {log: function() {}};
	data.init();
	api.init();
	ui.init();
	utils.init();
};

$(document).ready(init);