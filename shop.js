// shop.js – Produkte als Cards anzeigen + Warenkorb mit Entfernen + Demo-Bezahlen

document.addEventListener("DOMContentLoaded", function () {
    const productGrid = document.querySelector("#productGrid");
    const searchInput = document.querySelector("#searchInput");
    const categorySelect = document.querySelector("#categorySelect");
    const veganCheckbox = document.querySelector("#veganOnly");
    const statusText = document.querySelector("#statusText");

    const cartButton = document.querySelector("#cartButton");
    const cartOverlay = document.querySelector("#cartOverlay");
    const cartClose = document.querySelector("#cartClose");
    const cartItemsContainer = document.querySelector("#cartItems");
    const cartTotal = document.querySelector("#cartTotal");
    const cartCount = document.querySelector("#cartCount");
    const cartPayButton = document.querySelector("#cartPayButton");

    let allProducts = [];
    let cart = [];

    // Produkte aus JSON laden
    fetch("products.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Konnte products.json nicht laden");
            }
            return response.json();
        })
        .then(data => {
            allProducts = data;
            renderCards(allProducts);
            statusText.textContent = `Anzahl Produkte: ${allProducts.length}`;
        })
        .catch(error => {
            console.error(error);
            statusText.textContent = "Fehler beim Laden der Produktdaten.";
        });

    // Cards rendern
    function renderCards(products) {
        productGrid.innerHTML = "";

        if (products.length === 0) {
            productGrid.innerHTML = `
                <div class="col-span-full text-center text-sm text-slate-500 bg-white/70 border border-dashed border-amber-200 rounded-xl py-8">
                    Keine Produkte gefunden. Filter anpassen?
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const name = product.name || "";
            const beschreibung = product.beschreibung || product.Beschreibung || "";
            const kategorie = product.kategorie || "";
            const preis = product.preis != null ? product.preis.toFixed(2) : "";
            const vegan = product.vegan === true;
            const imageUrl = product.image || "https://via.placeholder.com/400x250?text=Chocadies";

            const badgeVegan = vegan
                ? `<span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">Vegan</span>`
                : `<span class="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-100">Mit Milch</span>`;

            const card = document.createElement("article");
            card.className =
                "bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-amber-100 overflow-hidden flex flex-col";

            card.innerHTML = `
                <div class="relative h-40 overflow-hidden">
                    <img
                        src="${imageUrl}"
                        alt="${name}"
                        class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    >
                    <div class="absolute top-2 left-2 inline-flex items-center rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-amber-50">
                        ${kategorie || "Produkt"}
                    </div>
                </div>
                <div class="p-4 flex flex-col flex-1">
                    <div class="flex items-start justify-between gap-2 mb-2">
                        <h2 class="text-sm font-semibold text-slate-900 leading-snug">
                            ${name}
                        </h2>
                        ${badgeVegan}
                    </div>
                    <p class="text-xs text-slate-600 flex-1">
                        ${beschreibung}
                    </p>
                    <div class="mt-4 flex items-center justify-between">
                        <div class="text-sm font-semibold text-amber-800">
                            CHF ${preis}
                        </div>
                        <button
                            type="button"
                            class="add-to-cart inline-flex items-center rounded-full bg-amber-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                            data-id="${product.id}"
                        >
                            In den Warenkorb
                        </button>
                    </div>
                </div>
            `;

            productGrid.appendChild(card);
        });
    }

    // Filter anwenden
    function applyFilters() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedCategory = categorySelect.value;
        const veganOnly = veganCheckbox.checked;

        const filtered = allProducts.filter(product => {
            const name = (product.name || "").toLowerCase();
            const beschreibung =
                (product.beschreibung || product.Beschreibung || "").toLowerCase();
            const kategorie = (product.kategorie || "").toLowerCase();

            const combinedText = `${name} ${beschreibung} ${kategorie}`;
            const textMatch = combinedText.includes(searchTerm);

            const categoryMatch =
                selectedCategory === "alle" ||
                product.kategorie === selectedCategory;

            const veganMatch =
                !veganOnly || product.vegan === true;

            return textMatch && categoryMatch && veganMatch;
        });

        renderCards(filtered);
        statusText.textContent = `Anzahl Produkte (gefiltert): ${filtered.length}`;
    }

    // Warenkorb-Logik
    function addToCart(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        cart.push(product);
        updateCartBadge();
    }

    function removeFromCart(index) {
        if (index < 0 || index >= cart.length) return;
        cart.splice(index, 1);
        updateCartBadge();
        renderCart();
    }

    function updateCartBadge() {
        const count = cart.length;
        cartCount.textContent = count.toString();
    }

    function renderCart() {
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <p class="text-xs text-slate-500">
                    Der Warenkorb ist leer. Fuege Produkte hinzu, indem du auf
                    <span class="font-semibold">„In den Warenkorb“</span> klickst.
                </p>
            `;
            cartTotal.textContent = "CHF 0.00";
            return;
        }

        let total = 0;

        cart.forEach((item, index) => {
            const price = item.preis || 0;
            total += price;

            const row = document.createElement("div");
            row.className = "flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0";

            row.innerHTML = `
                <div class="flex-1">
                    <p class="text-xs font-medium text-slate-900">
                        ${item.name}
                    </p>
                    <p class="text-[11px] text-slate-500">
                        Kategorie: ${item.kategorie || "-"}
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-xs font-semibold text-amber-800">
                        CHF ${price.toFixed(2)}
                    </span>
                    <button
                        type="button"
                        class="remove-from-cart text-[11px] text-red-500 hover:text-red-700"
                        data-index="${index}"
                    >
                        🗑️
                    </button>
                </div>
            `;

            cartItemsContainer.appendChild(row);
        });

        cartTotal.textContent = `CHF ${total.toFixed(2)}`;
    }

    function openCart() {
        renderCart();
        cartOverlay.classList.remove("hidden");
        cartOverlay.classList.add("flex");
    }

    function closeCart() {
        cartOverlay.classList.add("hidden");
        cartOverlay.classList.remove("flex");
    }

    function payCart() {
        if (cart.length === 0) {
            alert("Der Warenkorb ist leer. Bitte zuerst Produkte hinzufuegen.");
            return;
        }

        const total = cart.reduce((sum, item) => {
            const price = item.preis || 0;
            return sum + price;
        }, 0);

        alert(
            `Bezahlung von CHF ${total.toFixed(2)} wurde (fiktiv) ausgefuehrt.\n\n` +
            `Zahlungsmethode: Kreditkarte (Demo).`
        );

        // Warenkorb leeren nach „Bezahlung“
        cart = [];
        updateCartBadge();
        renderCart();
        closeCart();
    }

    // Event Listener fuer Filter
    searchInput.addEventListener("input", applyFilters);
    categorySelect.addEventListener("change", applyFilters);
    veganCheckbox.addEventListener("change", applyFilters);

    // Event Listener fuer "In den Warenkorb" (Event Delegation)
    productGrid.addEventListener("click", function (event) {
        const button = event.target.closest(".add-to-cart");
        if (!button) return;

        const id = Number(button.getAttribute("data-id"));
        if (!Number.isNaN(id)) {
            addToCart(id);
        }
    });

    // Warenkorb-Oeffnen / Schliessen
    cartButton.addEventListener("click", openCart);
    cartClose.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", function (event) {
        if (event.target === cartOverlay) {
            closeCart();
        }
    });

    // Entfernen-Buttons im Warenkorb (Event Delegation)
    cartItemsContainer.addEventListener("click", function (event) {
        const button = event.target.closest(".remove-from-cart");
        if (!button) return;
        const index = Number(button.getAttribute("data-index"));
        if (!Number.isNaN(index)) {
            removeFromCart(index);
        }
    });

    // Demo-Zahlung
    cartPayButton.addEventListener("click", payCart);
});