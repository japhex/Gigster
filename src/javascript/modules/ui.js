'use strict';
var instance = false;


function UI() {

	function init() {
		popup();
		maps();
		artistFiller();
		notificationCount();
		festival();
		_findMe();

		$('.datepicker').datepicker();
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

			currentBar.animate({'width': (fillBarAmount > 2000 ? (fillBarAmount / 100) : (fillBarAmount / 10)) + '%'},1000);
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

	var festival = function() {
		$('[name="festival"]').click(function(){
			$('.toggle-festival').slideToggle();
			$('.single-gig').slideToggle();
		});
	};

	var _addLoader = function(element) {
		var $loader = $('<div class="spinner"><div class="spinner--element"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div></div>');

		element.append($loader);
	};

	var _removeLoader = function(){
		$('.spinner').remove();
	};

	var _autoList = function(trigger, data, assemble, callback){
		var $autoList = $('<ul class="autolist"></ul>');

		// For data collection passed to function, loop through each item and assemble list based on custom template.
		for (var i=0; i < data.length; i++) {
			assemble($autoList, data[i]);
		}

		$autoList.css({'top':(trigger.position().top + 31) + 'px'});
		$('[data-autolist]').not(trigger.next()).css({'z-index':'0'});
		trigger.parent().append($autoList);

		$('li').on('click',$('.autolist'), function(){
			var chosenItem = $(this);
			callback($autoList, chosenItem);

			// Show buttons, remove list.
			$('[data-autolist]').not(trigger.next()).css({'z-index':'2'});
			trigger.parents('form').find('button').removeClass('hide');
			$('.autolist').remove();
			return false;
		});
	};

	var _findMe = function(){
		$('[data-findme]').click(function(){
			_addLoader($(this).parents('.popup'));
			navigator.geolocation.getCurrentPosition(function(position) {
				_removeLoader();
			  	console.log(position.coords.latitude, position.coords.longitude);
			});
			return false;
		});
	};

	return {
		init: init,
		addLoader: _addLoader,
		removeLoader: _removeLoader,
		autoList: _autoList,
		findme: _findMe
	};
}


module.exports = (instance ? instance : instance = UI());