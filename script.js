// script.js

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const captchaCheckbox = document.getElementById("captcha");
    const toast = document.getElementById("toast");

    // Wenn kein Formular vorhanden ist (z. B. auf shop.html), nichts tun
    if (!form) {
        return;
    }

    // Toast-Hilfsfunktion
    function showToast(message, type = "success") {
        toast.textContent = message;
        toast.classList.remove("error", "success");
        toast.classList.add(type);
        toast.classList.add("show");

        setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const captchaChecked = captchaCheckbox.checked;

        // Einfache E-Mail-Validierung
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            showToast("Bitte E-Mail und Passwort eingeben.", "error");
            return;
        }

        if (!emailRegex.test(email)) {
            showToast("Bitte eine gueltige E-Mail-Adresse eingeben.", "error");
            return;
        }

        if (!captchaChecked) {
            showToast("Bitte bestaetigen, dass Sie kein Roboter sind.", "error");
            return;
        }

        // Erfolgreicher Login
        showToast("Login erfolgreich! Weiterleitung zur Chocadies-Bestell-App ...", "success");

        setTimeout(function () {
            // Weiterleitung auf die Shop-Seite im gleichen Ordner
            window.location.href = "shop.html";
        }, 1500);
    });
});
