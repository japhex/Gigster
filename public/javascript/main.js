var gigster = {} || gigster;

gigster.dataCalls = {
	artistLookup: function(){
		// Call to Last.fm for autocomplete of bands and venues.
		$('.lookup').on('click', $('div'), function(){
			$.post(gigster.dataCalls.apiUrl('artist',$(this).prev().val()), function(data) {
				$('[name="artist"]').val(data.results.artistmatches.artist[0].name);
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
			var container = $(this).parents('li');
			container.find('.hidden-update').show();
			container.find('.gig-date').show();
			container.find('.static-value').hide();
			container.find('label').show();
			return false;
		});
	},
	loadBands: function(){
		var collection = $('.ticket-artist span');

		for (var i=0;i<collection.length;i++){
			var band = $(collection[i]);

			// Closure, bitch!
			(function(band){
				$.ajax({
					url: 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + band.text() + ' logo',
					dataType:'jsonp',
				}).done(function(data) {
					$('<img src=' + data.responseData.results[0].unescapedUrl + ' class="band-logo" />').insertAfter(band);
					band.hide();
				});
			})(band);
		}
	}
};

gigster.internalApiCalls = {
	gigSubmit: function(){
		$('[action="/create"]').submit(function(){
			var currentDate = new Date(),
				gigDate = $('[name="gigDate"]').datepicker('getDate');

				// Compare dates to see if the show is in the past
				if (currentDate - gigDate > 0){
					$('[name="future"]').val('false');
				} else {
					$('[name="future"]').val('true');
					alert('This gig date is in the future, so, you\'re planning on attending it and not letting anyone down, right?');
				}
		});
	}
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
				dateString = "<span class='weekday'>" + $(dates[i]).text().substring(0,3) + "</span>";
				dateString += "<span class='day'> " + $(dates[i]).text().substring(8,11) + "</span>";
				dateString += "<span class='month'>" + $(dates[i]).text().substring(4,7) + "</span>";
				dateString += "<span class='year'> " + $(dates[i]).text().substring(13,15) + "</span>";
			} else {
				dateString = "<div class='date-sticker'>";
				dateString += "<span class='weekday'>" + $(dates[i]).text().substring(0,3) + "</span>";
				dateString += "<span class='day'>" + $(dates[i]).text().substring(8,11) + "</span>";
				dateString += "<span class='month'>" + this.convertMonth($(dates[i]).text().substring(4,7)) + "</span>";
				dateString += "</div>";
			}
			$(dates[i]).html(dateString);
		}
	},
	convertMonth: function(month){
		var monthMatch = {'Jan':'January','Feb':'February','Mar':'March','Apr':'April','May':'May','Jun':'June','Jul':'July','Aug':'August','Sep':'September','Oct':'October','Nov':'November','Dec':'December'};
		
		return monthMatch[month];
	}
};

$(function (){
	gigster.utilities.formatDate();
	gigster.dataCalls.artistLookup();
	gigster.internalApiCalls.gigSubmit();
	gigster.dataCalls.update();
	gigster.dataCalls.loadBands();
	gigster.utilities.actionForm();
    $('.datepicker').datepicker();
    $('[name="gig_date"]').datepicker();
}());

// var snipit = {} || snipit;

// snipit.data = {
// 	retrieveSnip: function(){
// 		$('.snip').on('click', $('#snippets'), function(){
// 			$.get($(this).data('id'), function(data){
// 				snipit.widgets.popup(data);
// 			});
// 		});
// 	}
// };

// snipit.widgets = {
// 	popup: function(data){
// 		// Put in hogan templating to handle these!
// 		$('body').append('<div class="popup">' + data.name + '</div>');
// 	}
// };

// (function () {
// 	snipit.utilities.toggle();
// 	snipit.data.retrieveSnip();
// }());