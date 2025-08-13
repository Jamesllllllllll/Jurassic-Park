document.addEventListener('DOMContentLoaded', function () {
	const holdButton = document.querySelector('.controls .hold');
	const quitButton = document.querySelector('.controls .quit');
	const newButton = document.querySelector('.controls .new');
	const planTop = document.querySelector('.plan-top');
	if (!holdButton || !planTop) return;

	holdButton.setAttribute('aria-pressed', planTop.classList.contains('secured-active') ? 'true' : 'false');

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
	});

	if (quitButton) {
		quitButton.addEventListener('click', function (e) {
			e.preventDefault();
			// cancel Hold state/animation
			planTop.classList.remove('secured-active');
			holdButton.setAttribute('aria-pressed', 'false');
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


