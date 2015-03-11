'use strict';
var instance = false;


function APICalls() {

	function init() {
	}

	return {
		init: init
	};
}


module.exports = (instance ? instance : instance = APICalls());