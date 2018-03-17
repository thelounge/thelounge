"use strict";

const viewport = document.getElementById("viewport");
const menu = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

let touchStartPos = null;
let touchCurPos = null;
let touchStartTime = 0;
let menuWidth = 0;
let menuIsOpen = false;
let menuIsMoving = false;

class SlideoutMenu {
	static enable() {
		document.body.addEventListener("touchstart", onTouchStart, {passive: true});
	}

	static toggle(state) {
		menuIsOpen = state;
		viewport.classList.toggle("menu-open", state);
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

	menuWidth = parseFloat(window.getComputedStyle(menu).width);

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
	let setX = touch.screenX - touchStartPos.screenX;

	if (!menuIsMoving) {
		const devicePixelRatio = window.devicePixelRatio || 2;

		if (Math.abs(touch.screenY - touchStartPos.screenY) > devicePixelRatio) {
			onTouchEnd();
			return;
		}

		if (Math.abs(setX) > devicePixelRatio) {
			viewport.classList.toggle("menu-dragging", true);
			menuIsMoving = true;
		}
	}

	if (menuIsOpen) {
		setX += menuWidth;
	}

	if (setX > menuWidth) {
		setX = menuWidth;
	} else if (setX < 0) {
		setX = 0;
	}

	menu.style.transform = "translate3d(" + setX + "px, 0, 0)";
	sidebarOverlay.style.opacity = setX / menuWidth;
}

function onTouchEnd() {
	const diff = touchCurPos.screenX - touchStartPos.screenX;
	const absDiff = Math.abs(diff);

	if (absDiff > menuWidth / 2 || Date.now() - touchStartTime < 180 && absDiff > 50) {
		SlideoutMenu.toggle(diff > 0);
	}

	document.body.removeEventListener("touchmove", onTouchMove);
	document.body.removeEventListener("touchend", onTouchEnd);
	viewport.classList.toggle("menu-dragging", false);
	menu.style.transform = null;
	sidebarOverlay.style.opacity = null;

	touchStartPos = null;
	touchCurPos = null;
	touchStartTime = 0;
	menuIsMoving = false;
}

module.exports = SlideoutMenu;
