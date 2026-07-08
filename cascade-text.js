(function () {
	function splitIntoChars(el) {
		const text = el.dataset.cascade || el.textContent;
		el.textContent = "";
		[...text].forEach((char, i) => {
			const span = document.createElement("span");
			span.className = "cascade-char";
			span.style.setProperty("--i", i);
			span.textContent = char === " " ? " " : char;
			el.appendChild(span);
		});
	}

	function play(el) {
		const chars = el.querySelectorAll(".cascade-char");
		chars.forEach((char) => {
			char.classList.remove("cascade-play");
			void char.offsetWidth;
			char.classList.add("cascade-play");
		});
	}

	const AUTOPLAY_INTERVAL = 30000;

	document.querySelectorAll("[data-cascade]").forEach((el) => {
		splitIntoChars(el);
		el.addEventListener("pointerenter", () => play(el));
		setInterval(() => play(el), AUTOPLAY_INTERVAL);
	});
})();
