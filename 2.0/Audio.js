let pop;
try {
	pop = new Audio();
	pop.src = require('clientUI/audio/pop.ogg');
} catch (e) {
	pop = {
		play: $.noop
	};
}

export const playPop = () => {
	pop.play();
};
