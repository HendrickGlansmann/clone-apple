document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       MENU PRINCIPAL + BLUR
    ========================================================= */

    const body = document.body;
    const navbar = document.querySelector(".navbar");

    if (navbar) {

        navbar.addEventListener("show.bs.dropdown", () => {
            body.classList.add("menu-open");
            closeSearch();
        });

        navbar.addEventListener("hidden.bs.dropdown", () => {

            const dropdownAberto =
                navbar.querySelector(".dropdown-menu.show");

            if (!dropdownAberto) {
                body.classList.remove("menu-open");
            }

        });

    }


    /* =========================================================
       PESQUISA PELA LUPA
    ========================================================= */

    let searchOverlay = null;
    let searchInput = null;

    function createSearch() {

        if (!navbar || searchOverlay) return;

        searchOverlay = document.createElement("div");

        searchOverlay.className = "apple-search-overlay";

        searchOverlay.innerHTML = `
            <div class="apple-search-box">

                <input
                    class="apple-search-input"
                    type="search"
                    placeholder="Buscar produtos"
                    autocomplete="off"
                >

                <button
                    class="apple-search-close"
                    type="button"
                >
                    ×
                </button>

            </div>
        `;

        navbar.insertAdjacentElement(
            "afterend",
            searchOverlay
        );

        searchInput =
            searchOverlay.querySelector(".apple-search-input");

        const closeButton =
            searchOverlay.querySelector(".apple-search-close");

        closeButton.addEventListener(
            "click",
            closeSearch
        );

        searchOverlay.addEventListener(
            "click",
            (event) => {

                if (event.target === searchOverlay) {
                    closeSearch();
                }

            }
        );

        searchInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {
                    closeSearch();
                }

                if (event.key === "Enter") {

                    const termo =
                        searchInput.value.trim();

                    if (termo !== "") {

                        console.log(
                            "Pesquisa:",
                            termo
                        );

                    }

                }

            }
        );

    }


    function openSearch() {

        createSearch();

        if (!searchOverlay) return;

        body.classList.add("search-open");

        searchOverlay.classList.add("is-open");

        setTimeout(() => {
            searchInput.focus();
        }, 100);

    }


    function closeSearch() {

        if (!searchOverlay) return;

        body.classList.remove("search-open");

        searchOverlay.classList.remove("is-open");

    }


    /*
        PEGA A LUPA

        No seu HTML ela é o penúltimo item
        da navbar.
    */

    const navItems = navbar
        ? [...navbar.querySelectorAll(".nav-item")]
        : [];

    const searchItem =
        navItems.length >= 2
            ? navItems[navItems.length - 2]
            : null;

    const searchButton =
        searchItem?.querySelector(".nav-link");


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                if (
                    body.classList.contains(
                        "search-open"
                    )
                ) {
                    closeSearch();

                } else {
                    openSearch();
                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeSearch();
            }

        }
    );


    /* =========================================================
       MEDIA GALLERY / CARROSSEL AUTOMÁTICO
    ========================================================= */

    const gallery =
        document.querySelector("#tv-gallery");


    if (gallery) {

        const items =
            [...gallery.querySelectorAll(
                ".media-gallery-item"
            )];

        const dots =
            [...gallery.querySelectorAll(
                ".media-gallery-dotnav-link"
            )];

        const playPauseButton =
            gallery.querySelector(
                ".media-gallery-dotnav-iconcontrol"
            );


        let currentIndex =
            items.findIndex(item =>
                item.classList.contains("current")
            );


        if (currentIndex < 0) {
            currentIndex = 0;
        }


        let autoplayTimer = null;

        let playing = true;

        const intervalTime = 4160;


        function showSlide(index) {

            currentIndex =
                (index + items.length)
                % items.length;


            items.forEach(
                (item, itemIndex) => {

                    const active =
                        itemIndex === currentIndex;


                    item.classList.toggle(
                        "js-gallery-active",
                        active
                    );

                    item.setAttribute(
                        "aria-hidden",
                        !active
                    );

                }
            );


            dots.forEach(
                (dot, dotIndex) => {

                    const active =
                        dotIndex === currentIndex;


                    dot.setAttribute(
                        "aria-selected",
                        active
                    );


                    dot.closest(
                        ".media-gallery-dotnav-item"
                    )
                    ?.classList.toggle(
                        "current",
                        active
                    );

                }
            );

        }


        function nextSlide() {

            showSlide(
                currentIndex + 1
            );

        }


        function startAutoplay() {

            stopAutoplay();

            playing = true;

            gallery.classList.add(
                "js-gallery-playing"
            );

            gallery.classList.remove(
                "js-gallery-paused"
            );


            autoplayTimer =
                setInterval(
                    nextSlide,
                    intervalTime
                );

        }


        function stopAutoplay() {

            if (autoplayTimer) {

                clearInterval(
                    autoplayTimer
                );

                autoplayTimer = null;

            }

        }


        /*
            CLICAR NOS PONTINHOS
        */

        dots.forEach(
            (dot, index) => {

                dot.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();

                        showSlide(index);

                        if (playing) {
                            startAutoplay();
                        }

                    }
                );

            }
        );


        /*
            PLAY / PAUSE
        */

        if (playPauseButton) {

            playPauseButton.addEventListener(
                "click",
                () => {

                    if (playing) {

                        playing = false;

                        stopAutoplay();

                        gallery.classList.remove(
                            "js-gallery-playing"
                        );

                        gallery.classList.add(
                            "js-gallery-paused"
                        );

                    } else {

                        playing = true;

                        startAutoplay();

                    }

                }
            );

        }


        /*
            PAUSA QUANDO O MOUSE
            ESTÁ EM CIMA
        */

        gallery.addEventListener(
            "mouseenter",
            () => {

                if (playing) {
                    stopAutoplay();
                }

            }
        );


        gallery.addEventListener(
            "mouseleave",
            () => {

                if (playing) {
                    startAutoplay();
                }

            }
        );


        /*
            INICIA A GALERIA
        */

        showSlide(currentIndex);

        startAutoplay();

    }


    /* =========================================================
       CSS DAS INTERAÇÕES
    ========================================================= */

    const style =
        document.createElement("style");


    style.textContent = `

        /* =========================
           MENU
        ========================= */

        .navbar {
            position: relative;
            z-index: 2000;
        }


        .navbar .dropdown-menu {

            opacity: 0;

            transform:
                translateY(-8px);

            transition:
                opacity .25s ease,
                transform .25s ease;

        }


        .navbar .dropdown-menu.show {

            opacity: 1;

            transform:
                translateY(0);

        }


        /* BLUR NA PÁGINA */

        body.menu-open main,
        body.menu-open footer,
        body.search-open main,
        body.search-open footer {

            filter:
                blur(10px);

            transition:
                filter .3s ease;

            pointer-events: none;

        }


        main,
        footer {

            transition:
                filter .3s ease;

        }


        /* =========================
           PESQUISA
        ========================= */

        .apple-search-overlay {

            position: fixed;

            top: 44px;
            left: 0;
            right: 0;

            z-index: 3000;

            padding:
                30px 20px 40px;

            background:
                rgba(255, 255, 255, .97);

            backdrop-filter:
                blur(20px);

            display: flex;

            justify-content:
                center;

            opacity: 0;

            visibility: hidden;

            transform:
                translateY(-20px);

            transition:
                .25s ease;

        }


        .apple-search-overlay.is-open {

            opacity: 1;

            visibility: visible;

            transform:
                translateY(0);

        }


        .apple-search-box {

            width:
                min(700px, 100%);

            display: flex;

            align-items: center;

            border-bottom:
                1px solid #d2d2d7;

        }


        .apple-search-input {

            width: 100%;

            padding:
                15px;

            border: none;

            outline: none;

            background:
                transparent;

            font-size:
                24px;

        }


        .apple-search-close {

            border: none;

            background:
                transparent;

            font-size:
                32px;

            cursor: pointer;

        }


        /* =========================
           MEDIA GALLERY
        ========================= */

        #tv-gallery
        .media-gallery-item-container {

            position: relative !important;

            transform: none !important;

            transition: none !important;

        }


        #tv-gallery
        .media-gallery-item {

            position: absolute !important;

            inset: 0;

            width: 100% !important;

            opacity: 0 !important;

            visibility: hidden;

            pointer-events: none;

            transition:
                opacity .7s ease,
                visibility .7s ease !important;

        }


        #tv-gallery
        .media-gallery-item.js-gallery-active {

            position: relative !important;

            opacity: 1 !important;

            visibility: visible;

            pointer-events: auto;

        }


        /* ÍCONE PLAY / PAUSE */

        #tv-gallery.js-gallery-playing
        .media-gallery-dotnav-iconcontrol-pause {

            display: block;

        }


        #tv-gallery.js-gallery-playing
        .media-gallery-dotnav-iconcontrol-play {

            display: none;

        }


        #tv-gallery.js-gallery-paused
        .media-gallery-dotnav-iconcontrol-pause {

            display: none;

        }


        #tv-gallery.js-gallery-paused
        .media-gallery-dotnav-iconcontrol-play {

            display: block;

        }

    `;


    document.head.appendChild(style);

});