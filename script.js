// Wird ausgefuehrt, sobald das DOM geladen ist (wegen "defer" im Script-Tag)
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const captchaCheckbox = document.getElementById("captcha");
    const toast = document.getElementById("toast");

    // Hilfsfunktion: Toast anzeigen
    function showToast(message, type = "success") {
        toast.textContent = message;
        toast.classList.remove("error", "success");
        toast.classList.add(type);
        toast.classList.add("show");

        // Toast nach 3 Sekunden automatisch ausblenden
        setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }

    // Form-Submit abfangen
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Verhindert das Standard-Form-Verhalten

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const captchaChecked = captchaCheckbox.checked;

        // Einfache Validierung
        if (!email || !password) {
            showToast("Bitte E-Mail und Passwort eingeben.", "error");
            return;
        }

        if (!captchaChecked) {
            showToast("Bitte bestaetigen, dass Sie kein Roboter sind.", "error");
            return;
        }

        // Wenn alles ok ist: Erfolgsmeldung
        showToast("Login erfolgreich! Weiterleitung zur Chocadies-Bestell-App ...", "success");

        // Simulierte Weiterleitung nach 1.5 Sekunden
        setTimeout(function () {
            // Hier kann spaeter eine eigene Seite der Bestell-App eingefuegt werden,
            // z. B. window.location.href = "shop.html";
            window.location.href = "shop.html";
        }, 1500);
    });
});
