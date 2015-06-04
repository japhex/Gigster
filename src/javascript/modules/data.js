'use strict';
var instance = false;
var ui = require('./../modules/ui');


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
		var $trigger = $('.venue-check');

		$trigger.on('click', $('div'), function(){
			ui.addLoader($trigger.parents('.popup'));
			$.post(apiUrl('venue',$('[name="venue"]').val()), function(data) {
				if (data.error){
					console.log(data.message);
				} else {
					// Check data structure and do 2 different things
					var venue = data.results.venuematches.venue[0];
					$('[name="venueLat"]').val(venue.location["geo:point"]["geo:lat"]);
					$('[name="venueLong"]').val(venue.location["geo:point"]["geo:long"]);
					$trigger.parents('form').find('button').removeAttr('disabled');
				}
				ui.removeLoader();
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