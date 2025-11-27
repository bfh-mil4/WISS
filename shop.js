// shop.js

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#productTableBody");
    const searchInput = document.querySelector("#searchInput");
    const categorySelect = document.querySelector("#categorySelect");
    const veganCheckbox = document.querySelector("#veganOnly");
    const statusText = document.querySelector("#statusText");

    let allProducts = [];

    // Produkte aus der JSON-Datei laden
    fetch("products.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Konnte products.json nicht laden");
            }
            return response.json();
        })
        .then(data => {
            allProducts = data;
            renderTable(allProducts);
            statusText.textContent = `Anzahl Produkte: ${allProducts.length}`;
        })
        .catch(error => {
            console.error(error);
            statusText.textContent = "Fehler beim Laden der Produktdaten.";
        });

    // Tabelle neu aufbauen
    function renderTable(products) {
        tableBody.innerHTML = "";

        if (products.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 5;
            cell.textContent = "Keine Produkte gefunden.";
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        products.forEach(product => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = product.name;
            row.appendChild(nameCell);

            const categoryCell = document.createElement("td");
            categoryCell.textContent = product.kategorie;
            row.appendChild(categoryCell);

            const descCell = document.createElement("td");
            descCell.textContent = product.beschreibung;
            row.appendChild(descCell);

            const priceCell = document.createElement("td");
            priceCell.textContent = `CHF ${product.preis.toFixed(2)}`;
            row.appendChild(priceCell);

            const veganCell = document.createElement("td");
            veganCell.textContent = product.vegan ? "Ja" : "Nein";
            row.appendChild(veganCell);

            tableBody.appendChild(row);
        });
    }

    // Filter anwenden
    function applyFilters() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedCategory = categorySelect.value;
        const veganOnly = veganCheckbox.checked;

        const filtered = allProducts.filter(product => {
            // Textsuche in Name + Beschreibung
            const textMatch =
                product.name.toLowerCase().includes(searchTerm) ||
                product.beschreibung.toLowerCase().includes(searchTerm);

            // Kategorie-Filter (oder "alle")
            const categoryMatch =
                selectedCategory === "alle" ||
                product.kategorie === selectedCategory;

            // Vegan-Filter
            const veganMatch =
                !veganOnly || product.vegan === true;

            return textMatch && categoryMatch && veganMatch;
        });

        renderTable(filtered);
        statusText.textContent = `Anzahl Produkte (gefiltert): ${filtered.length}`;
    }

    // Event Listener fuer Filter
    searchInput.addEventListener("input", applyFilters);
    categorySelect.addEventListener("change", applyFilters);
    veganCheckbox.addEventListener("change", applyFilters);
});
