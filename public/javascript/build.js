(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var data = require('./modules/data');
var api = require('./modules/internalApiCalls');
var ui = require('./modules/ui');
var utils = require('./modules/utilities');

var init = function() {
	if (!window.console) console = {log: function() {}};
	data.init();
	api.init();
	ui.init();
	utils.init();
};

$(document).ready(init);
},{"./modules/data":2,"./modules/internalApiCalls":3,"./modules/ui":4,"./modules/utilities":5}],2:[function(require,module,exports){
'use strict';
var instance = false;


function Data() {

	function init() {
		artistLookup();
		update();
		loadBands();
		loadSetlist();
	}

	/** Artist/Venue lookup function, calls apiUrl
	* @returns Lat/Lng for venueLat/venueLong hidden fields to be posted
	*/
	var artistLookup = function(){
		$('.venue-check').on('click', $('div'), function(){
			$.post(gigster.dataCalls.apiUrl('venue',$(this).prev().val()), function(data) {
				var venue = data.results.venuematches.venue[0];
				$('[name="venueLat"]').val(venue.location["geo:point"]["geo:lat"]);
				$('[name="venueLong"]').val(venue.location["geo:point"]["geo:long"]);
			});
			return false;
		});
	};
	
	/**
	* Function to make API call to last.fm and return a JSON object
	* @param {string} callType the type of API call to make
	* @param {string} params the value that has been entered into the form
	* @returns {object}
	*/
	var apiUrl = function(callType,params){
		switch (callType){
			case 'artist':
				return 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + params + '&api_key=87a726f5832926366bd09f6a3935d792&format=json';
			case 'venue':
				return 'http://ws.audioscrobbler.com/2.0/?method=venue.search&api_key=6de16c25e43a12240c4547fae1b18b13&venue=' + params + '&format=json';
		}
	};

	/** Update gig function */
	var update = function(){
		$('.action-update').on('click',$('.ticket-container'), function(){
			var container = $(this).parents('li'),
				updateLink = $(this),
				updateForm = $('#update-gig').find('form'),
				artistName = container.find('.artist-name').text(),
				venue = container.find('.venue-name').text(),
				venueLat = container.data('lat'),
				venueLong = container.data('long');

			updateForm.attr('action',updateLink.attr('href'));
			updateForm.find('[name="artist"]').val(artistName);
			updateForm.find('[name="venue"]').val(venue);
			updateForm.find('[name="venueLat"]').val(venueLat);
			updateForm.find('[name="venueLong"]').val(venueLong);

			return false;
		});
		$('.ticket-artist').blur(function(){
			// Save updated record to DB.
		});
	};

	var loadBands = function(){
	var collection = $('.ticket-artist .artist-name');

		// for (var i=0;i<collection.length;i++){
		// 	var band = $(collection[i]);

		// 	// Closure, bitch!
		// 	(function(band){
		// 		$.ajax({
		// 			url: 'https://ajax.googleapis.com/ajax/services/search/images?imgsz=small&imgtype=photo&v=1.0&q=' + band.text() + ' band photo',
		// 			dataType:'jsonp',
		// 		}).done(function(data) {
		// 			$('<div class="img-crop"><img src=' + data.responseData.results[0].unescapedUrl + ' class="band-logo" alt="' + band.text() + '" title="' + band.text() + '" /></div>').insertBefore(band.parent());
		// 		});
		// 	})(band);
		// }
	};

	var loadSetlist = function(){
		// var collection = $('#past-gigs').find('.ticket-container'),
		// 	artistName = "",
		// 	date = "";

		// for (var i=0;i<collection.length;i++){
		// 	artistName = $(collection[i]).find('.artist-name').text();
		// 	date = $(collection[i]).parent().data('date');
		// 	reformatDate = new Date(date);
		// 	reformatDate = reformatDate.getDate() + '-' + ("0" + (reformatDate.getMonth() + 1)).slice(-2) + '-' + reformatDate.getFullYear();
		// 	gig = $(collection[i]);


		// 	(function(gig){
		// 		$.getJSON('http://api.setlist.fm/rest/0.1/search/setlists.json?artistName=' + artistName + '&date=' + reformatDate + '&callback=?gigster.dataCalls.printSetlist', {
		// 			dataType:'jsonp'
		// 		});
		// 	})(gig);
		//}
	};

	var printSetlist = function(data){
		console.log('test');
		//console.log(data);
	};

	return {
		init: init
	};
}


module.exports = (instance ? instance : instance = Data());
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
'use strict';
var instance = false;


function UI() {

	function init() {
		popup();
		maps();
		artistFiller();
		notificationCount();
	}

	var popup = function(){
		$('[data-trigger="popup"]').on('click', function(){
			var $popup = $('.popup'),
				$shadow = $('<div class="popup-shadow" style="height:' + $(document).height() + 'px;"></div>');

			$shadow.appendTo('body').fadeIn();

			// Clearing whenever we click anywhere on the body rather than delegating properly
			$shadow.on('click', function(){
				removePopup();
			});

			// Clearing on keyup of the escape key
			$(document).keyup(function(e) {
				if (e.keyCode == 27) { 
					removePopup();
				}
			});

			function removePopup() {
				$popup.fadeOut("fast");
				$shadow.fadeOut("fast", function(){
					$shadow.remove();
				});	
			}
		});
	};

	var maps = function(){
		var $mapContainer = $('.map-container');

		$mapContainer.click(function(){
			var $currentMap = $(this);

			if ($currentMap.hasClass('active')){
				$currentMap.removeClass('map-expanded');
				$currentMap.addClass('map-minified');
				$currentMap.data('toggle',true);
				$currentMap.removeClass('active');
			} else {
				$currentMap.removeClass('map-minified');
				$currentMap.addClass('map-expanded');
				$currentMap.data('toggle',false);
				$currentMap.addClass('active');
			}
		});		
	};

	var artistFiller = function(){
		var $fillAmount = $('[data-filler]');

		for (var i=0;i<$('[data-filler]').length;i++){
			var currentBar = $($fillAmount[i]),
				fillBarAmount = currentBar.data('filler');

			currentBar.animate({'width': fillBarAmount + '%'},1000);
		}
	};

	var notificationCount = function(){
		var $notification = $('.notification'),
			notificationCount = $notification.length,
			$notificationBadge = $('.notification-badge'),
			$notificationBubble = $('.notification-bubble span');

			console.log(notificationCount);

		if (notificationCount > 0){
			for (var i=0;i<notificationCount;i++){
				$notificationBadge.text(notificationCount);
				$notificationBubble.text(notificationCount);
			}
			$notificationBadge.removeClass('hide');
		}
		// Count all notifications on page and display a number next to the username.
		// If notifications exist on page, display banner at the top of the page alerting the user to this.
	};

	return {
		init: init
	};
}


module.exports = (instance ? instance : instance = UI());
},{}],5:[function(require,module,exports){
'use strict';
var instance = false;


function APICalls() {

	function init() {
		actionForm();
		formatDate();
	}

	/** Utility function for toggling elements. Automatically finds any associated
	* [data-action-form] attribute as an ID on the page and on click of the original
	* attribute, will display, then on second click hide.
	*/
	var actionForm = function(){
		$('[data-action-form]').click(function(){
			$('#' + $(this).data('action-form')).toggle();
		});
	};

	/** Utility function to format dates */
	var formatDate = function(){
		var $dates = $('.display-date').find('span'),
			dateString = "";

		for (var i=0;i<$dates.length;i++){
			if ($($dates[i]).hasClass('past-date')){
				dateString = "<span class='weekday'>" + $($dates[i]).text().substring(0,3) + " </span>";
				dateString += "<span class='day'> " + $($dates[i]).text().substring(8,11) + "</span>";
				dateString += "<span class='month'>" + $($dates[i]).text().substring(4,7) + "</span>";
				dateString += "<span class='year'> " + $($dates[i]).text().substring(13,15) + "</span>";
			} else {
				dateString = "<div class='date-sticker'>";
				dateString += "<span class='weekday'>" + $($dates[i]).text().substring(0,3) + " </span>";
				dateString += "<span class='day'>" + $($dates[i]).text().substring(8,11) + "</span>";
				dateString += "<span class='month'>" + $($dates[i]).text().substring(4,7) + "</span>";
				dateString += "</div>";
			}
			$($dates[i]).html(dateString);
		}
	};

	return {
		init: init
	};
}


module.exports = (instance ? instance : instance = APICalls());
},{}]},{},[1])