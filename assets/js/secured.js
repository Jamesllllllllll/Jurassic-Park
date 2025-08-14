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
		markers.forEach((marker, index) => {
			const delayMs = 400 + index * 200;
			const id = setTimeout(() => {
				marker.classList.add('secured-on');
				const label = marker.querySelector('.secured-label');
				if (label) {
					label.textContent = 'Secured';
				}
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


