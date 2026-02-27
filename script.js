(function () {
    "use strict";

    function setCurrentYear() {
        document.querySelectorAll("[data-current-year]").forEach(function (node) {
            node.textContent = String(new Date().getFullYear());
        });
    }

    function setupNavbar() {
        var nav = document.querySelector(".navbar");
        var navLinks = document.querySelector(".nav-links");
        var toggle = document.querySelector(".mobile-menu-toggle");

        function closeMenu() {
            if (!navLinks || !toggle) return;
            navLinks.classList.remove("mobile-menu-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
        }

        if (toggle && navLinks) {
            toggle.addEventListener("click", function (event) {
                event.stopPropagation();
                var isOpen = navLinks.classList.toggle("mobile-menu-open");
                toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
                toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
            });
        }

        document.addEventListener("click", function (event) {
            if (!nav) return;
            if (!nav.contains(event.target)) {
                closeMenu();
                document.querySelectorAll(".nav-dropdown.dropdown-open").forEach(function (dropdown) {
                    dropdown.classList.remove("dropdown-open");
                    var trigger = dropdown.querySelector(".nav-dropdown-trigger");
                    if (trigger) trigger.setAttribute("aria-expanded", "false");
                });
            }
        });

        document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
            var trigger = dropdown.querySelector(".nav-dropdown-trigger");
            if (!trigger) return;
            trigger.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                var isOpening = !dropdown.classList.contains("dropdown-open");
                document.querySelectorAll(".nav-dropdown.dropdown-open").forEach(function (openDropdown) {
                    if (openDropdown !== dropdown) {
                        openDropdown.classList.remove("dropdown-open");
                        var openTrigger = openDropdown.querySelector(".nav-dropdown-trigger");
                        if (openTrigger) openTrigger.setAttribute("aria-expanded", "false");
                    }
                });
                dropdown.classList.toggle("dropdown-open", isOpening);
                trigger.setAttribute("aria-expanded", isOpening ? "true" : "false");
            });
            dropdown.querySelectorAll(".nav-dropdown-menu a").forEach(function (link) {
                link.addEventListener("click", function () {
                    dropdown.classList.remove("dropdown-open");
                    trigger.setAttribute("aria-expanded", "false");
                    if (navLinks) navLinks.classList.remove("mobile-menu-open");
                });
            });
        });

        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener("click", function (event) {
                var href = anchor.getAttribute("href");
                if (!href || href === "#" || href.length < 2) return;
                var target = document.querySelector(href);
                if (!target) return;
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                closeMenu();
            });
        });

        if (nav) {
            var updateNavbarState = function () {
                nav.classList.toggle("scrolled", window.scrollY > 8);
            };
            updateNavbarState();
            window.addEventListener("scroll", updateNavbarState);
        }
    }

    function setupRevealAnimations() {
        var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var revealNodes = document.querySelectorAll(".reveal");

        if (reducedMotion || !("IntersectionObserver" in window)) {
            revealNodes.forEach(function (node) { node.classList.add("visible"); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.16, rootMargin: "0px 0px -20px 0px" });

        revealNodes.forEach(function (node) { observer.observe(node); });
    }

    function setupDashboardDemo() {
        var scenarios = Array.isArray(window.OPERATIONS_SCENARIOS) ? window.OPERATIONS_SCENARIOS : [];
        if (!scenarios.length) return;

        var pills = document.querySelectorAll("[data-scenario]");
        var titleEl = document.querySelector("[data-ops-title]");
        var summaryEl = document.querySelector("[data-ops-summary]");
        var mockScreens = document.querySelectorAll("[data-mock]");
        var idx = 0;

        var isMobile = window.matchMedia("(max-width: 767px)");

        function render(s) {
            if (titleEl) titleEl.textContent = s.title;
            if (summaryEl) summaryEl.textContent = (isMobile.matches && s.mobileSummary) ? s.mobileSummary : s.summary;
            mockScreens.forEach(function (m) {
                m.classList.toggle("active", m.getAttribute("data-mock") === s.id);
            });
            pills.forEach(function (p) {
                var isActive = p.getAttribute("data-scenario") === s.id;
                p.classList.toggle("active", isActive);
                p.setAttribute("aria-selected", isActive ? "true" : "false");
            });
        }

        render(scenarios[0]);

        pills.forEach(function (pill) {
            pill.addEventListener("click", function () {
                var id = pill.getAttribute("data-scenario");
                for (var i = 0; i < scenarios.length; i++) {
                    if (scenarios[i].id === id) { idx = i; render(scenarios[i]); break; }
                }
            });
        });

        setInterval(function () {
            idx = (idx + 1) % scenarios.length;
            render(scenarios[idx]);
        }, 6000);
    }

    function setupConversationFeed() {
        var threads = Array.isArray(window.CONVERSATION_THREADS) ? window.CONVERSATION_THREADS : [];
        var stage = document.querySelector("[data-convo-feed]");
        if (!threads.length || !stage) return;

        var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var LABELS = { inventory: "Inventory Check", staffing: "Staffing Gap", reporting: "CEO Reporting", performance: "Team Performance" };
        var MSG_DELAY = 1200;
        var TYPING_DURATION = 600;
        var DWELL_AFTER = 3000;

        function buildMsgHTML(msg) {
            var isAgent = msg.role === "AI";
            var initials = isAgent ? "T" : msg.speaker.split(" ").map(function (w) { return w[0]; }).join("").substring(0, 2);
            return '<div class="convo-avatar" style="background:' + msg.color + '">' + initials + '</div>' +
                '<div class="convo-body">' +
                    '<span class="convo-speaker">' + msg.speaker + '<span class="convo-role">' + msg.role + '</span></span>' +
                    '<div class="convo-text">' + msg.message.replace(/\n/g, "<br>") + '</div>' +
                '</div>';
        }

        var allCards = threads.map(function (thread) {
            var card = document.createElement("div");
            card.className = "convo-card";
            card.innerHTML =
                '<div class="convo-card-header">' +
                    '<span class="convo-card-title">' + (LABELS[thread.id] || thread.id) + '</span>' +
                    '<span class="convo-card-time">' + thread.time + '</span>' +
                '</div>' +
                '<div class="convo-card-body"></div>';
            return { el: card, body: card.querySelector(".convo-card-body"), messages: thread.messages, timer: null };
        });

        var pairs = [];
        for (var p = 0; p < allCards.length; p += 2) {
            var pairDiv = document.createElement("div");
            pairDiv.className = "convo-pair";
            var pairCards = allCards.slice(p, Math.min(p + 2, allCards.length));
            pairCards.forEach(function (c) { pairDiv.appendChild(c.el); });
            pairs.push({ el: pairDiv, cards: pairCards });
            stage.appendChild(pairDiv);
        }

        var indWrap = document.createElement("div");
        indWrap.className = "convo-indicators";
        pairs.forEach(function (_, i) {
            var ind = document.createElement("div");
            ind.className = "convo-ind" + (i === 0 ? " active" : "");
            indWrap.appendChild(ind);
        });
        stage.appendChild(indWrap);
        var indicators = indWrap.querySelectorAll(".convo-ind");

        var currentPair = 0;

        function setClasses() {
            pairs.forEach(function (pair, i) {
                pair.el.classList.toggle("front", i === currentPair);
                pair.el.classList.toggle("back", i !== currentPair);
            });
            for (var k = 0; k < indicators.length; k++) {
                indicators[k].classList.toggle("active", k === currentPair);
            }
        }

        function playCard(cardObj, onDone) {
            var body = cardObj.body;
            var msgs = cardObj.messages;
            var i = 0;

            function showNext() {
                if (i >= msgs.length) { if (onDone) onDone(); return; }

                var msg = msgs[i];
                var isAgent = msg.role === "AI";

                if (!reducedMotion) {
                    var typingEl = document.createElement("div");
                    typingEl.className = "convo-msg" + (isAgent ? " agent" : "") + " visible";
                    typingEl.innerHTML = '<div class="convo-avatar" style="background:' + msg.color + '"></div>' +
                        '<div class="convo-body"><div class="convo-typing"><span></span><span></span><span></span></div></div>';
                    body.appendChild(typingEl);
                    body.scrollTop = body.scrollHeight;

                    cardObj.timer = setTimeout(function () {
                        if (typingEl.parentNode) body.removeChild(typingEl);
                        appendMessage();
                    }, TYPING_DURATION);
                } else {
                    appendMessage();
                }

                function appendMessage() {
                    var wrapper = document.createElement("div");
                    wrapper.className = "convo-msg" + (isAgent ? " agent" : "");
                    wrapper.innerHTML = buildMsgHTML(msg);
                    if (reducedMotion) wrapper.classList.add("visible");

                    body.appendChild(wrapper);
                    body.scrollTop = body.scrollHeight;

                    if (!reducedMotion) {
                        requestAnimationFrame(function () { wrapper.classList.add("visible"); });
                    }

                    i++;
                    if (i < msgs.length) {
                        cardObj.timer = setTimeout(showNext, MSG_DELAY);
                    } else {
                        if (onDone) onDone();
                    }
                }
            }

            showNext();
        }

        function playPair(pairIdx) {
            var pair = pairs[pairIdx];
            var cardIndex = 0;

            pair.cards.forEach(function (c) { c.body.innerHTML = ""; });

            function playNext() {
                if (cardIndex >= pair.cards.length) {
                    setTimeout(function () {
                        currentPair = (currentPair + 1) % pairs.length;
                        setClasses();
                        playPair(currentPair);
                    }, DWELL_AFTER);
                    return;
                }
                playCard(pair.cards[cardIndex], function () {
                    cardIndex++;
                    playNext();
                });
            }

            playNext();
        }

        function start() {
            setClasses();
            playPair(0);
        }

        if (reducedMotion || !("IntersectionObserver" in window)) {
            start();
            return;
        }

        var sectionEl = stage.closest(".conversations-section") || stage.parentElement;
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    start();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        obs.observe(sectionEl);
    }

    function openCalendlyWidget() {
        var calendlyUrl = "https://calendly.com/lightspeed-insights/30min";
        if (window.Calendly && typeof window.Calendly.initPopupWidget === "function") {
            window.Calendly.initPopupWidget({ url: calendlyUrl });
            return;
        }
        window.open(calendlyUrl, "_blank", "width=900,height=680");
    }

    window.openCalendly = function openCalendly() {
        if (!window.Calendly) {
            var script = document.createElement("script");
            script.src = "https://assets.calendly.com/assets/external/widget.js";
            script.onload = openCalendlyWidget;
            document.head.appendChild(script);
            return;
        }
        openCalendlyWidget();
    };

    window.openFreeTrial = function openFreeTrial() {
        window.openCalendly();
    };

    function setupShowcase() {
        var showcase = document.querySelector("[data-showcase]");
        if (!showcase) return;

        var floats = showcase.querySelectorAll(".showcase-float");

        function start() {
            floats[0] && setTimeout(function () { floats[0].classList.add("visible"); }, 600);
            floats[1] && setTimeout(function () { floats[1].classList.add("visible"); }, 1200);
            floats[2] && setTimeout(function () { floats[2].classList.add("visible"); }, 1800);
        }

        if (!("IntersectionObserver" in window)) { start(); return; }

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    start();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        obs.observe(showcase);
    }

    function setupBlogFilters() {
        var filters = document.querySelectorAll("[data-filter]");
        var cards = document.querySelectorAll("[data-category]");
        if (!filters.length || !cards.length) return;

        filters.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var cat = btn.getAttribute("data-filter");
                filters.forEach(function (f) { f.classList.remove("active"); });
                btn.classList.add("active");
                cards.forEach(function (card) {
                    if (cat === "all" || card.getAttribute("data-category") === cat) {
                        card.classList.remove("hidden");
                    } else {
                        card.classList.add("hidden");
                    }
                });
            });
        });
    }

    function setupBackToTopButton() {
        if (!window.matchMedia || !window.matchMedia("(max-width: 767px)").matches) return;
        if (document.querySelector(".back-to-top")) return;

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "back-to-top";
        btn.setAttribute("aria-label", "Back to top");
        btn.textContent = "↑";

        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        document.body.appendChild(btn);

        var updateVisibility = function () {
            btn.classList.toggle("visible", window.scrollY > 320);
        };

        updateVisibility();
        window.addEventListener("scroll", updateVisibility, { passive: true });
        window.addEventListener("resize", updateVisibility);
    }

    document.addEventListener("DOMContentLoaded", function () {
        setCurrentYear();
        setupNavbar();
        setupRevealAnimations();
        setupShowcase();
        setupDashboardDemo();
        setupConversationFeed();
        setupBlogFilters();
        setupBackToTopButton();
    });
})();
