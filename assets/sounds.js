document.addEventListener('DOMContentLoaded', function () {
	// Play sound 3 seconds after page load, with user-gesture fallback if blocked
	(function setupDelayedAudio() {
		try {
			const audio = new Audio('assets/sounds/its-a-unix-system.mp3');
			audio.preload = 'auto';
			const clearInteracts = (handler) => {
				document.removeEventListener('click', handler);
				document.removeEventListener('keydown', handler);
				document.removeEventListener('touchstart', handler);
			};
			setTimeout(() => {
				audio.play().catch(() => {
					const handler = () => {
						audio.play().finally(() => clearInteracts(handler));
					};
					document.addEventListener('click', handler, { once: true });
					document.addEventListener('keydown', handler, { once: true });
					document.addEventListener('touchstart', handler, { once: true });
				});
			}, 3000);
		} catch (_) {
			// no-op
		}
	})();
});


