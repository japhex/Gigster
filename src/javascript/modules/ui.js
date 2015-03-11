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