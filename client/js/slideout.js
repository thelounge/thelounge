"use strict";

const menu = document.getElementById("sidebar");

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
		menu.classList.toggle("menu-open", state);
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

	if ((!menuIsOpen && touch.screenX < 50) || (menuIsOpen && touch.screenX > menuWidth)) {
		touchStartPos = touch;
		touchCurPos = touch;
		touchStartTime = Date.now();

		menu.classList.toggle("menu-dragging", true);
		document.body.addEventListener("touchmove", onTouchMove);
		document.body.addEventListener("touchend", onTouchEnd, {passive: true});
	}
}

function onTouchMove(e) {
	const touch = touchCurPos = e.touches.item(0);
	let setX = touch.screenX - touchStartPos.screenX;

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

	menu.style.transform = "translate3d(" + setX + "px, 0, 0)";

	if (menuIsMoving) {
		e.preventDefault();
		e.stopPropagation();
	}
}

function onTouchEnd() {
	const diff = touchCurPos.screenX - touchStartPos.screenX;
	const absDiff = Math.abs(diff);

	if (absDiff > menuWidth / 2 || Date.now() - touchStartTime < 180 && absDiff > 50) {
		SlideoutMenu.toggle(diff > 0);
	}

	document.body.removeEventListener("touchmove", onTouchMove);
	document.body.removeEventListener("touchend", onTouchEnd);
	menu.classList.toggle("menu-dragging", false);
	menu.style.transform = null;

	touchStartPos = null;
	touchCurPos = null;
	touchStartTime = 0;
	menuIsMoving = false;
}

module.exports = SlideoutMenu;
