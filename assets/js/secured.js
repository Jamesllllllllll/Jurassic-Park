document.addEventListener('DOMContentLoaded', function () {
	const holdButton = document.querySelector('.controls .hold');
	const quitButton = document.querySelector('.controls .quit');
	const newButton = document.querySelector('.controls .new');
	const planTop = document.querySelector('.plan-top');
	const markers = Array.from(document.querySelectorAll('.secured-marker'));
	const allDoorLines = Array.from(document.querySelectorAll('.door-bar'));
	const markerTimeouts = [];
	if (!holdButton || !planTop) return;

	holdButton.setAttribute('aria-pressed', planTop.classList.contains('secured-active') ? 'true' : 'false');

	function clearMarkerTimeouts() {
		while (markerTimeouts.length) {
			const id = markerTimeouts.pop();
			clearTimeout(id);
		}
	}

	function setMarkersSecuredActiveWithStagger() {
		clearMarkerTimeouts();
		function lockIcon(iconSvg) {
			if (!iconSvg) return;
			try {
				const pathEl = iconSvg.querySelector('path');
				if (!pathEl) return;
				if (!iconSvg.dataset.origStrokeWidth) {
					iconSvg.dataset.origStrokeWidth = iconSvg.getAttribute('stroke-width') || '';
				}
				if (!pathEl.dataset.origD) {
					pathEl.dataset.origD = pathEl.getAttribute('d') || '';
				}
				iconSvg.setAttribute('stroke-width', '4');
				pathEl.setAttribute('stroke-linecap', 'round');
				pathEl.setAttribute('stroke-linejoin', 'round');
				pathEl.setAttribute('d', 'M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z');
			} catch (_) { }
		}

		function unlockIcon(iconSvg) {
			if (!iconSvg) return;
			try {
				const pathEl = iconSvg.querySelector('path');
				if (!pathEl) return;
				if (iconSvg.dataset.origStrokeWidth) {
					iconSvg.setAttribute('stroke-width', iconSvg.dataset.origStrokeWidth);
				}
				if (pathEl.dataset.origD) {
					pathEl.setAttribute('d', pathEl.dataset.origD);
				}
			} catch (_) { }
		}

		markers.forEach((marker, index) => {
			const delayMs = 400 + index * 200;
			const id = setTimeout(() => {
				marker.classList.add('secured-on');
				const label = marker.querySelector('.secured-label');
				if (label) {
					label.textContent = 'Secured';
				}
				const iconSvg = marker.querySelector('.secured-icon');
				lockIcon(iconSvg);
				// rotate any doors inside this marker around their local start (0,0)
				const localDoors = marker.querySelectorAll('.door-bar');
				localDoors.forEach((lineEl) => {
					const angle = Number(lineEl.getAttribute('data-rotate-on') || '0');
					lineEl.setAttribute('transform', `rotate(${angle} 0 0)`);
				});
			}, delayMs);
			markerTimeouts.push(id);
		});
	}

	function clearMarkersSecuredState() {
		clearMarkerTimeouts();
		markers.forEach((marker) => {
			marker.classList.remove('secured-on');
			const label = marker.querySelector('.secured-label');
			if (label) {
				label.textContent = 'Unlocked';
			}
			const iconSvg = marker.querySelector('.secured-icon');
			// restore original/unlocked icon
			(function unlockIcon(iconSvg) {
				if (!iconSvg) return;
				try {
					const pathEl = iconSvg.querySelector('path');
					if (!pathEl) return;
					if (iconSvg.dataset.origStrokeWidth) {
						iconSvg.setAttribute('stroke-width', iconSvg.dataset.origStrokeWidth);
					}
					if (pathEl.dataset.origD) {
						pathEl.setAttribute('d', pathEl.dataset.origD);
					}
				} catch (_) { }
			})(iconSvg);
		});
		// reset door rotations
		allDoorLines.forEach((lineEl) => lineEl.removeAttribute('transform'));
	}

	holdButton.addEventListener('click', function (e) {
		e.preventDefault();
		if (window.clearBSOD) {
			window.clearBSOD();
		}
		const nowActive = planTop.classList.toggle('secured-active');
		holdButton.setAttribute('aria-pressed', nowActive ? 'true' : 'false');
		const symbol = document.querySelector('.status .symbol p');
		if (symbol) {
			symbol.classList.toggle('alert');
		}
		if (markers.length) {
			if (nowActive) {
				setMarkersSecuredActiveWithStagger();
			} else {
				clearMarkersSecuredState();
			}
		}
	});

	if (quitButton) {
		quitButton.addEventListener('click', function (e) {
			e.preventDefault();
			planTop.classList.remove('secured-active');
			holdButton.setAttribute('aria-pressed', 'false');
			clearMarkersSecuredState();
			const symbol = document.querySelector('.status .symbol p');
			if (symbol) {
				symbol.classList.remove('alert');
			}
			if (window.triggerBSOD) {
				window.triggerBSOD();
			}
		});
	}

	if (newButton) {
		newButton.addEventListener('click', function (e) {
			e.preventDefault();
			if (window.clearBSOD) {
				window.clearBSOD();
			}
		});
	}
});


