"use strict";

let touchStartPos = null;
let touchCurPos = null;
let touchStartTime = 0;
let menuWidth = 0;
let menuIsOpen = false;
let menuIsMoving = false;
let menuIsAbsolute = false;

class SlideoutMenu {
	static enable() {
		this.viewport = document.getElementById("viewport");
		this.menu = document.getElementById("sidebar");
		this.sidebarOverlay = document.getElementById("sidebar-overlay");

		document.body.addEventListener("touchstart", onTouchStart, {passive: true});
	}

	static toggle(state) {
		menuIsOpen = state;
		this.viewport.classList.toggle("menu-open", state);
	}

	static isOpen() {
		return menuIsOpen;
	}
}

function onTouchStart(e) {
	if (e.touches.length !== 1) {
		onTouchEnd();
		return;
	}

	const touch = e.touches.item(0);
	const styles = window.getComputedStyle(SlideoutMenu.menu);

	menuWidth = parseFloat(styles.width);
	menuIsAbsolute = styles.position === "absolute";

	if (!menuIsOpen || touch.screenX > menuWidth) {
		touchStartPos = touch;
		touchCurPos = touch;
		touchStartTime = Date.now();

		document.body.addEventListener("touchmove", onTouchMove, {passive: true});
		document.body.addEventListener("touchend", onTouchEnd, {passive: true});
	}
}

function onTouchMove(e) {
	const touch = touchCurPos = e.touches.item(0);
	let distX = touch.screenX - touchStartPos.screenX;
	const distY = touch.screenY - touchStartPos.screenY;

	if (!menuIsMoving) {
		// tan(45°) is 1. Gestures in 0°-45° (< 1) are considered horizontal, so
		// menu must be open; gestures in 45°-90° (>1) are considered vertical, so
		// chat windows must be scrolled.
		if (Math.abs(distY / distX) >= 1) {
			onTouchEnd();
			return;
		}

		const devicePixelRatio = window.devicePixelRatio || 2;

		if (Math.abs(distX) > devicePixelRatio) {
			SlideoutMenu.viewport.classList.toggle("menu-dragging", true);
			menuIsMoving = true;
		}
	}

	// Do not animate the menu on desktop view
	if (!menuIsAbsolute) {
		return;
	}

	if (menuIsOpen) {
		distX += menuWidth;
	}

	if (distX > menuWidth) {
		distX = menuWidth;
	} else if (distX < 0) {
		distX = 0;
	}

	SlideoutMenu.menu.style.transform = "translate3d(" + distX + "px, 0, 0)";
	SlideoutMenu.sidebarOverlay.style.opacity = distX / menuWidth;
}

function onTouchEnd() {
	const diff = touchCurPos.screenX - touchStartPos.screenX;
	const absDiff = Math.abs(diff);

	if (absDiff > menuWidth / 2 || Date.now() - touchStartTime < 180 && absDiff > 50) {
		SlideoutMenu.toggle(diff > 0);
	}

	document.body.removeEventListener("touchmove", onTouchMove);
	document.body.removeEventListener("touchend", onTouchEnd);
	SlideoutMenu.viewport.classList.toggle("menu-dragging", false);
	SlideoutMenu.menu.style.transform = null;
	SlideoutMenu.sidebarOverlay.style.opacity = null;

	touchStartPos = null;
	touchCurPos = null;
	touchStartTime = 0;
	menuIsMoving = false;
}

module.exports = SlideoutMenu;
