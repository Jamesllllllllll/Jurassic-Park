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

	// Hook up play/stop controls to Jurassic Park theme
	(function setupThemePlaybackControls() {
		try {
			const playInput = document.getElementById('play');
			const stopInput = document.getElementById('stop');
			if (!playInput || !stopInput) return;

			function ensureThemeAudio() {
				if (!window.jpThemeAudio) {
					try {
						const a = new Audio('assets/sounds/jurassic-park-theme.mp3');
						a.preload = 'auto';
						window.jpThemeAudio = a;
					} catch (_) {}
				}
				return window.jpThemeAudio;
			}

			function playTheme() {
				const a = ensureThemeAudio();
				if (!a) return;
				try {
					a.currentTime = 0;
					a.play().catch(() => {
						if (window.jpThemeGestureHandler) {
							try {
								document.removeEventListener('click', window.jpThemeGestureHandler);
								document.removeEventListener('keydown', window.jpThemeGestureHandler);
								document.removeEventListener('touchstart', window.jpThemeGestureHandler);
							} catch (_) {}
						}
						const handler = () => {
							a.play().finally(() => {
								try {
									document.removeEventListener('click', handler);
									document.removeEventListener('keydown', handler);
									document.removeEventListener('touchstart', handler);
								} catch (_) {}
								window.jpThemeGestureHandler = null;
							});
						};
						window.jpThemeGestureHandler = handler;
						document.addEventListener('click', handler, { once: true });
						document.addEventListener('keydown', handler, { once: true });
						document.addEventListener('touchstart', handler, { once: true });
					});
				} catch (_) {}
			}

			function stopTheme() {
				const a = window.jpThemeAudio;
				if (!a) return;
				try {
					a.pause();
					a.currentTime = 0;
				} catch (_) {}
				if (window.jpThemeGestureHandler) {
					try {
						document.removeEventListener('click', window.jpThemeGestureHandler);
						document.removeEventListener('keydown', window.jpThemeGestureHandler);
						document.removeEventListener('touchstart', window.jpThemeGestureHandler);
					} catch (_) {}
					window.jpThemeGestureHandler = null;
				}
			}

			playInput.addEventListener('change', function () {
				if (playInput.checked) {
					playTheme();
				}
			});
			stopInput.addEventListener('change', function () {
				if (stopInput.checked) {
					stopTheme();
				}
			});
		} catch (_) {}
	})();
});


