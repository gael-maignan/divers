(function (window, document) {
    "use strict";

    function initSmoothScroll(userOptions = {}) {
        const config = {
            MOBILE_BREAKPOINT: 768,
            baseEase: 0.05,
            maxEase: 0.5,
            distanceFactor: 2500,
            stopThreshold: 0.35,
            scrollMult: 1,
            minPageHeightRatio: 1.05,
            offset: 0,
            ...userOptions
        };

        const state = {
            enabled: false,
            running: false,
            current: 0,
            target: 0,
            maxScroll: 0
        };

        const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

        /* ---------- Utils ---------- */

        function updateMaxScroll() {
            state.maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;
        }

        function isMobile() {
            return window.innerWidth < config.MOBILE_BREAKPOINT;
        }

        function pageTooShort() {
            return (
                document.documentElement.scrollHeight <=
                window.innerHeight * config.minPageHeightRatio
            );
        }

        function setNativeScrollBehavior() {
            const behavior = isMobile() ? "smooth" : "auto";
            document.documentElement.style.scrollBehavior = behavior;
            document.body.style.scrollBehavior = behavior;
        }

        /* ---------- Core ---------- */

        function enable() {
            if (state.enabled) return;

            state.enabled = true;
            updateMaxScroll();

            state.current = state.target = window.scrollY;

            window.addEventListener("wheel", onWheel, { passive: false });
            window.addEventListener("scroll", syncScroll, { passive: true });
        }

        function disable() {
            if (!state.enabled) return;

            state.enabled = false;
            state.running = false;

            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("scroll", syncScroll);
        }

        function onWheel(e) {
            if (e.ctrlKey) return;
            e.preventDefault();

            updateMaxScroll();

            state.target = clamp(
                state.target + e.deltaY * config.scrollMult,
                0,
                state.maxScroll
            );

            start();
        }

        function syncScroll() {
            if (!state.running) {
                state.current = state.target = window.scrollY;
            }
        }

        function start() {
            if (state.running) return;
            state.running = true;
            requestAnimationFrame(render);
        }

        function render() {
            if (!state.enabled) return;

            updateMaxScroll();
            state.target = clamp(state.target, 0, state.maxScroll);

            const diff = state.target - state.current;

            if (Math.abs(diff) < config.stopThreshold) {
                state.current = state.target;
                window.scrollTo(0, state.current);
                state.running = false;
                return;
            }

            const ratio = Math.min(1, Math.abs(diff) / config.distanceFactor);
            const ease =
                config.baseEase +
                (config.maxEase - config.baseEase) * ratio;

            state.current += diff * ease;
            window.scrollTo(0, state.current);

            requestAnimationFrame(render);
        }

        /* ---------- Anchors ---------- */

        function setupAnchors() {
            if (isMobile()) return; // 🔑 laisse le CSS gérer les ancres

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener("click", e => {
                    const targetEl = document.querySelector(
                        anchor.getAttribute("href")
                    );
                    if (!targetEl) return;

                    e.preventDefault();
                    updateMaxScroll();

                    state.current = state.target = window.scrollY;
                    state.target =
                        targetEl.getBoundingClientRect().top +
                        window.scrollY +
                        config.offset;

                    state.target = clamp(state.target, 0, state.maxScroll);
                    start();
                });
            });
        }

        /* ---------- State ---------- */

        function checkState() {
            if (isMobile() || pageTooShort()) {
                disable();
            } else {
                enable();
            }
        }

        /* ---------- Init ---------- */

        setNativeScrollBehavior();
        checkState();
        setupAnchors();

        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setNativeScrollBehavior();
                updateMaxScroll();
                checkState();
            }, 120);
        });
    }

    window.initSmoothScroll = initSmoothScroll;

})(window, document);

window.addEventListener("load", () => {
    initSmoothScroll();
});