"use strict";

/**
 * Simple slideout menu implementation.
 */
module.exports = function slideoutMenu(viewport, menu) {
	var touchStartPos = null;
	var touchCurPos = null;
	var touchStartTime = 0;
	var menuWidth = 0;
	var menuIsOpen = false;
	var menuIsMoving = false;

	function toggleMenu(state) {
		menuIsOpen = state;
		viewport.classList.toggle("menu-open", state);
	}

	function disableSlideout() {
		viewport.removeEventListener("ontouchstart", onTouchStart);
	}

	function onTouchStart(e) {
		if (e.touches.length !== 1) {
			onTouchEnd();
			return;
		}

		var touch = e.touches.item(0);
		viewport.classList.toggle("menu-dragging", true);

		menuWidth = parseFloat(window.getComputedStyle(menu).width);

		if ((!menuIsOpen && touch.screenX < 50) || (menuIsOpen && touch.screenX > menuWidth)) {
			touchStartPos = touch;
			touchCurPos = touch;
			touchStartTime = Date.now();

			viewport.addEventListener("touchmove", onTouchMove);
			viewport.addEventListener("touchend", onTouchEnd, {passive: true});
		}
	}

	function onTouchMove(e) {
		var touch = touchCurPos = e.touches.item(0);
		var setX = touch.screenX - touchStartPos.screenX;

		if (Math.abs(setX > 30)) {
			menuIsMoving = true;
		}

		if (!menuIsMoving && Math.abs(touch.screenY - touchStartPos.screenY) > 30) {
			onTouchEnd();
			return;
		}

		if (menuIsOpen) {
			setX += menuWidth;
		}

		if (setX > menuWidth) {
			setX = menuWidth;
		} else if (setX < 0) {
			setX = 0;
		}

		viewport.style.transform = "translate3d(" + setX + "px, 0, 0)";

		if (menuIsMoving) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	function onTouchEnd() {
		var diff = touchCurPos.screenX - touchStartPos.screenX;
		var absDiff = Math.abs(diff);

		if (absDiff > menuWidth / 2 || Date.now() - touchStartTime < 180 && absDiff > 50) {
			toggleMenu(diff > 0);
		}

		viewport.removeEventListener("touchmove", onTouchMove);
		viewport.removeEventListener("touchend", onTouchEnd);
		viewport.classList.toggle("menu-dragging", false);
		viewport.style.transform = null;

		touchStartPos = null;
		touchCurPos = null;
		touchStartTime = 0;
		menuIsMoving = false;
	}

	viewport.addEventListener("touchstart", onTouchStart, {passive: true});

	return {
		disable: disableSlideout,
		toggle: toggleMenu,
		isOpen: function() {
			return menuIsOpen;
		}
	};
};
