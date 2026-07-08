(function () {
	const container = document.getElementById("pixel-trail");
	const quoteInner = document.querySelector(".quote-inner");
	const maskEl = document.getElementById("trail-mask");
	const maskBg = document.getElementById("trail-mask-bg");
	const maskHole = document.getElementById("trail-mask-hole");
	const FADE_DELAY = 400;
	const EXCLUDE_PADDING = 20;

	let pixelSize = 32;
	let cols = 0;
	let rows = 0;
	let pixels = [];
	let excludeLeft = -1;
	let excludeRight = -1;
	let excludeTop = -1;
	let excludeBottom = -1;
	const timers = new Map();

	function updateExclusionZone() {
		if (!quoteInner || !maskEl) return;

		const w = window.innerWidth;
		const h = window.innerHeight;
		maskEl.setAttribute("width", w);
		maskEl.setAttribute("height", h);
		maskBg.setAttribute("width", w);
		maskBg.setAttribute("height", h);

		const rect = quoteInner.getBoundingClientRect();
		const left = Math.max(0, rect.left - EXCLUDE_PADDING);
		const top = Math.max(0, rect.top - EXCLUDE_PADDING);
		const right = Math.min(w, rect.right + EXCLUDE_PADDING);
		const bottom = Math.min(h, rect.bottom + EXCLUDE_PADDING);

		excludeLeft = left;
		excludeRight = right;
		excludeTop = top;
		excludeBottom = bottom;

		maskHole.setAttribute("x", left);
		maskHole.setAttribute("y", top);
		maskHole.setAttribute("width", Math.max(0, right - left));
		maskHole.setAttribute("height", Math.max(0, bottom - top));
	}

	function buildGrid() {
		pixelSize = window.innerWidth < 768 ? 24 : 32;
		cols = Math.ceil(window.innerWidth / pixelSize);
		rows = Math.ceil(window.innerHeight / pixelSize);

		container.style.gridTemplateColumns = `repeat(${cols}, ${pixelSize}px)`;
		container.style.gridTemplateRows = `repeat(${rows}, ${pixelSize}px)`;
		container.innerHTML = "";
		timers.forEach((timer) => clearTimeout(timer));
		timers.clear();

		pixels = new Array(cols * rows);
		for (let i = 0; i < pixels.length; i++) {
			const pixel = document.createElement("div");
			pixel.className = "pixel";
			container.appendChild(pixel);
			pixels[i] = pixel;
		}

		updateExclusionZone();
	}

	function activate(index) {
		const pixel = pixels[index];
		if (!pixel) return;

		pixel.classList.remove("fade");
		pixel.style.opacity = "1";

		if (timers.has(index)) clearTimeout(timers.get(index));

		const timer = setTimeout(() => {
			pixel.classList.add("fade");
			pixel.style.opacity = "0";
			timers.delete(index);
		}, FADE_DELAY);

		timers.set(index, timer);
	}

	function handlePointer(x, y) {
		if (x >= excludeLeft && x <= excludeRight && y >= excludeTop && y <= excludeBottom) return;

		const col = Math.floor(x / pixelSize);
		const row = Math.floor(y / pixelSize);
		if (col < 0 || col >= cols || row < 0 || row >= rows) return;
		activate(row * cols + col);
	}

	let ticking = false;
	let lastX = 0;
	let lastY = 0;

	window.addEventListener("pointermove", (event) => {
		lastX = event.clientX;
		lastY = event.clientY;
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			handlePointer(lastX, lastY);
			ticking = false;
		});
	});

	let resizeTimer;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(buildGrid, 150);
	});

	buildGrid();

	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(updateExclusionZone);
	}
})();
