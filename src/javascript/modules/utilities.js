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
				dateString = "<time datetime='2014-09-20' class='icon-calendar'>";
				dateString += "<em>" + $($dates[i]).text().substring(0,3) + " </em>";
				dateString += "<strong>" + $($dates[i]).text().substring(4,7) + "</strong>";
				dateString += "<span>" + $($dates[i]).text().substring(8,11) + "</span>";
				dateString += "</time>";
			}
			$($dates[i]).html(dateString);
		}
	};

	return {
		init: init
	};
}


module.exports = (instance ? instance : instance = APICalls());