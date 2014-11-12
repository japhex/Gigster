var gigster = {} || gigster;

gigster.dataCalls = {
	artistLookup: function(){
		$('.venue-check').on('click', $('div'), function(){
			$.post(gigster.dataCalls.apiUrl('venue',$(this).prev().val()), function(data) {
				var venue = data.results.venuematches.venue[0];
				$('[name="venueLat"]').val(venue.location["geo:point"]["geo:lat"]);
				$('[name="venueLong"]').val(venue.location["geo:point"]["geo:long"]);
			});
			return false;
		});
	},
	apiUrl: function(callType,params){
		switch (callType){
			case 'artist':
				return 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + params + '&api_key=87a726f5832926366bd09f6a3935d792&format=json';
			case 'venue':
				return 'http://ws.audioscrobbler.com/2.0/?method=venue.search&api_key=6de16c25e43a12240c4547fae1b18b13&venue=' + params + '&format=json';
		}
	},	
	update: function(){
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
	},
	loadBands: function(){
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
	}
};

gigster.internalApiCalls = {
};

gigster.utilities = {
	actionForm: function(){
		$('[data-action-form]').click(function(){
			$('#' + $(this).data('action-form')).toggle();
		});
	},
	formatDate: function(){
		var dates = $('.display-date').find('span'),
			dateString = "";

		for (var i=0;i<dates.length;i++){
			if ($(dates[i]).hasClass('past-date')){
				dateString = "<span class='weekday'>" + $(dates[i]).text().substring(0,3) + " </span>";
				dateString += "<span class='day'> " + $(dates[i]).text().substring(8,11) + "</span>";
				dateString += "<span class='month'>" + $(dates[i]).text().substring(4,7) + "</span>";
				dateString += "<span class='year'> " + $(dates[i]).text().substring(13,15) + "</span>";
			} else {
				dateString = "<div class='date-sticker'>";
				dateString += "<span class='weekday'>" + $(dates[i]).text().substring(0,3) + " </span>";
				dateString += "<span class='day'>" + $(dates[i]).text().substring(8,11) + "</span>";
				dateString += "<span class='month'>" + $(dates[i]).text().substring(4,7) + "</span>";
				dateString += "</div>";
			}
			$(dates[i]).html(dateString);
		}
	}
};

gigster.ui = {
	popup: function(){
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
	},
	maps: function(){
		var mapContainer = $('.map-container');

		mapContainer.click(function(){
			var currentMap = $(this);

			if (currentMap.hasClass('active')){
				currentMap.removeClass('map-expanded');
				currentMap.addClass('map-minified');
				currentMap.data('toggle',true);
				currentMap.removeClass('active');
			} else {
				currentMap.removeClass('map-minified');
				currentMap.addClass('map-expanded');
				currentMap.data('toggle',false);
				currentMap.addClass('active');
			}
		});		
	},
	artistFiller: function(){
		var fillAmount = $('[data-filler]');

		for (var i=0;i<$('[data-filler]').length;i++){
			var currentBar = $(fillAmount[i]),
				fillBarAmount = currentBar.data('filler');

			currentBar.animate({'width': fillBarAmount + '%'});
		}
	}
};

$(function (){

	// gigster utility functions
	gigster.utilities.formatDate();
	gigster.utilities.actionForm();

	// gigster data functions
	gigster.dataCalls.artistLookup();
	gigster.dataCalls.update();
	gigster.dataCalls.loadBands();

	// gigster ui functions
	gigster.ui.popup();
	gigster.ui.maps();
	gigster.ui.artistFiller();

	// gigster plugin calls
    $('.datepicker').datepicker();
    $('[name="gig_date"]').datepicker();
}());