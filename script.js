function showAlert() {
    alert("System Online: Welcome to Citri Software!");
    console.log("Programming logic is active.");
}

// Lazy-load video sources on user interaction to avoid upfront downloads
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('video.product-trailer').forEach(function (vid) {
        if (!vid.dataset || !vid.dataset.src) return;
        let loaded = false;
        const loadAndPlay = function (ev) {
            if (loaded) return;
            // add <source> and load
            const src = document.createElement('source');
            src.src = vid.dataset.src;
            src.type = 'video/mp4';
            vid.appendChild(src);
            vid.load();
            loaded = true;
            // if this came from a user gesture, play
            if (ev && (ev.type === 'click' || ev.type === 'play')) {
                vid.play().catch(() => {});
            }
        };
        // load on first click or when user hits play control
        vid.addEventListener('click', loadAndPlay, { once: true });
        vid.addEventListener('play', loadAndPlay, { once: true });
    });
});



// (Overlay scrollbar removed) — no custom overlay script

