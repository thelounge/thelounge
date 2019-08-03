"use strict";

class SlideoutMenu {
	enable() {
		this.viewport = document.getElementById("viewport");
		this.menu = document.getElementById("sidebar");
		this.sidebarOverlay = document.getElementById("sidebar-overlay");

		this.touchStartPos = null;
		this.touchCurPos = null;
		this.touchStartTime = 0;
		this.menuWidth = 0;
		this.menuIsOpen = false;
		this.menuIsMoving = false;
		this.menuIsAbsolute = false;

		this.onTouchStart = (e) => {
			this.touchStartPos = this.touchCurPos = e.touches.item(0);

			if (e.touches.length !== 1) {
				this.onTouchEnd();
				return;
			}

			const styles = window.getComputedStyle(this.menu);

			this.menuWidth = parseFloat(styles.width);
			this.menuIsAbsolute = styles.position === "absolute";

			if (!this.menuIsOpen || this.touchStartPos.screenX > this.menuWidth) {
				this.touchStartTime = Date.now();

				document.body.addEventListener("touchmove", this.onTouchMove, {passive: true});
				document.body.addEventListener("touchend", this.onTouchEnd, {passive: true});
			}
		};

		this.onTouchMove = (e) => {
			const touch = (this.touchCurPos = e.touches.item(0));
			let distX = touch.screenX - this.touchStartPos.screenX;
			const distY = touch.screenY - this.touchStartPos.screenY;

			if (!this.menuIsMoving) {
				// tan(45°) is 1. Gestures in 0°-45° (< 1) are considered horizontal, so
				// menu must be open; gestures in 45°-90° (>1) are considered vertical, so
				// chat windows must be scrolled.
				if (Math.abs(distY / distX) >= 1) {
					this.onTouchEnd();
					return;
				}

				const devicePixelRatio = window.devicePixelRatio || 2;

				if (Math.abs(distX) > devicePixelRatio) {
					this.viewport.classList.toggle("menu-dragging", true);
					this.menuIsMoving = true;
				}
			}

			// Do not animate the menu on desktop view
			if (!this.menuIsAbsolute) {
				return;
			}

			if (this.menuIsOpen) {
				distX += this.menuWidth;
			}

			if (distX > this.menuWidth) {
				distX = this.menuWidth;
			} else if (distX < 0) {
				distX = 0;
			}

			this.menu.style.transform = "translate3d(" + distX + "px, 0, 0)";
			this.sidebarOverlay.style.opacity = distX / this.menuWidth;
		};

		this.onTouchEnd = () => {
			const diff = this.touchCurPos.screenX - this.touchStartPos.screenX;
			const absDiff = Math.abs(diff);

			if (
				absDiff > this.menuWidth / 2 ||
				(Date.now() - this.touchStartTime < 180 && absDiff > 50)
			) {
				this.toggle(diff > 0);
			}

			document.body.removeEventListener("touchmove", this.onTouchMove);
			document.body.removeEventListener("touchend", this.onTouchEnd);
			this.viewport.classList.toggle("menu-dragging", false);
			this.menu.style.transform = null;
			this.sidebarOverlay.style.opacity = null;

			this.touchStartPos = null;
			this.touchCurPos = null;
			this.touchStartTime = 0;
			this.menuIsMoving = false;
		};

		document.body.addEventListener("touchstart", this.onTouchStart, {passive: true});
	}

	toggle(state) {
		this.menuIsOpen = state;
		this.viewport.classList.toggle("menu-open", state);
	}

	isOpen() {
		return this.menuIsOpen;
	}
}

module.exports = new SlideoutMenu();
